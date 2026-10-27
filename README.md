# MG Motion Skill

用于 Codex 的本地 MG 动效 Skill：把文案、截图、图片或录屏做成可修改的横屏动画，适用于产品介绍、教程、数据比较和概念解释。当前源码版本：**v1.2.0**。

保留 **50 套独立模板源码、100 组参数和 50 张历史预览**，新增共享视觉系统的连续段落模式。长文案先规划内容递进与统一视觉；单独补充片段仍可按表达关系筛选模板。每次输出保存输入记录和运行清单，便于后续修改与追溯。

## v1.2.0 的调整

- **连续讲解优先 `story`**：同一背景、字体、主体和内容区域，使用稳定元素 ID 跨阶段展开；支持解释、判断维度、步骤、对比、数值和真实素材。
- **选模增加语义约束**：`match --intent / --family`；`audit` 检查计划。`coherent` 模式拒绝未经适配的多风格组合，旧 `shots` 计划继续兼容并提示风险。
- **修复已复现问题**：MG-020 序号不再必须从零计数；MG-032 不自动添加问号；MG-020 / MG-047 默认隐藏无关示例文字；MG-022 保持阈值专用并修复下降变化的说明对应。
- **改进使用流程**：先确定整段表达与视觉，再决定组件或模板；不按字数、句数机械拼出多个独立视频。

本轮按要求只做代码、参数和组件行为检查，**没有重新制作验证视频，也未更新历史预览**。新连续场景的画面效果与整体节奏仍需实际试片验收。它不会自动改造全部旧模板，也不承诺已修好所有停顿问题。

## 仓库结构

```text
README.md
.gitignore
mg-motion/
  SKILL.md
  agents/
  scripts/
  references/
  assets/
```

## 安装

建议使用 Node.js 22（本次验证版本为 22.17.0）与 npm，并准备可用的本地 Chrome 和支持中文的字体。建议安装 Noto Sans SC；部分手绘模板使用楷体或 Noto Serif SC。渲染引擎锁定 Remotion 4.0.534。换电脑后需重新检查字体、字宽和实际画面。

1. 克隆公开仓库：

   ```sh
   git clone https://github.com/dewidydy4949/mg-motion-skill.git
   cd mg-motion-skill
   ```

