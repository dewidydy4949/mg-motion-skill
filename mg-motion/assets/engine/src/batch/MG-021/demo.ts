import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 8,
  "title": "每份文档，都有去向",
  "classifier": "文档分类器",
  "note": "分级与评分均为演示",
  "documents": [
    {
      "name": "研究提案",
      "grade": "A",
      "score": 94
    },
    {
      "name": "会议记录",
      "grade": "B",
      "score": 81
    },
    {
      "name": "待补资料",
      "grade": "C",
      "score": 65
    }
  ]
};
export const usageProps:Props={
  "durationSeconds": 9,
  "title": "资料入库前，先做检查",
  "classifier": "质量检查",
  "note": "示例规则 · 并非真实审核结果",
  "documents": [
    {
      "name": "项目说明",
      "grade": "优",
      "score": 96
    },
    {
      "name": "产品手册",
      "grade": "良",
      "score": 88
    },
    {
      "name": "历史草稿",
      "grade": "待补",
      "score": 62
    },
    {
      "name": "常见问答",
      "grade": "优",
      "score": 93
    }
  ]
};
