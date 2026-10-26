import {Props} from './model';
export const referenceProps:Props={
  "durationSeconds": 6,
  "title": "正在上传，直到完成",
  "processingLabel": "文件上传中",
  "completeLabel": "上传完成",
  "from": 0,
  "to": 100,
  "background": "#15bd8b",
  "accent": "#8054ee",
  "note": "独立全屏状态组件 · 进度为演示"
};
export const usageProps:Props={
  "durationSeconds": 5,
  "title": "素材准备进度",
  "processingLabel": "正在整理素材",
  "completeLabel": "素材准备完成",
  "from": 25,
  "to": 84,
  "background": "#2685cb",
  "accent": "#ee8b40",
  "note": "未达到100%时保持进度，不显示完成勾号"
};
