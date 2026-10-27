import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 6,
  "title": "跨过目标线，状态翻转",
  "metric": "完成率",
  "before": 68,
  "after": 86,
  "threshold": 75,
  "beforeLabel": "需要继续推进",
  "afterLabel": "已超过目标",
  "note": "演示数据 · 状态由阈值自动判断",
  "meaning": "threshold",
  "thresholdLabel": "合格线",
  "passLabel": "已达标",
  "failLabel": "未达标",
  "statusHeading": "STATUS"
};
export const usageProps:Props={
  "durationSeconds": 7,
  "title": "本周交付，是否达标",
  "metric": "按时交付比例",
  "before": 72,
  "after": 94,
  "threshold": 90,
  "beforeLabel": "仍有任务延误",
  "afterLabel": "目标已经完成",
  "note": "示例业务数据 · 请替换为真实记录",
  "meaning": "threshold",
  "thresholdLabel": "合格线",
  "passLabel": "已达标",
  "failLabel": "未达标",
  "statusHeading": ""
};
