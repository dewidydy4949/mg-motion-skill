import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 8,
  "title": "问题里的预设，先找出来",
  "leftLabel": "原始提问",
  "rightLabel": "中性改写",
  "original": "为什么这份报告忽略了明显的成本问题？",
  "highlight": "忽略了明显的成本问题",
  "revised": "这份报告如何讨论成本？哪些信息尚未提供？",
  "leftNote": "提问提前写入了“忽略”的判断。",
  "rightNote": "先询问信息，再评估证据。",
  "takeaway": "删除预设结论，让回答回到可检查的信息。",
  "note": "提示词对照示例，不引用真实产品回答"
};
export const usageProps:Props={
  "durationSeconds": 7,
  "title": "把笼统要求，改成可执行任务",
  "leftLabel": "原始要求",
  "rightLabel": "具体任务",
  "original": "帮我写一个非常优秀的项目总结。",
  "highlight": "非常优秀",
  "revised": "按成果、问题、下一步三部分整理总结，每部分列出两项。",
  "leftNote": "评价词没有说明需要什么内容。",
  "rightNote": "结构和条数让交付目标更清楚。",
  "takeaway": "用明确的结构与要求，替换模糊的评价词。",
  "note": "中文业务复用验证 · 文案可全部替换"
};
