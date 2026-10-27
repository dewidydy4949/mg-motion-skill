// Deterministic shortlist only. The agent still inspects the user's material and candidates.
const normalized = value => String(value ?? '').normalize('NFKC').toLowerCase();
const hasTerm = (query, term) => {
  if (/^[a-z0-9 ]+$/.test(term)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(?:^|[^a-z0-9])' + escaped + '(?:$|[^a-z0-9])').test(query);
  }
  return query.includes(term);
};

export function recommend(catalog, selection, brief, options = {}, compatibility) {
  const query = normalized(brief).trim();
  if (!query) throw new Error('match 需要一段表达目标，例如“手机问答，逐条出现并突出回复”');
  const media = options.media ?? 'any';
  if (!['any', 'image', 'video'].includes(media)) throw new Error('--media 只接受 image、video 或 any');
  const seconds = options.duration === undefined ? null : Number(options.duration);
  if (seconds !== null && (!Number.isFinite(seconds) || seconds <= 0)) throw new Error('--duration 必须为正数');
  const limit = Number(options.limit ?? 3);
  if (!Number.isInteger(limit) || limit < 1 || limit > 10) throw new Error('--limit 必须是 1–10 的整数');
  const intent = options.intent === undefined ? null : normalized(options.intent).trim();
  const family = options.family === undefined ? null : normalized(options.family).trim();
  const rules = new Map((compatibility?.templates ?? []).map(item => [item.id, item]));
  if ((intent !== null || family !== null) && !compatibility) throw new Error('语义/风格筛选需要 compatibility.json，不能静默忽略筛选条件');
  if (intent !== null && !Object.hasOwn(compatibility?.intents ?? {}, intent)) throw new Error('未知 --intent：' + intent + '；可选：' + Object.keys(compatibility?.intents ?? {}).join(', '));
  if (family !== null && ![...rules.values()].some(rule => rule.family === family)) throw new Error('未知 --family：' + family + '；从 inspect 或候选的 family 字段选择，不用颜色名称猜测');
  const byId = new Map(catalog.templates.map(item => [item.id, item]));
  const rows = [];
  for (const item of selection.templates) {
    const template = byId.get(item.id);
    if (!template) continue;
    const rule = rules.get(item.id);
    // Declared meaning is a hard constraint, even when the query names an exact ID.
    if (intent !== null && (!rule?.semanticIntents?.includes(intent) || rule.forbiddenIntents?.includes(intent))) continue;
    if (family !== null && rule?.family !== family) continue;
    const slots = item.mediaSlots ?? [];
    if (media !== 'any' && !slots.some(s => (s.binding ?? 'asset') === 'asset' && s.types.includes(media))) continue;
    const duration = item.duration ?? {};
    if (seconds !== null && ((duration.min !== null && duration.min !== undefined && seconds < duration.min) || (duration.max !== null && duration.max !== undefined && seconds > duration.max))) continue;
    const hits = [...new Set(item.keywords.map(normalized).filter(term => term.length >= 2 && hasTerm(query, term)))];
    const exactId = query.includes(item.id.toLowerCase());
    const title = normalized(template.title);
    const exactTitle = query.includes(title);
    // Explicit intent/family can produce a shortlist without exact catalog vocabulary.
    if (!hits.length && !exactId && !exactTitle && intent === null && family === null) continue;
    const score = hits.reduce((sum, term) => sum + Math.min(term.length, 6), 0) + (exactId ? 100 : 0) + (exactTitle ? 30 : 0);
    rows.push({
      id: item.id, title: template.title, score, matchedTerms: hits,
      intent: item.intent, style: template.style, duration,
      family: rule?.family ?? null,
      semanticIntents: rule?.semanticIntents ?? [],
      motionMeaning: rule?.motionMeaning ?? null,
      requiredProps: intent === null ? null : rule?.requirementsByIntent?.[intent] ?? null,
      mediaSlots: slots, capacity: item.capacity, avoid: item.avoid,
      card: template.card, preview: template.preview,
      durationNeedsValidation: seconds !== null && (duration.min == null || duration.max == null),
    });
  }
  rows.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return {
    query: brief, filters: {media, seconds, intent, family}, totalMatches: rows.length,
    candidates: rows.slice(0, limit),
    note: rows.length
      ? '这是词表与声明约束筛选，分数不是置信度；语义来自调用者声明，并非自动理解文案。核对 motionMeaning、requiredProps 和使用卡。family 只描述现有模板，不会自动统一颜色或跨镜头状态。连续讲解优先使用 story 计划。'
      : '没有符合当前声明、词表与能力条件的候选。不要为了拿到候选而放弃语义或必需素材约束；连续解释、到期失效等可使用 story，或在项目副本中定制。',
  };
}
