# 自由场景项目与渲染

当参考中的设计需要重新组织、旧模板参数不能表达文案时，直接编写项目场景。此工具复用锁定的 Remotion 依赖和导出流程，不规定卡片、阶段、动作或镜头语法。已有模板适合时仍可走 rendering.md，不必绕进新项目。

## 建立项目

在 Skill 目录运行，或使用脚本的绝对路径：

```text
node scripts/project.mjs init --dir /path/to/project
```

目标目录必须不存在。生成 project.json、src/entry.tsx、public/、brief.md；不会修改安装库或覆盖已有项目。初始场景是空白画布，不能作为成片交付。

在 brief.md 保存原文、目标时长（或估算）、参考编号/路径与具体借鉴之处、主要动作与检查记录。格式由项目需要决定，不是必须逐项填满的分镜表。

在 src/entry.tsx 实现画面，可拆组件、写 SVG、使用 Remotion 的帧时间、Sequence、图像或声音。project.json 的 composition 对应入口注册的 Composition ID；时长、分辨率与 fps 由真实 Composition 和 calculateMetadata 决定。10/20/30 秒不需要不同工程模式。没有自动文案生成动画的专用 API，创作由使用 Skill 的模型完成。

依赖来自此 Skill 的 assets/engine/node_modules，按 rendering.md 安装即可。项目在另一台机器复跑时需保留项目文件，并在那台机器安装同版本 Skill 依赖；工具不会偷偷安装额外包。额外需要的依赖和外部源码应单独记录。

## 素材和参数

把图片、视频、字体或已授权音频放入项目 public/，组件用 staticFile('name.ext') 引用。视频可用 OffthreadVideo，声音可用 Audio 等现有 Remotion 能力。素材仍需核实与文案一致；静音/音量、裁切和音视频时间由项目负责。

可以在 Composition 中使用 defaultProps 和 calculateMetadata，并通过 --props project-props.json 传 JSON 对象。这是项目自己的参数，不要求套用旧模板字段。

## 检查、渲染与抽帧

```text
node scripts/project.mjs check --dir /path/to/project --browser "Chrome路径"
node scripts/project.mjs render --dir /path/to/project --out outputs/segment.mp4 --browser "Chrome路径"
node scripts/project.mjs still --dir /path/to/project --time 7.5 --out work/transition.png --browser "Chrome路径"
```

check 加载实际合成并渲染第 0 帧，便于发现入口和依赖问题；它不检查全片动作。still 的时间按合成 fps 换算且必须小于片长，输出 PNG。render 输出完整 H.264 MP4；可用 --concurrency 1..16 调整并发（默认 2）。支持 MG_BROWSER_EXECUTABLE 代替每次写 --browser。

构建文件位于项目的 work/，可用 --work-dir 改到任务临时目录。构建根目录固定为项目目录，并关闭 Webpack 持久缓存，避免把缓存写入调用目录。已存在输出或旁车记录不会覆盖，明确需要替换时传 --overwrite。构建文件与素材、源码分别保存，不要把输出和依赖放进 src/ 或 public/。

每个视频或抽帧输出附带 .input.json 与 .manifest.json，记录操作、输入参数、真实合成时长/尺寸、项目源码与素材哈希、项目配置和依赖锁哈希。抽帧还记录请求秒数、四舍五入后的帧号与实际采样秒数。源码优先放 src/，构建文件放 work/；工具排除 work/out/outputs/dist/node_modules/.git 等生成目录，外部源码和额外依赖需另行记录。visualReviewed:false 需要项目检查记录补充，不是工具能自动判定的美感分数。复跑依然需要完整项目，不能只留 MP4 或 manifest。

源码与素材留在项目中；确认同一个动作在不同内容里都成立后，再考虑按 expansion.md 入库。当前项目工具不把一个成功案例自动变成通用模板。
