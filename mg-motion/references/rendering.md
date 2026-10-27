# 参数与渲染

在 Skill 所在目录运行命令；其他目录调用时使用 `scripts/mg.mjs` 的绝对路径。工具依赖 Node.js，本工程锁定 Remotion 4.0.534。首次在 `assets/engine` 执行 `npm ci --ignore-scripts --no-audit --no-fund`。已装 Chrome 时通过 `--browser` 指定，或设置 `MG_BROWSER_EXECUTABLE`；脚本不会自动修改系统设置。中文建议安装 Noto Sans SC；手绘模板还会使用楷体或 Noto Serif SC。换电脑需确认字体和字宽。

## 单条

```text
node scripts/mg.mjs list 表格
node scripts/mg.mjs inspect MG-014
node scripts/mg.mjs params MG-014 --out work/table.json
node scripts/mg.mjs check MG-014 --params work/table.json --duration 9 --browser "Chrome可执行文件路径"
node scripts/mg.mjs still MG-014 --params work/table.json --duration 9 --time 4.5 --out work/table-middle.png --browser "Chrome可执行文件路径"
node scripts/mg.mjs render MG-014 --params work/table.json --duration 9 --out outputs/table.mp4 --browser "Chrome可执行文件路径"
```

`params` 输出完整参数；修改后可保留全部字段，也可仅传顶层覆盖字段。数组整体替换，不按下标合并。`--duration` 会映射到该模板的 `durationSeconds` 或 `duration`；固定时长模板会拒绝不支持的长度。使用卡记录每套边界，校验也会给出具体错误。不要把校验成功当作视觉检查通过。

输出已存在时默认报错。需要替换时用 `--overwrite`。渲染并发默认为 1，可用 `--concurrency` 调整；多进程并行时注意总 CPU 和内存占用。`--engine` 可指向复制到项目内的同版本完整引擎，便于项目独立保存。运行清单会计算实际引擎源码哈希；`engineMatchesCatalog:false` 表示源码已不同于目录记录，需要按实际修改重新检查。

渲染会在所用引擎中写入素材暂存和缓存。任务要求保持原工程只读时，使用项目自己的引擎副本与 `--engine`、`--work-dir`；依赖可在该副本按锁文件安装，避免复制无关旧缓存。

每次输出附带 `.input.json` 和 `.manifest.json`。前者保存镜头输入，后者保存时长、分辨率、模板版本、源码哈希与输出哈希。`render` 的输入记录是镜头对象，不能直接作为 `--params`。

## 连续段落

```text
node scripts/mg.mjs story --out work/story.json
node scripts/mg.mjs audit --plan work/story.json
node scripts/mg.mjs check --plan work/story.json --browser "Chrome可执行文件路径"
node scripts/mg.mjs compose --plan work/story.json --out outputs/story.mp4 --browser "Chrome可执行文件路径"
```

`story` 只导出可编辑示例，不会读取文案自动生成分镜。先替换内容与各阶段时长，再运行命令。`audit` 不开浏览器；story 复用引擎中的参数与时间校验，需要已经安装引擎依赖。`check` 加载真实合成、执行组件参数校验，不输出视频；只有 `compose` / `render` 才编码视频。参数通过不代表布局已视觉确认。完整 schema 和素材时钟见 [story.md](story.md)。

story 的输入记录保留 `mode`、主题、主体、稳定 ID、阶段时长与资源映射，可直接用 `compose --plan` 重跑。新清单使用 schemaVersion 2，包含计划模式和编排提示；模板列表为空表示使用共享 story 渲染器，源码哈希仍覆盖完整引擎。

完整重跑单条时，建议将记录中的 `templateId`、`variant`、`props`、`durationSeconds` 原样放进计划 `shots` 的一项；若记录含 `assets`，把它放到计划顶层。然后运行 `compose --plan ...`。多镜头输入记录本身就是计划，可直接重跑。如果仅提取 `props` 作为参数文件，还必须保留记录里的 `--variant` 和 `--duration`，并用 `--assets` 提供资源映射，否则可能恢复成默认版本或默认时长。

## 多镜头计划

旧的 `shots` 计划兼容保留，未填写 `mode` 时按 `sequence` 处理。它仍会保留各模板外观、顺序直接切换；混合风格和未声明表达关系会给出提示，不应作为新连续讲解的默认路线。

