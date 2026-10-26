import {Props} from './model';
export const referenceProps:Props={"duration": 8, "title": "说明数据在什么位置处理", "headline": "工作留在本机", "description": "示例架构：处理与保存均在当前设备进行。", "device": "本地工作设备", "mode": "local", "lock": true, "cloudLabel": "此示例未启用云端同步", "note": "能力示意，必须按实际产品功能、数据流向与配置填写。"};
export const usageProps:Props={"duration": 9, "title": "把同步条件说清楚", "headline": "确认之后再同步", "description": "示例架构：选定资料经授权后发送到团队空间。", "device": "团队资料终端", "mode": "sync", "lock": true, "cloudLabel": "已授权的同步路径", "note": "图标不构成隐私保证；请核对真实产品的同步范围与安全设置。"};
