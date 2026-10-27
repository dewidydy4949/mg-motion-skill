// Reference discovery is distinct from selecting a directly reusable template.
// This module does not inspect media or infer a complete storyboard from a brief.
const normalized = value => String(value ?? '').normalize('NFKC').toLowerCase();
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const textArray = value => Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim());
const hasTerm = (query, term) => {
  if (/^[a-z0-9 -]+$/.test(term)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(?:^|[^a-z0-9])' + escaped + '(?:$|[^a-z0-9])').test(query);
  }
  return query.includes(term);
};

export function validateReferenceLibrary(library, catalog) {
  if (!object(library) || library.schemaVersion !== 1 || !object(library.expressions) || !Array.isArray(library.references)) {
    throw new Error('reference-library.json 需要 schemaVersion: 1、expressions 与 references');
  }
  const available = new Set(catalog.templates.map(item => item.id));
  const ids = new Set();
  for (const [key, expression] of Object.entries(library.expressions)) {
    if (!object(expression) || typeof expression.label !== 'string' || typeof expression.description !== 'string' || !textArray(expression.keywords)) {
      throw new Error(`参考分类 ${key} 需要 label、description、keywords`);
    }
  }
  for (const item of library.references) {
    if (!object(item) || !available.has(item.id) || ids.has(item.id)) throw new Error('参考 ID 未注册或重复：' + item?.id);
    ids.add(item.id);
    if (!['core', 'extended'].includes(item.tier)) throw new Error(item.id + ' 的 tier 需为 core 或 extended');
    if (!textArray(item.expressions) || !item.expressions.length || item.expressions.some(key => !Object.hasOwn(library.expressions, key))) {
      throw new Error(item.id + ' 引用了未知或空的表达分类');
    }
    if (!textArray(item.learn) || !item.learn.length || typeof item.adapt !== 'string' || typeof item.reason !== 'string' || !textArray(item.related)) {
      throw new Error(item.id + ' 需要 learn、adapt、reason 和 related');
    }
  }
  for (const item of library.references) {
    if (item.related.some(id => !ids.has(id) || id === item.id)) throw new Error(item.id + ' 的 related 需要引用其他真实参考 ID');
  }
  return library;
}

function descriptor(template, selection, rule, reference) {
  const range = template.sourceRange;
  const sourceSeconds = Array.isArray(range) && range.length === 2 && range.every(Number.isFinite) ? range[1] - range[0] : null;
  return {
    id: template.id, title: template.title, tier: reference.tier,
    expressions: reference.expressions, style: template.style,
    learn: reference.learn, adapt: reference.adapt, reason: reference.reason,
    related: reference.related, evidence: reference.evidence ?? [],
    preview: template.preview, previewKind: 'rendered-template-still', card: template.card,
    modelSource: 'assets/engine/' + template.modelSource,
    originDuration: {sourceClipSeconds: sourceSeconds, catalogSampleSeconds: template.sampleSeconds ?? null, defaultUsageSeconds: template.usageSeconds ?? null},
    source: {id: template.sourceId ?? null, range: range ?? null, originalVideoIncluded: false},
    referenceRender: {
      command: `node scripts/mg.mjs render ${template.id} --variant reference --out work/reference-${template.id}.mp4`,
      note: '命令重渲染库内参考版，不是原始样片；按需要补 --browser。静态预览不能证明运动效果，查看使用卡、源码或实际渲染。',
    },
    referenceUse: '学习构图、对象动作和衔接方法；参考片长不限制新片总时长，也不表示源码可任意拉长。',
    directUse: {
      status: 'requires-content-and-render-check',
      semanticIntents: rule?.semanticIntents ?? [], forbiddenIntents: rule?.forbiddenIntents ?? [],
      motionMeaning: rule?.motionMeaning ?? null, requirementsByIntent: rule?.requirementsByIntent ?? {},
      duration: selection?.duration ?? null, capacity: selection?.capacity ?? null,
      mediaSlots: selection?.mediaSlots ?? [], avoid: selection?.avoid ?? null,
      family: rule?.family ?? null,
    },
  };
}

export function describeReference(catalog, selection, compatibility, library, id) {
  validateReferenceLibrary(library, catalog);
  const reference = library.references.find(item => item.id === id);
  if (!reference) return null;
  return descriptor(catalog.templates.find(item => item.id === id), selection.templates.find(item => item.id === id), compatibility?.templates.find(item => item.id === id), reference);
}

