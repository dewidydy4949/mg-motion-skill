# MG Motion Skill

用于 Codex 的本地 MG 动效 Skill：把文案、截图、图片或录屏做成可修改的横屏动画，适用于产品介绍、教程、数据比较和概念解释。当前发布版：**v1.1.0**。

包含 **50 套模板源码、100 组参数和 50 张预览**，以及模板使用卡、选择目录、参数校验和渲染脚本。可按表达关系筛选模板、替换内容、在支持的素材槽嵌入图片或视频，再按镜头计划顺序拼接。每次输出保存输入记录和运行清单，便于后续修改与追溯。

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

1. 在有访问权限的账号下克隆私有仓库：

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

## 能力边界

- 默认输出为 **1920×1080、30fps、无声 MP4**；没有自动旁白、音乐或配音。多镜头采用直接切换。
- `match` 是关键词与能力约束筛选，不会读取图片或视频，也不提供自动视觉匹配。能否嵌入素材以具体模板槽位为准。
- 不自动写入剪辑软件时间线。竖屏、透明叠加和复杂转场需另做工程修改与验证。
- 参数校验通过不等于视觉验收通过。需实际查看关键帧、转换与末帧，并检查整片节奏。清单中的 `visualReviewed:false` 是脚本原始记录，视觉检查另行记录。

## 已验证范围

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
