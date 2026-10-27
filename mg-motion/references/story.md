# Story：阅读为主的信息说明

`mode: "story"` 使用共享场景渲染器，不从旧模板库逐句挑片段。背景、字体、标题、主体、圆角、间距和内容区域在整段保持一致。阶段切换时，具有相同 ID 的内容卡保留位置或平滑移动；新内容在同一内容区进入。

它提供一套克制的横屏信息布局，适合短句、清单、对比和素材解说。对需要演示过程、体现因果或有较强运动表现的连续 MG，先按 [动作与声音编排](motion-direction.md) 设计，再做项目动画。不要仅因文案有多个段落就默认使用 story。

当前渲染器主要提供卡片位置变化、淡入淡出、显式数值变化和素材播放。相同 ID 的文字可能直接替换，不同内容淡叠可能短暂重影；固定卡片长时间停留也容易呈现幻灯片观感。它没有通用的图形变形、对象关系演进或音画编排功能；修改参数无法自动补齐这些能力。

## 开始

```text
node scripts/mg.mjs story --out work/story.json
node scripts/mg.mjs audit --plan work/story.json
node scripts/mg.mjs check --plan work/story.json --browser "Chrome可执行文件路径"
node scripts/mg.mjs compose --plan work/story.json --out outputs/story.mp4 --browser "Chrome可执行文件路径"
```

命令导出 [20 秒示例](../assets/examples/story.json)，阶段为 4＋6＋7＋3 秒。它演示假设性的积分到期机制和 schema 用法；替换为用户自己的内容和实际规则后再出片。这组时长不是通用节奏推荐。实际试片中，三卡停留和内容淡叠仍有静态感与重影问题，不应把此示例当作连续 MG 的美术或动作基准。

## 计划结构

```json
{
  "mode": "story",
  "title": "这段内容的主题",
  "theme": {"preset": "light", "accent": "#356b62"},
  "subject": {"id": "product", "label": "持续保留的主体", "detail": "与各阶段共同相关的信息"},
  "beats": [
    {"id": "explain", "durationSeconds": 5, "heading": "先建立问题", "layout": "statement", "text": "一句清楚的核心信息。"},
    {"id": "compare", "durationSeconds": 7, "heading": "接着比较选择依据", "layout": "comparison", "items": [
      {"id": "a", "label": "方案 A", "detail": "沿同一维度说明"},
      {"id": "b", "label": "方案 B", "detail": "沿同一维度说明"}
    ]}
  ]
}
```

- 顶层 `title` 必填，`subtitle` 可选。`theme.preset` 支持 `light` / `dark`，`accent` 为六位 HEX；`fontFamily` 可选。字体要在渲染电脑上实际可用。
- `subject` 可省略；有共同的对象时用它持续建立上下文。稳定 ID 使用字母、数字、下划线或连字符。不要把每个阶段的新标题塞入主体。
- 每个 beat 的 `id` 唯一，`heading`、`layout`、`durationSeconds` 必填，`caption` 可选。显式分配各段时长；总帧数为逐段四舍五入后的和。
- 同一个条目跨阶段使用相同 `id`，保留顺序，并只改需要改变的文字；不要为制造动画随意换 ID。切换内容类别时使用新 ID。
- 当前支持 1–100 阶段、每阶段 1–120 秒、总计不超过 600 秒。这是技术边界，不表示适合用一个场景讲十分钟；长内容应按实际章节组织。

## 布局与含义

| layout | 内容字段 | 用途 |
| --- | --- | --- |
| `statement` | `text` | 一段短解释或结论 |
| `criteria` | `items`，2–4 项 | 并列的选择依据，共同保持在画面里 |
| `steps` | `items`，2–4 项 | 有顺序的事项，序号固定显示，不从零计数 |
| `comparison` | `items`，2–3 项 | 同维度对齐比较，不自动隐藏成单列 |
| `metric` | `metric` | 保持、明确的数量变化，或到期失效 |
| `media` | `media` | 真实图片、截图或录屏 |

`items` 的每项为 `{id,label,detail?}`，只写当前有用的信息，不把全文拆成大量小字。布局字段不能混用；例如 `criteria` 不能额外塞一个 `metric`，避免参数被静默忽略。文字容量按中文字宽校验，不通过继续缩小字号容纳长文。自定义字体、边界字数仍需查看实际画面。

### 数量变化必须明确声明

`metric` 必填 `id`、`label`、`value`，可选 `unit`、`beforeLabel`。默认保留输入数值的小数精度（最多 6 位），不会把 0.004 自动变成 0.00；需要明确舍入时可设置整数 `decimals: 0..6`。更细精度可先调整单位。

- 默认 `change: "hold"`：数值直接显示，不自动从零增长。
- `change: "count"`：另外填写 `nextValue`、`atSeconds`、`changeSeconds`，明确何时开始、多久变化；可填 `afterLabel`。仅用于确实需要展示数量变化的内容。
- `change: "expire"`：正的剩余量保持到 `atSeconds`，在该时点离散变为 `nextValue: 0`。不用合格线、达标标章或平滑消耗来代替到期机制。不接受 `changeSeconds`。

变化后必须留出阅读时间。步骤编号、排序标签使用 `steps`，不要装进数值字段。

### 真实素材

```json
{
  "id": "screen-step",
  "durationSeconds": 6,
  "heading": "查看实际界面",
  "layout": "media",
  "media": {"id": "screen", "src": "asset:screen", "type": "video", "fit": "contain", "startFrom": 30}
}
```

在计划顶层增加 `assets: {"screen":"./screen.mp4"}`，相对路径按计划文件目录解析。资源会复制到项目引擎暂存目录，原文件保留。图片用 `type: "image"`，不填写 `startFrom`。

`startFrom` 是 30fps 合成帧，30 表示跳过素材前 1 秒。连续阶段若使用相同 `media.id`，保留相同素材与起始帧，视频会接着播放；中断后重新出现则从新段落起点重播，若需要另一段素材时间应使用新 ID。视频默认静音，短于所需时长的素材需要自行截取或补足。

## 判断是否连贯

主体和主题持续保留只是基础。还需要检查：前后信息是否建立关系、变化是否对应当前讲述、比较维度是否对齐、结论能否从前面看出来。不要把六种布局各演示一次当作完成内容。

若实际效果变成“换一段字，停留，再换字”，先重新判断内容是否适合这个模式。阅读型片段可以有安静的停留；需要靠动作讲清的过程应转入项目动画，不能靠增加 BGM、无意义漂浮或进度条掩盖。