export function browseReferences(catalog, selection, compatibility, library, brief = '', options = {}) {
  validateReferenceLibrary(library, catalog);
  const query = normalized(brief).trim();
  for (const key of Object.keys(options)) if (!['expression', 'all', 'limit'].includes(key)) {
    throw new Error(`refs 不支持 --${key}；参考片长不限制新片时长，直接复用筛选请用 match`);
  }
  if (options.all !== undefined && typeof options.all !== 'boolean') throw new Error('--all 为不带值的开关');
  const expression = options.expression === undefined ? null : normalized(options.expression).trim();
  if (expression !== null && !Object.hasOwn(library.expressions, expression)) {
    throw new Error('未知 --expression：' + expression + '；可选：' + Object.keys(library.expressions).join(', '));
  }
  const limit = Number(options.limit ?? (query ? 5 : 50));
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error('--limit 必须为 1–50 的整数');
  const byId = new Map(catalog.templates.map(item => [item.id, item]));
  const selections = new Map(selection.templates.map(item => [item.id, item]));
  const rules = new Map((compatibility?.templates ?? []).map(item => [item.id, item]));
  const candidates = [];
  for (const reference of library.references) {
    if (!options.all && reference.tier !== 'core') continue;
    if (expression !== null && !reference.expressions.includes(expression)) continue;
    const template = byId.get(reference.id), item = selections.get(reference.id);
    const keywords = [...new Set((item?.keywords ?? []).map(normalized))].filter(term => term.length >= 2);
    const expressionKeywords = [...new Set(reference.expressions.flatMap(key => {
      const group = library.expressions[key];
      return [key, group.label, ...group.keywords].map(normalized);
    }))].filter(term => term.length >= 2);
    const matchedTerms = query ? keywords.filter(term => hasTerm(query, term)) : [];
    const matchedExpressionTerms = query ? expressionKeywords.filter(term => hasTerm(query, term)) : [];
    const exactId = query && hasTerm(query, reference.id.toLowerCase());
    const exactTitle = query && query.includes(normalized(template.title));
    if (query && !exactId && !exactTitle && !matchedTerms.length && !matchedExpressionTerms.length) continue;
    const score = (exactId ? 100 : 0) + (exactTitle ? 30 : 0) + matchedTerms.reduce((n, term) => n + Math.min(term.length, 6), 0) + matchedExpressionTerms.length * 2;
    candidates.push({...descriptor(template, item, rules.get(reference.id), reference), score, matchedTerms, matchedExpressionTerms});
  }
  if (query) candidates.sort((a, b) => b.score - a.score || Number(a.tier !== 'core') - Number(b.tier !== 'core') || a.id.localeCompare(b.id));
  const expressions = Object.entries(library.expressions).map(([key, value]) => ({
    key, label: value.label, description: value.description,
    coreCount: library.references.filter(item => item.tier === 'core' && item.expressions.includes(key)).length,
    totalCount: library.references.filter(item => item.expressions.includes(key)).length,
  }));
  // A catalog overview should not load every parameter constraint into context.
  // A focused query/category or inspect expands the selected reference details.
  const detailed = Boolean(query || expression !== null);
  const selected = candidates.slice(0, limit).map(row => detailed ? row : {
    id: row.id, title: row.title, tier: row.tier, expressions: row.expressions,
    style: row.style, preview: row.preview, card: row.card, learnSummary: row.learn[0],
  });
  return {
    query: String(brief ?? ''), scope: options.all ? 'all-references' : 'core-references',
    filters: {expression, limit}, expressions,
    detailLevel: detailed ? 'reference-detail' : 'browse-summary',
    detailCommand: 'node scripts/mg.mjs inspect <ID>',
    totalMatches: candidates.length, candidates: selected,
    note: candidates.length
      ? '这是参考资料短名单，按词表与表达分类排序，不是文案理解或自动分镜。先看参考再设计整段画面；directUse 中的语义、素材、容量和时长条件只约束直接复用。'
      : '没有符合当前词表或分类的参考。可不带查询浏览表达分类，或用 --all 查看备用参考；不要为了匹配而改变文案含义，也不自动退回固定卡片。',
  };
}
