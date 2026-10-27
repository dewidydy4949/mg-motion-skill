# 积分案例：动作编排试验

这是一个固定 20 秒的项目案例，用于检验新的制作方法，不是可以接收任意文案的通用模板。主题为假设性的积分到期与套餐选择；120 是示意数值，图形任务数量不代表实际兑换比例。

与 `story` 的固定信息布局不同，本例将积分环、到期边界、任务图形、单位价格和结论按时间编排；统一色彩、字形和图形语言，允许图形形态与分布变化。画面不依赖配音或 BGM 才成立。

## 运行

先按主说明安装 `assets/engine` 的锁定依赖。无需单独安装本目录依赖。

```text
node examples/credits-motion/render.mjs --out outputs/credits-motion.mp4 --browser "Chrome可执行文件路径"
node examples/credits-motion/render.mjs --out outputs/credits-motion-5s.png --still 5 --browser "Chrome可执行文件路径"
```

命令默认输出无声 1920×1080、30fps、20 秒视频。可用 `--work-dir` 指定暂存目录；目标文件已存在会报错。输出旁的 manifest 记录源码和视频哈希；`visualReviewed:false` 不代表已有人看过结果。

## 如何改

- `entry.tsx` 中的 `copy` 是各阶段文案，`stages` 是动作边界；它们与图形动作紧密相关，不能只任意改时长而不调整动作。
- `position()` 定义同一组图形在各阶段的布局与形态，`Tokens` 负责交接，`Diagram` 负责到期、价格与结论的含义。
- 顶部 `C` 管理配色。字体依赖实际机器；修改文案、字体或尺寸后，需检查遮罩揭字是否截断。
- “积分失效”与“选择套餐”是两个概念阶段，后者的图形表示任务，不能解释为已失效积分重新恢复。

此案例不加入 50 个稳定模板的注册表，不自动替代 `story`，也未经过不同题材的通用性验证。后续应先做另一类内容的项目，再提炼真正重复的动作组件。

## 可选声音试验

`make_soundtrack.py` 用 Python 和 NumPy 在指定目录生成原创程序合成的轻节奏与同步音效，支持独立 BGM、独立音效和混合音轨。音轨仅用于比较声画节奏，没有旁白；不是通用配乐服务。声音事件对应本案例时码，修改画面后需重新同步。生成后应试听，波形和峰值检查不能代替听觉验收。

```text
python examples/credits-motion/make_soundtrack.py --out work/credits-audio
ffmpeg -i outputs/credits-motion.mp4 -i work/credits-audio/credits-music-sfx-20s.wav -c:v copy -c:a aac -b:a 192k -t 20 outputs/credits-motion-sound.mp4
```
