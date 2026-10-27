import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {recommend} from '../select.mjs';
import {auditPlan} from '../plan-audit.mjs';

const read = name => JSON.parse(fs.readFileSync(new URL(`../../references/${name}.json`, import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
const catalog = read('catalog'), selection = read('selection'), compatibility = read('compatibility');
const match = (query, options = {}) => recommend(catalog, selection, query, options, compatibility);
const shot = (templateId, semanticIntent, props) => ({templateId, ...(semanticIntent ? {semanticIntent} : {}), ...(props ? {props} : {})});
const code = (list, value) => list.some(entry => entry.code === value);

test('compatibility metadata covers the actual library without treating code groups as shared themes', () => {
  assert.deepEqual(compatibility.templates.map(row => row.id).sort(), catalog.templates.map(row => row.id).sort());
  assert.equal(new Set(compatibility.templates.map(row => row.id)).size, catalog.templates.length);
  for (const row of compatibility.templates) {
    assert.ok(row.semanticIntents.length > 0, row.id);
    for (const intent of row.semanticIntents) assert.ok(Object.hasOwn(compatibility.intents, intent), `${row.id}: ${intent}`);
    assert.ok(!row.semanticIntents.some(intent => row.forbiddenIntents.includes(intent)), row.id);
  }
  assert.notEqual(compatibility.templates.find(row => row.id === 'MG-017').family, compatibility.templates.find(row => row.id === 'MG-041').family);
});

test('expiry cannot match a pass/fail template even with an exact template ID', () => {
  const blocked = match('MG-022 积分到期清零', {intent: 'expiry', duration: 7});
  assert.equal(blocked.totalMatches, 0);
  const valid = match('MG-022 明确的合格阈值', {intent: 'threshold', duration: 7});
  assert.equal(valid.candidates[0].id, 'MG-022');
});

test('declared meaning can shortlist without memorizing catalog keywords', () => {
  const result = match('我要列三个判断点', {intent: 'ordinal'});
  assert.equal(result.candidates.length, 1);
  assert.equal(result.candidates[0].id, 'MG-020');
  assert.equal(result.candidates[0].requiredProps.equals, 'ordinal');
  assert.ok(!result.candidates.some(row => row.id === 'MG-047'));
});

test('family and media remain hard filters, not score bonuses', () => {
  const result = match('MG-013 同一输入', {family: 'legacy-mg-014'});
  assert.deepEqual(result.candidates.map(row => row.id), ['MG-014']);
  const missingMedia = match('截图讲解', {family: 'legacy-mg-014', media: 'video'});
  assert.equal(missingMedia.totalMatches, 0);
});

test('unknown constraints fail instead of silently broadening the search', () => {
  assert.throws(() => match('test', {intent: 'expiryy'}), /未知 --intent/);
  assert.throws(() => match('test', {family: 'blue'}), /未知 --family/);
  assert.throws(() => recommend(catalog, selection, 'test', {intent: 'expiry'}), /compatibility/);
});

test('unconstrained legacy keyword matching still returns its previous top candidate', () => {
  const result = match('手机问答，突出最后回复', {duration: 9});
  assert.equal(result.candidates[0].id, 'MG-043');
});

test('legacy mixed-template plans remain runnable but disclose the visual break', () => {
  const result = auditPlan({shots: [shot('MG-013'), shot('MG-014')]}, compatibility);
  assert.equal(result.valid, true);
  assert.ok(code(result.warnings, 'MIXED_FAMILIES'));
  assert.ok(code(result.warnings, 'UNDECLARED_INTENT'));
  assert.ok(code(result.warnings, 'CONTINUITY_NOT_PROVEN'));
});

test('coherent mode blocks unadapted mixed layouts and undeclared meaning', () => {
  const mixed = auditPlan({mode: 'coherent', shots: [shot('MG-013', 'input-distribution'), shot('MG-014', 'table-focus')]}, compatibility);
  assert.equal(mixed.valid, false);
  assert.ok(code(mixed.errors, 'MIXED_FAMILIES'));
  const undeclared = auditPlan({mode: 'coherent', shots: [shot('MG-013')]}, compatibility);
  assert.equal(undeclared.valid, false);
  assert.ok(code(undeclared.errors, 'MISSING_INTENT'));
});

test('coherent mode blocks the reported semantic misuses', () => {
  for (const [templateId, intent] of [['MG-022', 'expiry'], ['MG-032', 'cause-effect'], ['MG-047', 'criteria']]) {
    const result = auditPlan({mode: 'coherent', shots: [shot(templateId, intent)]}, compatibility);
    assert.equal(result.valid, false, templateId);
    assert.ok(code(result.errors, 'SEMANTIC_MISMATCH'), templateId);
  }
});

test('sequence mode rejects declared semantic misuse while undeclared legacy plans stay compatible', () => {
  const result = auditPlan({shots: [shot('MG-022', 'expiry')]}, compatibility);
  assert.equal(result.valid, false);
  assert.ok(code(result.errors, 'SEMANTIC_MISMATCH'));
  const legacy = auditPlan({shots: [shot('MG-022')]}, compatibility);
  assert.equal(legacy.valid, true);
  assert.ok(code(legacy.warnings, 'UNDECLARED_INTENT'));
});

test('ordinal cards require a non-counting ordinal mode on every item', () => {
  const makePlan = stats => ({mode: 'coherent', shots: [shot('MG-020', 'ordinal', {stats})]});
  const mixed = auditPlan(makePlan([{value: 1, numberMode: 'ordinal'}, {value: 2}]), compatibility);
  assert.equal(mixed.valid, false);
  assert.ok(code(mixed.errors, 'REQUIRED_PROPS'));
  const looseMode = auditPlan({...makePlan([{value: 1}]), mode: 'sequence'}, compatibility);
  assert.equal(looseMode.valid, false);
  assert.ok(code(looseMode.errors, 'REQUIRED_PROPS'));
  const valid = auditPlan(makePlan([{value: 1, numberMode: 'ordinal'}, {value: 2, numberMode: 'ordinal'}]), compatibility);
  assert.equal(valid.valid, true);
});

test('reusing a family does not claim narrative continuity', () => {
  const result = auditPlan({mode: 'coherent', shots: [shot('MG-017', 'comparison'), shot('MG-017', 'comparison')]}, compatibility);
  assert.equal(result.valid, true);
  assert.ok(!code(result.warnings, 'MIXED_FAMILIES'));
  assert.ok(code(result.warnings, 'CONTINUITY_NOT_PROVEN'));
});

test('a theme label cannot masquerade as an implemented style adaptation', () => {
  const plan = {mode: 'coherent', theme: {accent: '#123456'}, styleAdaptation: {family: 'my-project', notes: '统一排版和颜色'}, shots: [shot('MG-013', 'input-distribution'), shot('MG-014', 'table-focus')]};
  const unchanged = auditPlan(plan, compatibility);
  assert.equal(unchanged.valid, false);
  assert.ok(code(unchanged.errors, 'ADAPTATION_NEEDS_ENGINE'));
  const adapted = auditPlan(plan, compatibility, {projectEngine: true});
  assert.equal(adapted.valid, true);
  assert.ok(code(adapted.warnings, 'ADAPTATION_UNVERIFIED'));
  assert.ok(code(adapted.warnings, 'LEGACY_THEME_IGNORED'));
});

test('invalid plan declarations cannot be interpreted as an ordinary sequence', () => {
  for (const plan of [null, {mode: 'stroy', shots: [shot('MG-013')]}, {mode: 'story', beats: [], shots: []}, {shots: [shot('MG-999')]}, {shots: [shot('MG-013', 'anything')]}]) {
    assert.equal(auditPlan(plan, compatibility).valid, false);
  }
  assert.equal(auditPlan({mode: 'story', beats: [{id: 'a'}]}, compatibility).valid, true, 'story content is validated by the engine, not this legacy audit');
});
