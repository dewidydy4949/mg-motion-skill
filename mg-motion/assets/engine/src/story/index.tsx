import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {locateBeat, metricValue, metricDecimals, storyFrames, textUnits, validateStory} from './schema';
import type {StoryBeat, StoryItem, StoryMedia, StoryMetric, StoryPlan} from './schema';

export {validateStory, storyFrames} from './schema';
export type {StoryPlan, StoryBeat, StoryTheme} from './schema';
export {exampleStory} from './example';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {const p = clamp(n); return p * p * (3 - 2 * p);};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const size = (text: string, width: number, preferred: number, min: number) => Math.max(min, Math.min(preferred, width / Math.max(1, textUnits(text))));
type Palette = {bg: string; surface: string; ink: string; muted: string; border: string; accent: string};
type Rect = {x: number; y: number; w: number; h: number};
type Tile = {id: string; kind: 'card' | 'statement' | 'metric' | 'media'; rect: Rect; item?: StoryItem; ordinal?: number; text?: string; metric?: StoryMetric; media?: StoryMedia};
const layoutTiles = (beat: StoryBeat | undefined, width: number): Tile[] => {
  if (!beat) return [];
  if (beat.layout === 'statement') return [{id: '__statement', kind: 'statement', text: beat.text, rect: {x: 0, y: 0, w: width, h: 420}}];
  if (beat.layout === 'metric') return [{id: beat.metric!.id, kind: 'metric', metric: beat.metric, rect: {x: 0, y: 0, w: width, h: 420}}];
  if (beat.layout === 'media') return [{id: beat.media!.id, kind: 'media', media: beat.media, rect: {x: 0, y: 0, w: width, h: 510}}];
  const items = beat.items!;
  const cols = beat.layout === 'steps' && items.length < 4 ? 1 : items.length === 4 ? 2 : items.length;
  const rows = Math.ceil(items.length / cols);
  const gap = 24;
  const w = (width - (cols - 1) * gap) / cols;
  const h = rows > 1 ? (510 - (rows - 1) * gap) / rows : 420;
  return items.map((item, i) => ({id: item.id, kind: 'card', item, ordinal: beat.layout === 'steps' ? i + 1 : undefined, rect: {x: (i % cols) * (w + gap), y: Math.floor(i / cols) * (h + gap), w, h}}));
};

function MediaContent({tile, plan, beatIndex, fps}: {tile: Tile; plan: StoryPlan; beatIndex: number; fps: number}) {
  const media = tile.media!;
  if (media.type === 'image') return <Img src={media.src} style={{width: '100%', height: '100%', objectFit: media.fit ?? 'contain'}}/>;
  // Consecutive beats displaying the same media ID share the same media clock.
  let startBeat = beatIndex;
  while (startBeat > 0 && plan.beats[startBeat - 1].media?.id === media.id) startBeat--;
  const from = plan.beats.slice(0, startBeat).reduce((sum, beat) => sum + Math.round(beat.durationSeconds * fps), 0);
  return <Sequence from={from} layout="none"><OffthreadVideo src={media.src} startFrom={media.startFrom ?? 0} muted style={{width: '100%', height: '100%', objectFit: media.fit ?? 'contain'}}/></Sequence>;
}

function TileContent({tile, palette, localSeconds, plan, beatIndex, fps}: {tile: Tile; palette: Palette; localSeconds: number; plan: StoryPlan; beatIndex: number; fps: number}) {
  if (tile.kind === 'media') return <MediaContent tile={tile} plan={plan} beatIndex={beatIndex} fps={fps}/>;
  if (tile.kind === 'statement') return <div style={{height: '100%', display: 'flex', alignItems: 'center', padding: 54, boxSizing: 'border-box'}}><div style={{fontSize: 48, lineHeight: 1.5, fontWeight: 650, overflowWrap: 'anywhere'}}>{tile.text}</div></div>;
  if (tile.kind === 'metric') {
    const metric = tile.metric!;
    const changed = metric.change && metric.change !== 'hold' && localSeconds >= (metric.atSeconds ?? 0);
    const value = metricValue(metric, localSeconds);
    const decimals = metricDecimals(metric);
    const display = value.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
    return <div style={{padding: '36px 48px', boxSizing: 'border-box', height: '100%'}}>
      <div style={{fontSize: 32, color: palette.muted}}>{metric.label}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 30, color: palette.ink}}><span style={{fontSize: size(display, tile.rect.w - 290, 152, 74), fontWeight: 750, fontVariantNumeric: 'tabular-nums', letterSpacing: -4}}>{display}</span>{metric.unit && <span style={{fontSize: 39, color: palette.muted}}>{metric.unit}</span>}</div>
      <div style={{fontSize: 32, marginTop: 20, color: palette.ink}}>{changed ? metric.afterLabel : metric.beforeLabel}</div>
    </div>;
  }
  const horizontal = tile.ordinal !== undefined && tile.rect.w > 700;
  const grid = tile.rect.h < 300;
  const padding = horizontal ? 26 : grid ? 28 : 34;
  return <div style={{padding, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: horizontal ? 'row' : 'column', alignItems: horizontal ? 'center' : undefined, gap: horizontal ? 24 : 0}}>
    <div style={{flex: horizontal ? '0 0 36%' : undefined, display: 'flex', alignItems: 'center', gap: 16}}>
      {tile.ordinal !== undefined && <div style={{fontSize: horizontal ? 32 : 27, fontWeight: 700, color: palette.ink, minWidth: 40}}>{String(tile.ordinal).padStart(2, '0')}</div>}
      <div style={{fontSize: horizontal ? 30 : grid ? (tile.ordinal ? 30 : 32) : tile.rect.w < 450 ? 35 : 42, fontWeight: 700, lineHeight: 1.35, overflowWrap: 'anywhere'}}>{tile.item!.label}</div>
    </div>
    {tile.item!.detail && <div style={{fontSize: horizontal ? 26 : grid ? 25 : 28, color: palette.muted, lineHeight: 1.5, marginTop: horizontal ? 0 : grid ? 16 : 24, overflowWrap: 'anywhere'}}>{tile.item!.detail}</div>}
  </div>;
}

