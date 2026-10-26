import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 8,
  "title": "同一目标，各自追赶",
  "unit": "步",
  "target": 8000,
  "periods": [
    "起步",
    "追赶",
    "冲刺",
    "终点"
  ],
  "racers": [
    {
      "name": "选手甲",
      "color": "#ef5680",
      "values": [
        2100,
        4500,
        6200,
        7600
      ]
    },
    {
      "name": "选手乙",
      "color": "#9576f1",
      "values": [
        1800,
        4700,
        6100,
        7400
      ]
    },
    {
      "name": "选手丙",
      "color": "#c5fa35",
      "values": [
        1700,
        4100,
        6500,
        8000
      ]
    },
    {
      "name": "选手丁",
      "color": "#46b8e8",
      "values": [
        1500,
        3500,
        5500,
        7100
      ]
    }
  ],
  "note": "竞赛数据为演示，不表示真实运动记录"
};
export const usageProps:Props={
  "durationSeconds": 7,
  "title": "三个小组的任务进度",
  "unit": "项",
  "target": 100,
  "periods": [
    "第一天",
    "第二天",
    "第三天"
  ],
  "racers": [
    {
      "name": "产品组",
      "color": "#ef5680",
      "values": [
        20,
        60,
        90
      ]
    },
    {
      "name": "研发组",
      "color": "#c5fa35",
      "values": [
        30,
        55,
        100
      ]
    },
    {
      "name": "设计组",
      "color": "#46b8e8",
      "values": [
        15,
        70,
        95
      ]
    }
  ],
  "note": "项目进度示意 · 数值由输入时间序列驱动"
};
