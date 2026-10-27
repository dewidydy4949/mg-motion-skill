# 文案补画面：两次独立试跑

这两个项目用于检验“理解文案 → 查看参考 → 重新组织画面 → 渲染检查”的流程。它们由分别执行任务的模型代理制作，是可修改的示例，不是通用模板，也不是 Claude / DeepSeek 的对比评测。

## 10 秒：共同输入与核对依据

原文：同一段资料，先让两款工具回答同一个问题，再核对答案是否有依据。

工程：same-input-10s/。查看了 MG-013 的静态预览、使用卡和源码，借鉴输入分发与并列关系。持续保留同一份资料，工具面板展开为回答，再将回答重点回连到原文；抽象行条表示流程，不伪造真实答案或核验结果。

已渲染 1920×1080、30 fps、300 帧、10 秒无声视频，查看关键帧和正常速度实播采样。在本机 Chrome 的一次 1× 全长播放中，解码 300 帧，播放器报告 2 帧掉帧；未宣称零掉帧或逐帧审看。

## 30 秒：资料整理为可执行计划

原文：把一堆资料整理成可执行的计划，可以先提取关键信息，再按主题归类，接着把结论变成待办。每个待办都要能回到原始依据。不确定的信息先标出来，最后由人确认，再开始执行。

工程：document-to-plan-30s/。查看了 MG-021 的静态预览、使用卡和源码，以及 MG-015 的预览与动作说明。借鉴纸张、网点与圈注反馈，把提取、归类、待办、追溯、人工确认组织在一个持续的画面系统中。没有使用原模板的等级评分语义或强拉其时长边界。

已渲染 1920×1080、30 fps、900 帧、30 秒无声视频。查看 9.5、18、22、25.3、29.966 秒的关键帧和 18 张正常速度播放采样，修复了圈注遮字与来源标记对应。一次本机 Chrome 1× 全长播放报告 900 帧、零掉帧。

## 修改与复跑

依赖安装见仓库 README。在 mg-motion/ 目录运行，替换本机 Chrome 路径：

```text
node scripts/project.mjs render --dir examples/workflow-cases/same-input-10s --props examples/workflow-cases/same-input-10s/props.json --out outputs/same-input-10s.mp4 --browser "Chrome路径"
node scripts/project.mjs render --dir examples/workflow-cases/document-to-plan-30s --props examples/workflow-cases/document-to-plan-30s/project-props.json --out outputs/document-to-plan-30s.mp4 --browser "Chrome路径"
```

各项目的 brief.md 记录参考与动作组织；src/entry.tsx 为画面源码，JSON 为参数。public/ 用于后续加入素材。10 秒案例的片长在 Composition 中设定；30 秒案例允许 durationSeconds 同比缩放，改时长后需复查阅读节奏。中文字体优先 Microsoft YaHei / Noto Sans SC，换环境需复查字宽。

这次没有真实口播音频，时点按文意估算；没有观看原始参考视频，所看内容为库内预览、动作说明及源码。播放完成和掉帧统计是技术验证，美感判断仍基于实际可见采样及用户验收。这两例不证明任意文案、任意模型都达到相同效果。
