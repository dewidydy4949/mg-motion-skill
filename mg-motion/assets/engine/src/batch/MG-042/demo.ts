import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 8,
  "label": "轻读",
  "title": "听它朗读出来。",
  "chapter": "第一章 · 朗读",
  "tokens": [
    {
      "text": "一个",
      "at": 1.4,
      "marked": false
    },
    {
      "text": "年轻女孩",
      "at": 2,
      "marked": false
    },
    {
      "text": "和她的",
      "at": 2.8,
      "marked": false
    },
    {
      "text": "父亲",
      "at": 3.5,
      "marked": false
    },
    {
      "text": "以及",
      "at": 4.2,
      "marked": false
    },
    {
      "text": "继母",
      "at": 4.8,
      "marked": true
    },
    {
      "text": "住在一起。",
      "at": 5.6,
      "marked": false
    }
  ],
  "context": "继母有两个女儿，她们总是把家务留给女孩。清晨，她打扫房间、整理衣物，再去厨房准备晚餐。尽管生活并不轻松，女孩始终保持着温柔和善意。",
  "translation": "重点词保留在原文中，朗读进度逐步向前。",
  "action": "讨论这段文字"
};
export const usageProps:Props={
  "durationSeconds": 10,
  "label": "提示词课堂",
  "title": "逐句看懂这个要求。",
  "chapter": "提示词 · 重点拆解",
  "tokens": [
    {
      "text": "请将",
      "at": 1.2,
      "marked": false
    },
    {
      "text": "这段会议记录",
      "at": 2,
      "marked": false
    },
    {
      "text": "整理为",
      "at": 3,
      "marked": false
    },
    {
      "text": "三个",
      "at": 4,
      "marked": true
    },
    {
      "text": "行动项",
      "at": 5,
      "marked": true
    },
    {
      "text": "，并标注",
      "at": 6,
      "marked": false
    },
    {
      "text": "负责人",
      "at": 6.8,
      "marked": false
    },
    {
      "text": "和截止日期。",
      "at": 7.7,
      "marked": false
    }
  ],
  "context": "先区分已经作出的决定和仍需讨论的问题，再提取可执行事项。缺少负责人或时间时，请保留待确认标记，避免自行补充不存在的信息。",
  "translation": "观察“数量、输出结构、必填字段”三个约束。",
  "action": "检查提示词结构"
};
