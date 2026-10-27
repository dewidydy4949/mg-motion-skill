# 三种风格测试工程

三个独立 Remotion 工程：bright-cache（亮色几何）、paper-idea（纸张手绘）、tech-access（深色科技）。均为 12 秒、1920×1080、30 fps、无声，文案、参考和动作组织见各目录 brief.md。

依赖 MG Motion Skill v1.3，仓库提交 206d6c42b256ad092cc6f203193fee27002a4aac：
https://github.com/dewidydy4949/mg-motion-skill

安装 Skill 的锁定依赖后，在本目录运行，例如：

```text
node "你的Skill目录/scripts/project.mjs" render --dir bright-cache --out exports/bright-cache.mp4 --browser "Chrome路径"
node "你的Skill目录/scripts/project.mjs" render --dir paper-idea --out exports/paper-idea.mp4 --browser "Chrome路径"
node "你的Skill目录/scripts/project.mjs" render --dir tech-access --out exports/tech-access.mp4 --browser "Chrome路径"
```

已有输出默认不会覆盖，需要替换时加 --overwrite。画面和时点在 src/ 中，public/ 用于本地素材。项目使用系统中文字体：几何/科技片主要为 Microsoft YaHei，手绘片主要为 KaiTi；换环境需检查字体和字宽。

records/ 保存本次导出参数与哈希清单，不是工程源码。项目无需额外安装依赖，也没有外部网络素材。画面、文案与声音可在源码里继续调整；修改后应重新检查衔接、可读性及最终视频。

## 表达与验证

| 工程 | 文案与表达 | 借鉴参考 |
| --- | --- | --- |
| bright-cache | 常用内容留一份在手边，下次直接取用，发现版本变化后更新副本。用复制、长短路径和版本替换解释缓存。 | MG-060、MG-050 |
| paper-idea | 大想法落到今天的小动作，完成一步再接一步。用灯泡收束、铅笔绘制与纸张接续表现行动。 | MG-015、MG-045 |
| tech-access | 身份通过后仍需核对操作权限。分别演示查看放行、编辑受阻和单独授权后的编辑。 | MG-050、MG-055 |

实际查看了参考的静态预览、使用卡及相关源码，未观看原始参考视频。三条均完整渲染 360 帧，并检查关键帧和正常速度播放采样；本机独立 Chrome 的最终全长播放均报告零掉帧。源码、输出与渲染清单匹配。检查中修正了缓存托盘像锁、版本文字交叠，以及手绘片开头纸边提前露出的问题。

没有真实口播，动作时点按文意估算。技术播放统计不代表审美验收，也不证明所有文案或其他模型都能达到同等效果。这三个工程是专用测试案例，不作为新通用模板注册；视频可按上述命令生成。
