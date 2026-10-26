import {Props} from './model';
export const referenceProps:Props={
  "title": "手机操作与步骤说明卡",
  "durationSeconds": 12,
  "appName": "随行工作台",
  "accent": "#b5ddc9",
  "steps": [
    {
      "title": "打开任务入口",
      "note": "从首页进入任务列表，找到这次需要处理的项目。",
      "screenTitle": "今日任务",
      "rows": [
        "内容整理",
        "会议纪要",
        "资料归档"
      ],
      "button": "进入工作台",
      "feedback": "任务列表已打开",
      "tap": {
        "x": 0.5,
        "y": 0.69
      }
    },
    {
      "title": "选择导出方式",
      "note": "选中需要的格式，检查文件名称后继续。",
      "screenTitle": "导出内容",
      "rows": [
        "复制为文本",
        "生成文档",
        "保存到本地"
      ],
      "button": "确认导出",
      "feedback": "导出方式已选择",
      "tap": {
        "x": 0.5,
        "y": 0.36
      }
    },
    {
      "title": "复制并完成",
      "note": "点击复制链接，把整理后的内容带到下一步工作。",
      "screenTitle": "分享成果",
      "rows": [
        "链接访问",
        "权限设置",
        "保存副本"
      ],
      "button": "复制链接",
      "feedback": "链接复制成功",
      "tap": {
        "x": 0.5,
        "y": 0.69
      }
    }
  ]
};
export const usageProps:Props={
  "title": "三步提交差旅报销",
  "durationSeconds": 15,
  "appName": "企业服务",
  "accent": "#e9ca8e",
  "steps": [
    {
      "title": "创建报销单",
      "note": "打开员工服务，选择差旅报销并填写出行目的。",
      "screenTitle": "员工服务",
      "rows": [
        "差旅报销",
        "费用申请",
        "审批记录"
      ],
      "button": "新建报销单",
      "feedback": "报销单已创建",
      "tap": {
        "x": 0.5,
        "y": 0.69
      }
    },
    {
      "title": "添加出差凭证",
      "note": "选中本次行程，上传交通和住宿凭证。",
      "screenTitle": "本次出差",
      "rows": [
        "交通费用",
        "住宿费用",
        "出差补贴"
      ],
      "button": "保存凭证",
      "feedback": "凭证保存成功",
      "tap": {
        "x": 0.5,
        "y": 0.36
      }
    },
    {
      "title": "确认后提交",
      "note": "核对费用明细和收款账户，再提交审批。",
      "screenTitle": "确认报销",
      "rows": [
        "费用明细",
        "收款账户",
        "审批人员"
      ],
      "button": "提交审批",
      "feedback": "已提交审批",
      "tap": {
        "x": 0.5,
        "y": 0.69
      }
    }
  ]
};
