import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 7,
  "title": "同时问它们。",
  "question": "规划产品发布",
  "inputHint": "输入同一个问题，查看不同回答",
  "note": "参考文案译写 · 非模型实测",
  "answers": [
    {
      "name": "GPT-5",
      "color": "#21b28e",
      "body": "这是一个四周发布计划。\n第一周：开放候补名单，放出短演示。\n第二周：邀请早期用户体验。"
    },
    {
      "name": "Claude",
      "color": "#c87d72",
      "body": "先确定产品面向谁。\n选定一个受众、一项承诺、一个渠道，让早期用户讲述体验。"
    },
    {
      "name": "Gemini",
      "color": "#5877d9",
      "body": "阶段一：用预告页面和候补名单积累期待。\n阶段二：在发布渠道上线，再分享成果。"
    }
  ]
};
export const usageProps:Props={
  "durationSeconds": 8,
  "title": "比较两种表达。",
  "question": "把会议结论整理清楚",
  "inputHint": "相同资料与要求，观察内容差异",
  "note": "两列复用验证 · 回答为演示文本",
  "answers": [
    {
      "name": "方案 A",
      "color": "#21b28e",
      "body": "按事项整理：\n确认发布范围。\n列出负责人。\n未确定的日期保留为待确认。"
    },
    {
      "name": "方案 B",
      "color": "#5877d9",
      "body": "按行动整理：\n先核对需求，再安排任务。\n每项行动写明责任人。\n单独汇总待确认的问题。"
    }
  ]
};
