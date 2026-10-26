import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AgentForm, P03Props, P03_DURATION, validateP03} from './AgentForm';

export const REFERENCE: P03Props = {
  title: 'Agent 帮你填写上架信息', subtitle: '并配置授权兑换',
  browserLabel: 'studio.example / products / your-app',
  fields: [{label:'名称',value:'你的应用'},{label:'一句话介绍',value:'自动处理繁琐工作'},{label:'方案',value:'$59 终身使用'}],
  featuresTitle:'包含功能',features:['不限项目','团队席位','后续 AI 更新'],
  panelTitle:'授权设置',tabs:['兑换码','授权'],
  settings:[{label:'接收地址',value:'app.example/redeem'},{label:'回调地址',value:'app.example/thanks'}],
  button:'运行测试',complete:'已通过',
};
export const USAGE: P03Props = {
  title:'Agent 帮你整理活动报名',subtitle:'再安排通知与日历提醒',
  browserLabel:'studio.example / events / workshop',
  fields:[{label:'活动',value:'AI 创作工作坊'},{label:'时间',value:'11 月 8 日 14:00'},{label:'人数',value:'30 个席位'}],
  featuresTitle:'自动完成',features:['填写报名资料','发送提醒邮件','生成日历邀请'],
  panelTitle:'通知设置',tabs:['邮件','日历'],
  settings:[{label:'提醒对象',value:'已报名用户'},{label:'发送时间',value:'活动开始前 1 小时'}],
  button:'检查配置',complete:'准备就绪',
};
validateP03(REFERENCE); validateP03(USAGE);
const Root:React.FC=()=> <>
  <Composition id="P03-Reference" component={AgentForm} durationInFrames={Math.round(P03_DURATION*30)} fps={30} width={1920} height={1080} defaultProps={REFERENCE} calculateMetadata={({props})=>({props:validateP03(props)})}/>
  <Composition id="P03-Usage" component={AgentForm} durationInFrames={Math.round(P03_DURATION*30)} fps={30} width={1920} height={1080} defaultProps={USAGE} calculateMetadata={({props})=>({props:validateP03(props)})}/>
</>;
registerRoot(Root);
