// Deterministic shortlist only. The agent still inspects the user's material and candidates.
const normalized = value => String(value ?? '').normalize('NFKC').toLowerCase();
const hasTerm = (query, term) => {
  if (/^[a-z0-9 ]+$/.test(term)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(?:^|[^a-z0-9])' + escaped + '(?:$|[^a-z0-9])').test(query);
  }
  return query.includes(term);
};

export function recommend(catalog, selection, brief, options = {}) {
  const query = normalized(brief).trim();
  if (!query) throw new Error('match 需要一段表达目标，例如“手机问答，逐条出现并突出回复”');
  const media = options.media ?? 'any';
  if (!['any', 'image', 'video'].includes(media)) throw new Error('--media 只接受 image、video 或 any');
  const seconds = options.duration === undefined ? null : Number(options.duration);
  if (seconds !== null && (!Number.isFinite(seconds) || seconds <= 0)) throw new Error('--duration 必须为正数');
  const limit = Number(options.limit ?? 3);
  if (!Number.isInteger(limit) || limit < 1 || limit > 10) throw new Error('--limit 必须是 1–10 的整数');
  const byId = new Map(catalog.templates.map(item => [item.id, item]));
  const rows = [];
  for (const item of selection.templates) {
    const template = byId.get(item.id);
    if (!template) continue;
    const slots = item.mediaSlots ?? [];
    if (media !== 'any' && !slots.some(s => (s.binding ?? 'asset') === 'asset' && s.types.includes(media))) continue;
    const duration = item.duration ?? {};
    if (seconds !== null && ((duration.min !== null && duration.min !== undefined && seconds < duration.min) || (duration.max !== null && duration.max !== undefined && seconds > duration.max))) continue;
    const hits = [...new Set(item.keywords.map(normalized).filter(term => term.length >= 2 && hasTerm(query, term)))];
    const exactId = query.includes(item.id.toLowerCase());
    const title = normalized(template.title);
    const exactTitle = query.includes(title);
    if (!hits.length && !exactId && !exactTitle) continue;
    const score = hits.reduce((sum, term) => sum + Math.min(term.length, 6), 0) + (exactId ? 100 : 0) + (exactTitle ? 30 : 0);
    rows.push({
      id: item.id, title: template.title, score, matchedTerms: hits,
      intent: item.intent, style: template.style, duration,
      mediaSlots: slots, capacity: item.capacity, avoid: item.avoid,
      card: template.card, preview: template.preview,
      durationNeedsValidation: seconds !== null && (duration.min == null || duration.max == null),
    });
  }
  rows.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return {
    query: brief, filters: {media, seconds}, totalMatches: rows.length,
    candidates: rows.slice(0, limit),
    note: rows.length
      ? '这是词表与能力约束筛选，分数不是置信度。查看候选预览与使用卡，再按实际素材选择并运行 check。'
      : '没有符合当前词表和能力条件的候选。换用具体表达词或去掉时长筛选复查；不要强行套用不支持的素材字段。',
  };
}
