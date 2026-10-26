import type {Props} from './model';
export const referenceProps:Props={
  "title": "让代码变化看得见",
  "durationSeconds": 16,
  "fileName": "carousel.js",
  "steps": [
    {
      "title": "读取每张卡片的位置",
      "note": "先计算相对中心的位移，预览卡片随位置平滑移动。",
      "code": [
        "const progress = slide.progress;",
        "const offset = progress * 360;",
        "slide.style.transform =",
        "  `translateX(${offset}px)`;"
      ],
      "highlight": 1,
      "result": "位置跟随",
      "detail": "滑动距离对应画面位移",
      "accent": "#638e79"
    },
    {
      "title": "让文字跟随位移",
      "note": "将位移映射到文字高度，让卡片与文案形成层次。",
      "code": [
        "const distance = Math.abs(progress);",
        "const y = distance * 50;",
        "text.style.transform =",
        "  `translateY(${y}px)`;"
      ],
      "highlight": 3,
      "result": "文字视差",
      "detail": "同一数据驱动不同层次",
      "accent": "#d88696"
    },
    {
      "title": "根据速度调整吸附",
      "note": "快滑缩短吸附时间；数值示例仅用于解释动画逻辑。",
      "code": [
        "const speed = distance / elapsed;",
        "const duration = 1000 - speed * 800;",
        "swiper.params.speed =",
        "  Math.max(200, Math.min(1000, duration));"
      ],
      "highlight": 3,
      "result": "速度响应",
      "detail": "限制最短与最长时间",
      "accent": "#aa94c9"
    }
  ]
};
export const usageProps:Props={
  "title": "AI 页面动效改写 · 示例",
  "durationSeconds": 15,
  "fileName": "hero-animation.ts",
  "steps": [
    {
      "title": "先定义初始状态",
      "note": "示例将标题放在起始位置，等待进入视口后播放。",
      "code": [
        "const initial = {",
        "  opacity: 0,",
        "  translateY: 24,",
        "};"
      ],
      "highlight": 2,
      "result": "淡入标题",
      "detail": "初始偏移 24 像素",
      "accent": "#768fbd"
    },
    {
      "title": "平滑进入最终位置",
      "note": "同一进度同时控制位置与透明度，避免动作割裂。",
      "code": [
        "const p = smoothstep(progress);",
        "const opacity = p;",
        "const y = 24 * (1 - p);",
        "title.style.opacity = opacity;"
      ],
      "highlight": 0,
      "result": "统一节奏",
      "detail": "位置与透明度同步",
      "accent": "#ba8b62"
    },
    {
      "title": "限制过度的运动",
      "note": "面向演示的简化代码，不在模板内执行用户代码。",
      "code": [
        "const reduced = prefersReducedMotion;",
        "const travel = reduced ? 0 : 24;",
        "const duration = reduced ? 0 : 420;",
        "animate({travel, duration});"
      ],
      "highlight": 2,
      "result": "减少动态",
      "detail": "保留内容与信息层级",
      "accent": "#668e8a"
    }
  ]
};

