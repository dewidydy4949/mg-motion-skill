// Run with Node 22+: node --experimental-strip-types --test scripts/tests/story.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateStory, storyFrames, locateBeat, metricValue, metricDecimals} from '../../assets/engine/src/story/schema.ts';
import {exampleStory} from '../../assets/engine/src/story/example.ts';

const plan = () => structuredClone(exampleStory);

test('example is a valid 20-second continuous story and matches the CLI example', () => {
  assert.equal(validateStory(plan()).mode, 'story');
  assert.equal(storyFrames(plan()), 600);
  const json = JSON.parse(fs.readFileSync(new URL('../../assets/examples/story.json', import.meta.url), 'utf8'));
  assert.deepEqual(json, exampleStory);
});

test('beat boundaries use the same rounded frames as composition metadata', () => {
  const p = plan();
  p.beats = p.beats.slice(0, 2);
  p.beats[0].durationSeconds = 4.05;
  assert.equal(storyFrames(p), 122 + 180);
  assert.equal(locateBeat(p, 121).beat.id, 'question');
  assert.equal(locateBeat(p, 122).beat.id, 'expiry');
  assert.equal(locateBeat(p, 122).localSeconds, 0);
});

test('expiry preserves the full amount until the specified instant, then jumps to zero', () => {
  const m = plan().beats[1].metric;
  assert.equal(metricValue(m, 3.49), 120);
  assert.equal(metricValue(m, 3.5), 0);
  assert.equal(metricValue(m, 6), 0);
  m.nextValue = 20;
  const p = plan(); p.beats[1].metric = m;
  assert.throws(() => validateStory(p), /expire/);
});

test('counts animate only when explicitly selected; static values do not animate from zero', () => {
  assert.equal(metricValue({id: 'n', label: '数量', value: 120}, 0), 120);
  const p = plan();
  p.beats[1].metric = {id: 'n', label: '数量', value: 20, nextValue: 40, change: 'count', atSeconds: 1, changeSeconds: 2};
  validateStory(p);
  assert.equal(metricValue(p.beats[1].metric, 1), 20);
  assert.equal(metricValue(p.beats[1].metric, 2), 30);
  assert.equal(metricValue(p.beats[1].metric, 3), 40);
});

test('metric precision preserves small values instead of silently rounding everything to two places', () => {
  const p=plan();
  p.beats[1].metric={id:'small',label:'示例数值',value:0.004};
  validateStory(p);assert.equal(metricDecimals(p.beats[1].metric),3);
  p.beats[1].metric.value=0.0000004;
  assert.throws(()=>validateStory(p),/精度/);
  p.beats[1].metric.decimals=6;
  validateStory(p);assert.equal(metricDecimals(p.beats[1].metric),6);
});

test('invalid semantic fields are rejected instead of silently applying a template', () => {
  const p = plan(); p.beats[1].metric.threshold = 100;
  assert.throws(() => validateStory(p), /threshold/);
  const q = plan(); q.beats[2].items[0].value = 1;
  assert.throws(() => validateStory(q), /value/);
});

test('stable element IDs cannot change type, duplicate in a beat, or collide with subject', () => {
  const p = plan(); p.beats[2].items[0].id = 'remaining';
  assert.throws(() => validateStory(p), /元素类型/);
  const q = plan(); q.beats[2].items[1].id = q.beats[2].items[0].id;
  assert.throws(() => validateStory(q), /重复/);
  const r = plan(); r.beats[2].items[0].id = r.subject.id;
  assert.throws(() => validateStory(r), /subject/);
});

test('declared changes leave time to read the result and hold values reject change parameters', () => {
  const p = plan(); p.beats[1].metric.atSeconds = 5.8;
  assert.throws(() => validateStory(p), /atSeconds/);
  const q = plan(); q.beats[1].metric.change = 'hold';
  assert.throws(() => validateStory(q), /静态指标/);
});

test('invalid theme, multi-paragraph labels and mixed plan structures are rejected', () => {
  const p = plan(); p.theme.accent = 'red';
  assert.throws(() => validateStory(p), /HEX/);
  const q = plan(); q.beats[0].text = '第一行\n第二行';
  assert.throws(() => validateStory(q), /单段/);
  const r = plan(); r.shots = [];
  assert.throws(() => validateStory(r), /shots/);
});

test('unknown top-level fields and oversized wide Latin text do not silently pass', () => {
  const p = plan(); p.themee = {preset: 'dark'};
  assert.throws(() => validateStory(p), /themee/);
  const q = plan(); q.beats[0].heading = 'W'.repeat(46);
  assert.throws(() => validateStory(q), /heading/);
  const r = plan(); r.assets = {screen: './demo.mp4'};
  validateStory(r);
});

test('media IDs retain the same source and clip start while reused across beats', () => {
  const p = plan();
  const media = {id: 'screen', src: 'asset:screen', type: 'video', startFrom: 30};
  p.beats = [
    {id: 'a', durationSeconds: 6, heading: '界面第一步', layout: 'media', media},
    {id: 'b', durationSeconds: 4, heading: '同一段录屏继续', layout: 'media', media: {...media}},
  ];
  validateStory(p);
  p.beats[1].media.startFrom = 0;
  assert.throws(() => validateStory(p), /同一 media.id/);
});
