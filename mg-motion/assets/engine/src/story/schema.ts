/** A story is one persistent stage, not a list of independently styled templates. */
export type StoryTheme = {preset?: 'light' | 'dark'; accent?: string; fontFamily?: string};
export type StoryItem = {id: string; label: string; detail?: string};
export type StoryMetric = {
  id: string; label: string; value: number; unit?: string; decimals?: number;
  change?: 'hold' | 'count' | 'expire'; nextValue?: number;
  atSeconds?: number; changeSeconds?: number; beforeLabel?: string; afterLabel?: string;
};
export type StoryMedia = {
  id: string; src: string; type: 'image' | 'video'; fit?: 'contain' | 'cover'; startFrom?: number;
};
export type StoryBeat = {
  id: string; durationSeconds: number; heading: string; caption?: string;
  layout: 'statement' | 'criteria' | 'steps' | 'comparison' | 'metric' | 'media';
  text?: string; items?: StoryItem[]; metric?: StoryMetric; media?: StoryMedia;
};
export type StoryPlan = {
  mode: 'story'; title: string; subtitle?: string; theme?: StoryTheme;
  subject?: {id: string; label: string; detail?: string}; beats: StoryBeat[]; assets?: Record<string, string>;
};

const record = (value: unknown): value is Record<string, any> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
function requireThat(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`story: ${message}`);
}
// Approximate CJK display width; visual inspection is still needed for a new font.
export const textUnits = (text: string) => [...text].reduce((n, char) => n + (/[^\u0000-\u00ff]/u.test(char) ? 1 : /[MW@%&#]/.test(char) ? 1 : /[A-Z0-9]/.test(char) ? .75 : /[ilI.,'!:;| ]/.test(char) ? .35 : .62), 0);
function shortText(value: unknown, path: string, limit: number, optional = false) {
  if (optional && value === undefined) return;
  requireThat(typeof value === 'string' && value.trim().length > 0, `${path} 必须是非空文字`);
  requireThat(!/[\r\n\t]/.test(value), `${path} 使用单段文字，换行由版式处理`);
  requireThat(textUnits(value) <= limit, `${path} 超出 ${limit} 中文字宽；请精简画面文字，不要缩小整片字号`);
}
function knownFields(value: Record<string, unknown>, path: string, fields: string[]) {
  for (const key of Object.keys(value)) requireThat(fields.includes(key), `${path}.${key} 不受支持，不能静默忽略参数`);
}
function id(value: unknown, path: string) {
  requireThat(typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(value), `${path} 使用 1–64 位字母、数字、下划线或连字符`);
}
function number(value: unknown, path: string, min: number, max: number) {
  requireThat(typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max, `${path} 必须在 ${min}–${max} 之间`);
}

export function validateStory(value: unknown): StoryPlan {
  requireThat(record(value) && value.mode === 'story', "mode 必须是 'story'");
  requireThat(value.shots === undefined, '连续段落使用 beats，不能同时填写 shots');
  knownFields(value, 'plan', ['mode', 'title', 'subtitle', 'theme', 'subject', 'beats', 'assets']);
  if (value.assets !== undefined) {
    requireThat(record(value.assets), 'assets 必须为名称到素材路径的对象');
    for (const [name, source] of Object.entries(value.assets)) {
      requireThat(name.trim().length > 0 && typeof source === 'string' && source.trim().length > 0, 'assets 的名称和路径不能为空');
    }
  }
  shortText(value.title, 'title', 30);
  shortText(value.subtitle, 'subtitle', 58, true);
  if (value.theme !== undefined) {
    requireThat(record(value.theme), 'theme 必须是对象');
    knownFields(value.theme, 'theme', ['preset', 'accent', 'fontFamily']);
    requireThat(value.theme.preset === undefined || ['light', 'dark'].includes(value.theme.preset), 'theme.preset 只支持 light / dark');
    requireThat(value.theme.accent === undefined || /^#[0-9a-f]{6}$/i.test(value.theme.accent), 'theme.accent 需要六位 HEX 色值');
    shortText(value.theme.fontFamily, 'theme.fontFamily', 120, true);
  }
  if (value.subject !== undefined) {
    requireThat(record(value.subject), 'subject 必须是对象');
    knownFields(value.subject, 'subject', ['id', 'label', 'detail']);
    id(value.subject.id, 'subject.id');
    shortText(value.subject.label, 'subject.label', 16);
    shortText(value.subject.detail, 'subject.detail', 46, true);
  }
  requireThat(Array.isArray(value.beats) && value.beats.length >= 1 && value.beats.length <= 100, 'beats 需要 1–100 个表达阶段');
  const beatIds = new Set<string>();
  const itemKinds = new Map<string, string>();
  const mediaIdentities = new Map<string, string>();
  let duration = 0;
  for (const [i, beat] of value.beats.entries()) {
    const path = `beats[${i}]`;
    requireThat(record(beat), `${path} 必须是对象`);
    knownFields(beat, path, ['id', 'durationSeconds', 'heading', 'caption', 'layout', 'text', 'items', 'metric', 'media']);
    id(beat.id, `${path}.id`);
    requireThat(!beatIds.has(beat.id), `${path}.id 重复`);
    beatIds.add(beat.id);
    number(beat.durationSeconds, `${path}.durationSeconds`, 1, 120);
    duration += beat.durationSeconds;
    shortText(beat.heading, `${path}.heading`, 26);
    shortText(beat.caption, `${path}.caption`, 62, true);
    requireThat(['statement', 'criteria', 'steps', 'comparison', 'metric', 'media'].includes(beat.layout), `${path}.layout 不支持`);
    const expected = beat.layout === 'statement' ? 'text' : ['criteria', 'steps', 'comparison'].includes(beat.layout) ? 'items' : beat.layout;
    for (const field of ['text', 'items', 'metric', 'media']) {
      requireThat(field === expected || beat[field] === undefined, `${path}.${field} 不适用于 ${beat.layout} 布局`);
    }
    const remember = (elementId: string, kind: string) => {
      requireThat(elementId !== value.subject?.id, `${path} 的元素 id 不能复用 subject.id`);
      const previous = itemKinds.get(elementId);
      requireThat(previous === undefined || previous === kind, `${path}: ${elementId} 跨阶段必须保持同一种元素类型`);
      itemKinds.set(elementId, kind);
    };
    if (beat.layout === 'statement') {
      shortText(beat.text, `${path}.text`, 78);
    } else if (['criteria', 'steps', 'comparison'].includes(beat.layout)) {
      const max = beat.layout === 'comparison' ? 3 : 4;
      requireThat(Array.isArray(beat.items) && beat.items.length >= 2 && beat.items.length <= max, `${path}.items 需要 2–${max} 项`);
      const ids = new Set<string>();
      for (const [j, item] of beat.items.entries()) {
        requireThat(record(item), `${path}.items[${j}] 必须是对象`);
        knownFields(item, `${path}.items[${j}]`, ['id', 'label', 'detail']);
        id(item.id, `${path}.items[${j}].id`);
        requireThat(!ids.has(item.id), `${path} 内元素 id 重复`);
        ids.add(item.id); remember(item.id, 'card');
        shortText(item.label, `${path}.items[${j}].label`, beat.layout === 'comparison' ? 12 : 16);
        shortText(item.detail, `${path}.items[${j}].detail`, beat.layout === 'comparison' ? 40 : 46, true);
      }
    } else if (beat.layout === 'metric') {
      const metric = beat.metric;
      requireThat(record(metric), `${path}.metric 必须是对象`);
      knownFields(metric, `${path}.metric`, ['id', 'label', 'value', 'unit', 'decimals', 'change', 'nextValue', 'atSeconds', 'changeSeconds', 'beforeLabel', 'afterLabel']);
      id(metric.id, `${path}.metric.id`); remember(metric.id, 'metric');
      shortText(metric.label, `${path}.metric.label`, 20);
      shortText(metric.unit, `${path}.metric.unit`, 5, true);
      shortText(metric.beforeLabel, `${path}.metric.beforeLabel`, 24, true);
      shortText(metric.afterLabel, `${path}.metric.afterLabel`, 24, true);
      number(metric.value, `${path}.metric.value`, -1e9, 1e9);
      if (metric.decimals !== undefined) {
        number(metric.decimals, `${path}.metric.decimals`, 0, 6);
        requireThat(Number.isInteger(metric.decimals), `${path}.metric.decimals 必须是整数`);
      }
      const change = metric.change ?? 'hold';
      requireThat(['hold', 'count', 'expire'].includes(change), `${path}.metric.change 不支持`);
      if (change === 'hold') {
        requireThat(metric.nextValue === undefined && metric.atSeconds === undefined && metric.changeSeconds === undefined, `${path}: 静态指标不接受变化参数；明确填写 change 才播放数值变化`);
        requireThat(metric.afterLabel === undefined, `${path}: 静态指标不接受 afterLabel`);
      } else {
        number(metric.nextValue, `${path}.metric.nextValue`, -1e9, 1e9);
        number(metric.atSeconds, `${path}.metric.atSeconds`, .5, beat.durationSeconds - 1);
        if (change === 'expire') {
          requireThat(metric.value > 0 && metric.nextValue === 0, `${path}: expire 只表示正的剩余量在到期时变成 0`);
          requireThat(metric.changeSeconds === undefined, `${path}: 到期清零是离散变化，不接受 changeSeconds`);
        } else {
          number(metric.changeSeconds, `${path}.metric.changeSeconds`, .3, beat.durationSeconds - metric.atSeconds - .5);
        }
      }
      requireThat(metric.decimals !== undefined || metricDecimals(metric as StoryMetric) <= 6, `${path}: 数值精度超过 6 位小数，请调整单位或显式指定 decimals`);
    } else {
      const media = beat.media;
      requireThat(record(media), `${path}.media 必须是对象`);
      knownFields(media, `${path}.media`, ['id', 'src', 'type', 'fit', 'startFrom']);
      id(media.id, `${path}.media.id`); remember(media.id, 'media');
      shortText(media.src, `${path}.media.src`, 1000);
      requireThat(['image', 'video'].includes(media.type), `${path}.media.type 只支持 image / video`);
      requireThat(media.fit === undefined || ['contain', 'cover'].includes(media.fit), `${path}.media.fit 只支持 contain / cover`);
      if (media.startFrom !== undefined) number(media.startFrom, `${path}.media.startFrom`, 0, 1e7);
      requireThat(media.startFrom === undefined || Number.isInteger(media.startFrom), `${path}.media.startFrom 按合成帧率填写整数帧`);
      requireThat(media.type === 'video' || media.startFrom === undefined, `${path}: 图片不接受 startFrom`);
      const identity = JSON.stringify([media.src, media.type, media.startFrom ?? 0]);
      requireThat(!mediaIdentities.has(media.id) || mediaIdentities.get(media.id) === identity, `${path}: 同一 media.id 必须指向相同素材和起始帧；更换素材时使用新 id`);
      mediaIdentities.set(media.id, identity);
    }
  }
  requireThat(duration <= 600, '整段最长 600 秒；较长内容应按章节另做编排');
  return value as StoryPlan;
}

export function storyFrames(plan: StoryPlan, fps = 30): number {
  validateStory(plan);
  number(fps, 'fps', 1, 240);
  return plan.beats.reduce((sum, beat) => sum + Math.round(beat.durationSeconds * fps), 0);
}

/** Timing uses exactly the same per-beat rounding as the composition metadata. */
export function locateBeat(plan: StoryPlan, frame: number, fps = 30) {
  let from = 0;
  for (let i = 0; i < plan.beats.length; i++) {
    const frames = Math.round(plan.beats[i].durationSeconds * fps);
    if (frame < from + frames || i === plan.beats.length - 1) {
      return {beat: plan.beats[i], previous: i > 0 ? plan.beats[i - 1] : undefined, index: i, from, localSeconds: Math.max(0, (frame - from) / fps), frames};
    }
    from += frames;
  }
  throw new Error('story: beats 为空');
}

export function metricValue(metric: StoryMetric, localSeconds: number): number {
  if (!metric.change || metric.change === 'hold') return metric.value;
  const at = metric.atSeconds as number;
  if (localSeconds < at) return metric.value;
  if (metric.change === 'expire') return 0;
  const progress = Math.max(0, Math.min(1, (localSeconds - at) / (metric.changeSeconds as number)));
  const eased = progress * progress * (3 - 2 * progress);
  return metric.value + ((metric.nextValue as number) - metric.value) * eased;
}

export function metricDecimals(metric: StoryMetric): number {
  if (metric.decimals !== undefined) return metric.decimals;
  const places = (n: number) => {
    const [coefficient, exponent = '0'] = String(n).split('e');
    return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent));
  };
  return Math.max(places(metric.value), places(metric.nextValue ?? metric.value));
}
