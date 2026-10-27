/**
 * Pre-render audit for independent-template plans. This checks declared meaning
 * and known template boundaries, not the truth of the brief or visual quality.
 * Story plans have their own engine validator and do not use this template map.
 */
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasText = value => typeof value === 'string' && value.trim().length > 0;

export function auditPlan(plan, compatibility, {projectEngine = false} = {}) {
  const errors = [], warnings = [];
  const add = (list, code, message, shotIndex) => list.push({code, message, ...(shotIndex === undefined ? {} : {shotIndex})});
  const finish = (mode, families = []) => ({valid: errors.length === 0, mode, families, errors, warnings});
  if (!isObject(plan)) {
    add(errors, 'INVALID_PLAN', '计划必须是 JSON 对象。');
    return finish(null);
  }
  const mode = plan.mode ?? 'sequence';
  if (!['sequence', 'coherent', 'story'].includes(mode)) {
    add(errors, 'UNKNOWN_MODE', 'mode 只接受 story、sequence 或 coherent。');
    return finish(mode);
  }
  if (mode === 'story') {
    if (plan.shots !== undefined) add(errors, 'AMBIGUOUS_PLAN', 'story 使用 beats；不要同时提供 shots。');
    return finish(mode);
  }
  if (plan.beats !== undefined) add(errors, 'AMBIGUOUS_PLAN', '独立模板计划使用 shots；beats 需要 mode: story。');
  if (!Array.isArray(plan.shots) || plan.shots.length < 1 || plan.shots.length > 100) {
    add(errors, 'INVALID_SHOTS', 'shots 必须是 1–100 个镜头。');
    return finish(mode);
  }
  if (!isObject(compatibility) || !Array.isArray(compatibility.templates) || !isObject(compatibility.intents)) {
    add(errors, 'MISSING_COMPATIBILITY', '缺少有效的 compatibility.json，不能跳过模板兼容检查。');
    return finish(mode);
  }
  const rules = new Map(compatibility.templates.map(item => [item.id, item]));
  const strict = mode === 'coherent';
  // Backward compatibility applies to undeclared legacy plans. Once callers
  // declare a meaning, known contradictions must not proceed in any mode.
  const semanticIssue = (code, message, index) => add(errors, code, message, index);
  const families = new Set();
  let undeclared = 0;
  for (const [index, shot] of plan.shots.entries()) {
    if (!isObject(shot)) {
      add(errors, 'INVALID_SHOT', `镜头 ${index + 1} 必须是对象。`, index);
      continue;
    }
    const rule = rules.get(shot.templateId);
    if (!rule) {
      add(errors, 'UNKNOWN_TEMPLATE', `镜头 ${index + 1} 的模板没有兼容记录：${String(shot.templateId)}。`, index);
      continue;
    }
    families.add(rule.family);
    const intent = shot.semanticIntent;
    if (intent === undefined) {
      undeclared++;
      if (strict) add(errors, 'MISSING_INTENT', `镜头 ${index + 1} (${shot.templateId}) 缺少 semanticIntent；coherent 模式不能只凭模板编号推断表达关系。`, index);
      continue;
    }
    if (typeof intent !== 'string' || !Object.hasOwn(compatibility.intents, intent)) {
      add(errors, 'UNKNOWN_INTENT', `镜头 ${index + 1} 的 semanticIntent 无效：${String(intent)}。从 compatibility.json 的 intents 中选择。`, index);
      continue;
    }
    if (!rule.semanticIntents?.includes(intent) || rule.forbiddenIntents?.includes(intent)) {
      semanticIssue('SEMANTIC_MISMATCH', `镜头 ${index + 1} (${shot.templateId}) 不支持 ${intent}。${rule.motionMeaning}`, index);
      continue;
    }
    const requirement = rule.requirementsByIntent?.[intent];
    if (requirement) {
      const values = shot.props?.[requirement.each];
      if (!Array.isArray(values) || values.length === 0 || !values.every(value => isObject(value) && value[requirement.property] === requirement.equals)) {
        semanticIssue('REQUIRED_PROPS', `镜头 ${index + 1} (${shot.templateId})：${requirement.message}`, index);
      }
    }
  }
  if (undeclared && !strict) add(warnings, 'UNDECLARED_INTENT', `${undeclared} 个镜头未声明 semanticIntent，旧计划仍可运行，但不能确认模板动作与文案含义一致。`);
  if (plan.theme !== undefined) add(warnings, 'LEGACY_THEME_IGNORED', '旧模板计划的 theme 不会自动改变模板配色、字体或布局。共享主题请使用 story；已有项目变体请说明实际源码改动。');
  const adaptation = plan.styleAdaptation;
  let adapted = false;
  if (adaptation !== undefined) {
    if (!isObject(adaptation) || !hasText(adaptation.family) || !hasText(adaptation.notes)) {
      add(errors, 'INVALID_ADAPTATION', 'styleAdaptation 需要非空 family 与 notes，记录项目中统一的视觉方案和实际改动。');
    } else if (!projectEngine) {
      add(errors, 'ADAPTATION_NEEDS_ENGINE', '声明 styleAdaptation 时必须提供已修改的项目引擎；仅写 family 或颜色不能改变原模板。');
    } else {
      adapted = true;
      add(warnings, 'ADAPTATION_UNVERIFIED', `使用项目引擎与声明的视觉方案 ${adaptation.family}。工具不能证明源码已实现该方案，仍需检查实际画面。`);
    }
  }
  if (families.size > 1 && !adapted) {
    const message = `计划含 ${families.size} 个独立模板风格（${[...families].join(', ')}），compose 只拼接，不会统一字体、布局、背景或主体。连续讲解改用 story，或先在项目引擎中完成适配并声明 styleAdaptation。`;
    add(strict ? errors : warnings, 'MIXED_FAMILIES', message);
  }
  if (plan.shots.length > 1) add(warnings, 'CONTINUITY_NOT_PROVEN', '即使风格相同，各模板仍会从自己的入场动作重新播放；这份计划检查不等于已确认叙事连贯。需保留主体并持续展开时优先使用 story。');
  return finish(mode, [...families]);
}
