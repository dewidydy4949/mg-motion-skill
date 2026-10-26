import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 18,
  "title": "多个状态，组成一棵树",
  "levels": [
    "q₀",
    "q₁",
    "q₂"
  ],
  "summary": [
    "叶节点 = 纯状态",
    "亲缘越近，重叠越多",
    "→ 超度量结构"
  ],
  "leaves": [],
  "notes": [],
  "footnote": "参考图示的中文转写；物理结论未在本项目中核实"
};
export const usageProps:Props={
  "durationSeconds": 14,
  "title": "把复杂任务，逐层拆开",
  "levels": [
    "目标",
    "阶段",
    "动作"
  ],
  "summary": [
    "每个叶节点，都是一个可执行动作",
    "同一分支共享上下文",
    "→ 并行执行，逐层汇总"
  ],
  "leaves": [
    "收集",
    "分类",
    "摘录",
    "检索",
    "起草",
    "配图",
    "核对",
    "交付"
  ],
  "notes": [
    "先明确任务目标",
    "把阶段拆成具体动作",
    "每个动作都有验收结果"
  ],
  "footnote": "任务拆分的参数示例，不代表真实系统执行结果"
};
