import type {Props} from './model';
export const referenceProps:Props={
  "title": "让每一步更清楚",
  "durationSeconds": 12,
  "steps": [
    {
      "word": "点击",
      "hint": "点击这里，开始操作。",
      "action": "click",
      "theme": "light",
      "focus": {
        "x": 0.2,
        "y": 0.31,
        "w": 0.22,
        "h": 0.2
      }
    },
    {
      "word": "引导",
      "hint": "把说明放在正在操作的位置。",
      "action": "guide",
      "theme": "dark",
      "focus": {
        "x": 0.2,
        "y": 0.31,
        "w": 0.22,
        "h": 0.2
      }
    },
    {
      "word": "模糊",
      "hint": "选中需要隐藏的局部信息。",
      "action": "blur",
      "theme": "blue",
      "focus": {
        "x": 0.3,
        "y": 0.33,
        "w": 0.12,
        "h": 0.18
      }
    },
    {
      "word": "放大",
      "hint": "让关键动作占据更多画面。",
      "action": "zoom",
      "theme": "light",
      "focus": {
        "x": 0.2,
        "y": 0.31,
        "w": 0.22,
        "h": 0.2
      }
    }
  ]
};
export const usageProps:Props={
  "title": "教程录屏的四种标记",
  "durationSeconds": 12,
  "steps": [
    {
      "word": "打开",
      "hint": "先打开项目面板。",
      "action": "click",
      "theme": "light",
      "focus": {
        "x": 0.2,
        "y": 0.31,
        "w": 0.22,
        "h": 0.2
      }
    },
    {
      "word": "确认",
      "hint": "确认模型和输出格式。",
      "action": "guide",
      "theme": "dark",
      "focus": {
        "x": 0.2,
        "y": 0.31,
        "w": 0.22,
        "h": 0.2
      }
    },
    {
      "word": "隐去",
      "hint": "分享前隐藏账号信息。",
      "action": "blur",
      "theme": "blue",
      "focus": {
        "x": 0.3,
        "y": 0.33,
        "w": 0.12,
        "h": 0.18
      }
    },
    {
      "word": "查看",
      "hint": "放大查看生成结果。",
      "action": "zoom",
      "theme": "light",
      "focus": {
        "x": 0.2,
        "y": 0.31,
        "w": 0.22,
        "h": 0.2
      }
    }
  ]
};

