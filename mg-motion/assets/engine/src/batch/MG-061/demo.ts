import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 8.7,
  "title": "主节点离线",
  "subtitle": "B 发现租约已过期，接管任务。同一时刻，只有一个节点胜出。",
  "nodes": [
    "A",
    "B",
    "C"
  ],
  "failedIndex": 0,
  "successorIndex": 1,
  "leaseSeconds": 10,
  "eventTimes": [
    "8:00",
    "19:59",
    "20:00"
  ],
  "bucketTitle": "共享存储",
  "channelTitle": "事件频道",
  "footnote": "按参考机制做的动画示意；技术结论未在本项目中验证"
};
export const usageProps:Props={
  "durationSeconds": 11,
  "title": "断线以后，任务接着跑",
  "subtitle": "制作节点失联后，备用节点取得任务，继续提交一次结果。",
  "nodes": [
    "甲",
    "乙",
    "丙"
  ],
  "failedIndex": 1,
  "successorIndex": 2,
  "leaseSeconds": 15,
  "eventTimes": [
    "09:00",
    "09:59",
    "10:00"
  ],
  "bucketTitle": "任务登记簿",
  "channelTitle": "交付记录",
  "footnote": "Agent 调度的参数示例；此画面不连接真实后台"
};