/** One continuously mounted scene: no per-beat Sequence wraps or whole-screen resets. */
export const Story: React.FC<StoryPlan> = raw => {
  const plan = validateStory(raw);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const current = locateBeat(plan, frame, fps);
  const {beat, previous, index, localSeconds} = current;
  const dark = plan.theme?.preset === 'dark';
  const palette: Palette = {bg: dark ? '#111820' : '#f4f3ee', surface: dark ? '#1b2530' : '#ffffff', ink: dark ? '#f2f4f7' : '#17212b', muted: dark ? '#aebdcb' : '#5d6b77', border: dark ? '#354352' : '#d7dedb', accent: plan.theme?.accent ?? (dark ? '#8ac8b9' : '#356b62')};
  const hasSubject = Boolean(plan.subject);
  const left = hasSubject ? 526 : 104;
  const width = 1816 - left;
  const transition = ease(localSeconds / .45);
  const intro = ease(frame / (fps * .4));
  const now = layoutTiles(beat, width);
  const before = layoutTiles(previous, width);
  const keys = [...new Set([...before.map(tile => tile.id), ...now.map(tile => tile.id)])];
  return <AbsoluteFill style={{background: palette.bg, color: palette.ink, fontFamily: plan.theme?.fontFamily ?? '"Noto Sans SC", "Microsoft YaHei", Arial, sans-serif', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 104, right: 104, top: 70, opacity: intro, transform: `translateY(${(1-intro)*12}px)`}}>
      <div style={{fontSize: 39, fontWeight: 700, letterSpacing: -.5, overflowWrap: 'anywhere'}}>{plan.title}</div>
      {plan.subtitle && <div style={{fontSize: 25, color: palette.muted, marginTop: 15, overflowWrap: 'anywhere'}}>{plan.subtitle}</div>}
    </div>
    <div style={{position: 'absolute', left: 104, right: 104, top: 185, height: 2, background: palette.border}}/>
    {plan.subject && <div style={{position: 'absolute', left: 104, top: 305, width: 350, minHeight: 360, boxSizing: 'border-box', padding: '40px 34px', background: palette.surface, border: `1px solid ${palette.border}`, borderTop: `6px solid ${palette.accent}`, borderRadius: 22, opacity: intro}}>
      <div style={{width: 42, height: 42, border: `3px solid ${palette.accent}`, borderRadius: 12, marginBottom: 35}}/>
      <div style={{fontSize: 43, fontWeight: 750, lineHeight: 1.35, overflowWrap: 'anywhere'}}>{plan.subject.label}</div>
      {plan.subject.detail && <div style={{fontSize: 27, color: palette.muted, lineHeight: 1.7, marginTop: 24, overflowWrap: 'anywhere'}}>{plan.subject.detail}</div>}
    </div>}
    <div style={{position: 'absolute', left, top: 237, width, fontSize: size(beat.heading, width, 57, 43), fontWeight: 750, lineHeight: 1.4, overflowWrap: 'anywhere', opacity: previous ? .55 + .45 * transition : intro}}>{beat.heading}</div>
    <div style={{position: 'absolute', left, top: 360, width, height: 510}}>
      {keys.map(key => {
        const a = before.find(tile => tile.id === key);
        const b = now.find(tile => tile.id === key);
        const tile = b ?? a!;
        const from = a?.rect ?? {...tile.rect, y: tile.rect.y + 22};
        const to = b?.rect ?? {...tile.rect, y: tile.rect.y - 12};
        const opacity = a && b ? 1 : b ? (previous ? transition : intro) : 1 - transition;
        if (!b && opacity <= 0) return null;
        const rect = {x: lerp(from.x, to.x, transition), y: lerp(from.y, to.y, transition), w: lerp(from.w, to.w, transition), h: lerp(from.h, to.h, transition)};
        return <div key={key} style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, opacity, background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 22, overflow: 'hidden', boxSizing: 'border-box'}}>
          <div style={{position: 'absolute', top: 0, left: 0, width: 60, height: 4, background: palette.accent}}/>
          <TileContent tile={{...tile, rect}} palette={palette} localSeconds={b ? localSeconds : previous?.durationSeconds ?? 0} plan={plan} beatIndex={b ? index : Math.max(0,index-1)} fps={fps}/>
        </div>;
      })}
    </div>
    {beat.caption && <div style={{position: 'absolute', left, top: 910, width, color: palette.muted, fontSize: 29, lineHeight: 1.55, overflowWrap: 'anywhere', opacity: previous ? .5 + .5 * transition : intro}}>{beat.caption}</div>}
    <div style={{position: 'absolute', left: 104, right: 104, bottom: 55, height: 3, background: palette.border}}><div style={{height: '100%', width: `${clamp(frame / Math.max(1, storyFrames(plan, fps) - 1)) * 100}%`, background: palette.accent}}/></div>
  </AbsoluteFill>;
};
