# MG Motion Skill

**v1.3.0：参考驱动的文案补画面。** 给一段文案或口播，模型理解表达关系、选择并查看设计参考，再组织成所需时长的连贯 MG 画面，供剪辑使用。

默认参考从 50 套中整理为 **30 套代表参考＋20 套备用**，按 9 类表达用途检索。全部 50 套源码、100 组参数和 50 张预览保留；备用是减少默认干扰，不是删除素材。选择依据是静态预览、动作说明与部分源码，原始视频并未完整随包分发。

## 这次改了什么

- **先看参考，再组织整段内容**：参考提供构图、图形与动作依据；模型负责适配文案。取消连续内容默认套固定卡片的路线。
- **参考检索与直接复用分开**：新增 refs，短参考不会因用户要 20–30 秒画面而被排除；match 继续检查直接使用模板的实际边界。
- **自由场景有可靠制作工具**：新增 project.mjs，创建独立 Remotion 项目并检查/抽帧/渲染，不规定固定布局或动作 schema。
- **旧工程兼容保留**：原有 render/compose、story、语义检查及模板修复继续可用。story 是阅读型信息说明选项。

技能指引见 [SKILL.md](mg-motion/SKILL.md)，参考整理见 [selection.md](mg-motion/references/selection.md)，自由工程见 [project.md](mg-motion/references/project.md)。这是调用模型的创作流程和本地工具，refs 本身不会自动理解文案、观看视频或生成动画。

## 使用

```text
$mg-motion 为这段文案补一段20秒横屏画面，供插入口播剪辑：……
```

有指定时长、口播、截图或录屏时一起提供；只有文案时，模型自行估算时长并说明。无需用户选择模板编号。风格以合适的参考为依据，画面根据文案推进，声音按任务选择。

在 mg-motion/ 目录可运行：

```text
node scripts/mg.mjs refs
node scripts/mg.mjs refs "同一输入分发，再比较答案"
node scripts/mg.mjs refs --expression process --limit 4
node scripts/mg.mjs refs --all
node scripts/mg.mjs inspect MG-013
```

先看返回的 preview、card 和学习点；需要看动作时按 referenceRender 重渲染库内参考版。静态预览、源码分析、复刻视频和原始参考不是同一种证据。

需要新场景时：

```text
node scripts/project.mjs init --dir work/my-segment
```

初始工程是空画布，模型应根据文案与所选参考写入实际场景，再运行：

```text
node scripts/project.mjs check --dir work/my-segment --browser "Chrome路径"
node scripts/project.mjs render --dir work/my-segment --out outputs/segment.mp4 --browser "Chrome路径"
node scripts/project.mjs still --dir work/my-segment --time 7.5 --out work/check.png --browser "Chrome路径"
```

直接复用现成模板和素材槽时使用 [原渲染工具](mg-motion/references/rendering.md)。另保留 [20秒积分项目案例](mg-motion/examples/credits-motion/README.md)，它是专用试验，不是所有文案的默认模板。

新增 [三种风格测试案例](mg-motion/examples/style-tests/README.md)：亮色几何、纸张手绘、深色科技，各 12 秒，包含可改工程、参考记录、复跑命令与检查清单。

## 安装与更新

需要 Node.js、npm、本地 Chrome 和可用中文字体。本工程锁定 Remotion 4.0.534；依赖锁保持不变。

1. 克隆本仓库，将整个 mg-motion 文件夹复制到实际 skills 安装目录，如 ~/.codex/skills/ 或 Windows 的 %USERPROFILE%\\.codex\\skills\\。保留已有本地修改后再合并。
2. 在安装目录的 assets/engine 中执行：

   ```text
   npm ci --ignore-scripts --no-audit --no-fund
   ```

3. 使用 --browser 指定 Chrome，或设置 MG_BROWSER_EXECUTABLE。换电脑需检查字体与字宽。
4. 更新时先 git pull --ff-only，再同步实际安装的 Skill。只拉仓库不会更新安装副本；新会话中检查帮助是否包含 refs，并确认 scripts/project.mjs 存在。

## 验证与边界

运行 `node scripts/verify.mjs` 检查 TypeScript、参数、参考索引与工具行为。工程工具的 check 只加载合成并渲染第0帧，完整动作和美感需要实看。实际试跑记录与项目放在 [workflow-cases](mg-motion/examples/workflow-cases/README.md)。

默认补画面为 1920×1080、30fps、无声；比例、声音和特殊动作可在独立项目实现并验证。不会自动写入剪辑软件时间线。输出保留可改工程/参数和哈希清单，visualReviewed:false 不代表已经通过人工审美验收。

当前 30 项是人工选择的初始参考集，未重新观看全部原始视频。历史预览不等于最新参数的视觉验收；新增项目示例也不证明所有题材或所有模型都达到同等质量。后续根据真实补画面案例逐步调整参考与方法。

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