```json
{
  "shots": [
    {"templateId":"MG-013","durationSeconds":8,"props":{"title":"同一段资料，","emphasis":"观察不同回答"}},
    {"templateId":"MG-014","durationSeconds":10,"props":{"title":"对比记录"}}
  ]
}
```

```text
node scripts/mg.mjs check --plan work/shots.json --browser "Chrome可执行文件路径"
node scripts/mg.mjs compose --plan work/shots.json --out outputs/sequence.mp4 --browser "Chrome可执行文件路径"
node scripts/mg.mjs still --plan work/shots.json --time 9 --out work/second-shot.png --browser "Chrome可执行文件路径"
```

总帧数为各镜头四舍五入到 30fps 后的帧数之和。每个镜头有独立的局部时间；不通过事后拉伸整片来对齐。拼接会保留各模板风格，需要主动协调内容、字体观感和切换节奏。用户给定总时长时，先分配各段，检查总时长误差不超过一帧；不要把节奏不适合的镜头硬塞进去。

新建的统一风格多模板工程用 `mode: "coherent"`，每个 shot 添加 `semanticIntent`，先 `audit --plan`。意图必须是 `compatibility.json` 中的键。不同旧风格族会被拒绝，单纯增加 `theme` 或改色声明不会通过。确实完成项目源码适配时，使用不同于安装库的 `--engine`，并在计划顶层记录 `styleAdaptation: {"family":"项目风格名","notes":"具体改了哪些背景、字体、布局、衔接"}`。这仅允许进入后续制作，仍不等于视觉验收。同一种旧模板重复也需要检查动作是否反复重播和内容是否有推进。

已明确声明的错误意图会被拒绝；例如 `semanticIntent: "expiry"` 不能配 MG-022。`audit` 对旧模板只验证声明的兼容条件，完整参数仍由 `check` / 渲染校验。旧项目复跑无需虚构语义声明。

## 外部图片或录屏

只在使用卡明确支持图片/视频字段的模板里使用。单条用 `--assets work/assets.json`，多段在计划顶层写 `assets`；映射中的相对路径按该 JSON 所在目录解析。例如某模板支持 `media` 时：

```json
{
  "assets":{"screen":"./demo.mp4"},
  "shots":[{"templateId":"MG-034","props":{
    "title":"组件演示","durationSeconds":16,"fileName":"example.tsx",
    "steps":[
      {"title":"调整卡片","note":"左侧配置与右侧录屏对应。","code":["const card = {","  radius: 16","};"],"highlight":1,"result":"圆角卡片","detail":"演示效果","accent":"#ee835b","media":{"src":"asset:screen","type":"video","fit":"contain"}},
      {"title":"确认结果","note":"检查展示范围和中文排版。","code":["const ready = {","  checked: true","};"],"highlight":1,"result":"准备就绪","detail":"演示结果","accent":"#6a8c66"}
    ]
  }}]
}
```

上段使用 MG-034 的素材字段；替换 `demo.mp4` 为实际录屏。资源字符串用 `"asset:screen"`；脚本复制资源到引擎 `public/mg-jobs/` 下独立目录，再交给 Remotion。素材原文件和镜头计划都要随项目保留。`startFrom` 按合成帧率计数：本版为30fps，跳过素材前3秒填90，即使源录屏本身是10fps也填90。模板视频素材默认静音；音频另行处理。

检查素材内容与描述一致、裁切合理、运动时没有空帧。包内几何插图只代表演示；如果用户要求真实产品或界面，应接入其实际素材或明确说明当前是示意图。

## 视觉检查记录

每段至少查看信息完整出现、关键转换、最后一帧；文字多、表格、鼠标和数量边界额外检查。对整体视频实播检查节奏。保存简短记录说明看过哪些时间点、发现什么、做了什么修正；不要把脚本运行或抽帧文件存在写成“已观看”。

另查：步骤序号是否被错误计数、数值变化是否有依据、模板是否自动加了不合适的判断或问句、无关示例文字是否进入成片、主体与重点是否在切换后失去联系。新模板或修订版未看过成片时明确记录，不沿用历史预览的验收结论。
