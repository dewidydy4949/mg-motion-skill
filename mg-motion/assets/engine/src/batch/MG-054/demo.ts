import {Props} from './model';
export const referenceProps:Props={"duration": 10, "title": "数据可以缺失，也可以重新拼回", "message": "用同一组数据块，展示局部缺失与逐格恢复。", "grid": 16, "missing": 19, "seed": 47, "labels": ["排列原始数据", "模拟局部缺失", "从保留副本还原"], "note": "概念动画 · 不实现二维码或纠错算法"};
export const usageProps:Props={"duration": 11, "title": "让素材同步的中断与恢复看得见", "message": "示例：传输部分中断后，重新补齐丢失的数据块。", "grid": 18, "missing": 26, "seed": 81, "labels": ["拆分传输数据", "部分数据未送达", "重新传输并补齐"], "note": "每个方格为示意数据块；恢复来自预设副本"};
