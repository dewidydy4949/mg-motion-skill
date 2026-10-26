import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 7,
  "title": "需要一段",
  "emphasis": "聊天画面？",
  "subtitle": "为视频、情景短剧或短片，构造一段清晰的对话。",
  "contact": "小林",
  "note": "把对话变成可编辑的镜头",
  "messages": [
    {
      "role": "me",
      "text": "短片需要聊天画面。",
      "at": 1.5
    },
    {
      "role": "other",
      "text": "截自己的聊天记录？",
      "at": 2.6
    },
    {
      "role": "me",
      "text": "不，我做了这个。",
      "at": 4.1
    },
    {
      "role": "other",
      "text": "看起来很清楚。",
      "at": 5.2
    }
  ]
};
export const usageProps:Props={
  "durationSeconds": 9,
  "title": "演示一次",
  "emphasis": "AI 对话。",
  "subtitle": "用可替换的问答，解释实际使用过程。",
  "contact": "整理助手",
  "note": "示例问答，不代表真实模型输出",
  "messages": [
    {
      "role": "me",
      "text": "整理这段会议记录。",
      "at": 1.7
    },
    {
      "role": "other",
      "text": "按决定和行动项分类？",
      "at": 3.2
    },
    {
      "role": "me",
      "text": "对，补上负责人。",
      "at": 5
    },
    {
      "role": "other",
      "text": "已生成三条待办。",
      "at": 6.7
    }
  ]
};