2. 将仓库中的整个 `mg-motion` 文件夹复制到用户的 Codex skills 目录，通常为 `~/.codex/skills/`；Windows 对应 `%USERPROFILE%\.codex\skills\`。若使用自定义 `CODEX_HOME`，则放到其 `skills/` 子目录。

   **已有同名 Skill 时，先备份并比较差异，保留现有修改，再合并或替换。不要直接覆盖尚未保存的改动。**

3. 进入安装后 Skill 的 `assets/engine/` 目录安装锁定依赖：

   ```sh
   npm ci --ignore-scripts --no-audit --no-fund
   ```

4. 渲染时用 `--browser "Chrome可执行文件路径"` 指定 Chrome，或设置环境变量 `MG_BROWSER_EXECUTABLE`。

仓库副本和已安装 Skill 是两个独立副本。修改或更新仓库源码后，需要再次比较并同步到安装目录；如果依赖锁文件变化，在安装目录重新执行上述安装命令。项目专用的布局或动作修改应保存在项目引擎副本中，通过 `--engine` 使用，保留安装库的稳定默认效果。

## 使用

在 Codex 中调用：

```text
$mg-motion 把下面四组问答做成 9 秒横屏动画，突出最后一条回复：……
```

连续讲解可直接说：

```text
$mg-motion 把这段文案做成 20 秒连贯横屏动画，先确定统一视觉，优先使用 story 模式，保留共同主体，不要逐句换模板：……
```

导出连续段落示例，修改后检查与渲染：

```sh
node scripts/mg.mjs story --out work/story.json
node scripts/mg.mjs audit --plan work/story.json
node scripts/mg.mjs check --plan work/story.json --browser "Chrome可执行文件路径"
node scripts/mg.mjs compose --plan work/story.json --out outputs/story.mp4 --browser "Chrome可执行文件路径"
```

上面的命令在 `mg-motion/` 目录执行。参数说明见 [连续段落](mg-motion/references/story.md)。导出的是可编辑示例，仍需根据实际文案规划各阶段，不能原样当成任何题材的成片。

也可在 Skill 目录中直接运行脚本：

```sh
node scripts/mg.mjs match "手机问答，突出最后回复" --duration 9
node scripts/mg.mjs inspect MG-043
node scripts/mg.mjs params MG-043 --out work/dialog.json
```

编辑导出的参数，替换示例文字后再检查和渲染：

```sh
node scripts/mg.mjs check MG-043 --params work/dialog.json --duration 9 --browser "Chrome可执行文件路径"
node scripts/mg.mjs render MG-043 --params work/dialog.json --duration 9 --out outputs/dialog.mp4 --browser "Chrome可执行文件路径"
```

查看 [Skill 流程](mg-motion/SKILL.md)、[模板选择与素材能力](mg-motion/references/selection.md) 和 [参数、渲染与复跑](mg-motion/references/rendering.md)。渲染会写入所用引擎的素材暂存与缓存；需要隔离项目时使用自己的引擎副本、`--engine` 和 `--work-dir`。

更新时先在仓库运行 `git pull --ff-only`，再将新版 `mg-motion` 同步到实际调用的 skills 目录。只更新仓库不会改变已安装副本。保留自己做过的局部修改，并在新会话中确认 `inspect` 能显示 `compatibility`、帮助中有 `story` / `audit` 命令。旧 Release 附件仍是 v1.1.0，本次改造通过仓库源码提供。

开发者可在安装引擎依赖后，从 `mg-motion/` 执行 `node scripts/verify.mjs`：运行 TypeScript 与无视频的行为回归检查。

## 能力边界

- 默认输出为 **1920×1080、30fps、无声 MP4**；没有自动旁白、音乐或配音。旧模板多镜头采用直接切换；story 在共享场景内更新内容。
- `match` 是关键词与能力约束筛选，不会读取图片或视频，也不提供自动视觉匹配。能否嵌入素材以具体模板槽位为准。
- 不自动写入剪辑软件时间线。竖屏、透明叠加和复杂转场需另做工程修改与验证。
- 参数校验通过不等于视觉验收通过。需实际查看关键帧、转换与末帧，并检查整片节奏。清单中的 `visualReviewed:false` 是脚本原始记录，视觉检查另行记录。

## v1.1.0 历史验证范围

- 检查了 50 套模板的目录、使用卡、预览、两组参数及源码路径；完成 7 个检索场景和 4 类非法输入测试。Skill 校验、TypeScript 检查及安装版依赖安装通过。本轮封装验证没有重新渲染全部 50 套历史样片。
- **9 秒 `dialog.mp4`**：270 帧完整解码；查看了 6 个时间点和安装版末帧。浏览器播放器连续运行至结束，无播放错误、无掉帧；不代表人工连续观看了每一帧。
- **20 秒 `workspace-introduction.mp4`**：截图与原录屏实际接入；600 帧完整解码，主检查与独立复核合计查看 22 个不同抽查帧。**未连续实播，未逐帧目视检查**，也未在其他电脑、字体环境或第三方剪辑软件中验证。

20 秒试片使用 MG-036 的项目局部变体，增加了鼠标显示与步骤时长控制；它不属于安装版默认模板。复跑必须从完整交付包使用该项目的 `run.ps1` 或指定其项目引擎，不能只靠本仓库的默认引擎。对应清单的 `engineMatchesCatalog:false` 是预期的版本差异记录。

## 发布附件

在 [v1.1.0 Release](https://github.com/dewidydy4949/mg-motion-skill/releases/tag/v1.1.0) 下载：

| 附件 | 用途 |
| --- | --- |
| `mg-motion-skill.zip` | 可安装的 Skill 包 |
| `mg-motion-delivery.zip` | 完整交付与试用复跑材料，包含 20 秒试片的项目局部变体 |
| `dialog.mp4` | 9 秒问答试片 |
| `workspace-introduction.mp4` | 20 秒截图与录屏介绍试片 |
| `SHA256SUMS.txt` | 发布附件的 SHA256 校验值 |

示例内容仅用于演示模板，不代表品牌现状或真实测量数据。

## 许可证状态

当前仅公开源码，暂未添加开源许可证。
