import {Props} from './model';
export const referenceProps:Props={
  "title": "一条执行线，完成整个交付",
  "durationSeconds": 12,
  "taskLabel": "示例任务：发布一份产品说明",
  "completionNote": "交付文件已准备好，可以进入最终验收",
  "accent": "#7e982c",
  "stages": [
    {
      "code": "PLAN",
      "label": "规划",
      "description": "整理目标，拆分需要完成的任务"
    },
    {
      "code": "BUILD",
      "label": "执行",
      "description": "生成内容，组装可检查的成果"
    },
    {
      "code": "VERIFY",
      "label": "验证",
      "description": "逐项核对，修正发现的问题"
    },
    {
      "code": "SHIP",
      "label": "交付",
      "description": "导出文件，提交最终验收"
    }
  ]
};
export const usageProps:Props={
  "title": "从选题到发布，逐步推进",
  "durationSeconds": 14,
  "taskLabel": "示例任务：制作一份月度洞察报告",
  "completionNote": "报告、图表与摘要已经整理完成",
  "accent": "#47877c",
  "stages": [
    {
      "code": "RESEARCH",
      "label": "调研",
      "description": "收集资料并确认信息来源"
    },
    {
      "code": "DRAFT",
      "label": "写作",
      "description": "归纳结论，完成报告初稿"
    },
    {
      "code": "REVIEW",
      "label": "校验",
      "description": "检查数据和文字表达"
    },
    {
      "code": "PUBLISH",
      "label": "发布",
      "description": "导出正式版并归档素材"
    }
  ]
};
