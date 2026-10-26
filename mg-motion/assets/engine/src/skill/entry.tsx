import React from 'react';
import {AbsoluteFill, Composition, Sequence, registerRoot, staticFile} from 'remotion';
import {registry} from './registry';

export type Shot = {templateId:string; variant?:'reference'|'usage'; props?:Record<string,unknown>; durationSeconds?:number};
export type Plan = {shots:Shot[]};
const object=(x:unknown)=>Boolean(x)&&typeof x==='object'&&!Array.isArray(x);
const resolveAssets=(x:any):any=>typeof x==='string'&&x.startsWith('mg-static:')?new URL(staticFile(x.slice(10)),window.location.href).href:Array.isArray(x)?x.map(resolveAssets):object(x)?Object.fromEntries(Object.entries(x).map(([k,v])=>[k,resolveAssets(v)])):x;

export function resolveShot(shot:Shot){
 if(!object(shot))throw new Error('每个镜头必须为对象');
 const d=registry[shot.templateId];
 if(!d)throw new Error('未知模板：'+shot.templateId);
 if(shot.variant!==undefined&&!['reference','usage'].includes(shot.variant))throw new Error('variant 仅支持 reference 或 usage');
 if(shot.props!==undefined&&!object(shot.props))throw new Error('props 必须为对象');
 const variant=shot.variant||'usage';
 const p={...d[variant],...shot.props};
 if(shot.durationSeconds!==undefined){
  if(!Number.isFinite(shot.durationSeconds)||shot.durationSeconds<=0)throw new Error('durationSeconds 必须为正数');
  if(d.fixedDuration!==null&&Math.abs(shot.durationSeconds-d.fixedDuration)>.00001)throw new Error(shot.templateId+' 固定 '+d.fixedDuration+' 秒，请换用可变时长模板或拆分镜头');
  if(d.durationKey)p[d.durationKey]=shot.durationSeconds;
 }
 const seconds=shot.durationSeconds??(d.durationKey?p[d.durationKey]:d[variant==='reference'?'referenceDuration':'usageDuration']);
 if(typeof seconds!=='number'||!Number.isFinite(seconds)||seconds<1||seconds>120)throw new Error('单镜头时长需为 1–120 秒，具体模板边界见使用卡');
 if(d.minDuration&&seconds<d.minDuration)throw new Error(shot.templateId+' 至少 '+d.minDuration+' 秒');
 const props=resolveAssets(p);
 d.validate(props);
 return {Component:d.Component,props,frames:Math.round(seconds*30)};
}
export function resolvePlan(plan:Plan){
 if(!Array.isArray(plan.shots)||plan.shots.length<1||plan.shots.length>100)throw new Error('shots 必须为 1–100 个镜头');
 let from=0;
 return plan.shots.map(shot=>{const r=resolveShot(shot);const out={...r,from};from+=r.frames;return out;});
}
const Single:React.FC<Shot>=(shot)=>{const {Component,props}=resolveShot(shot);return <Component {...props}/>;};
const Timeline:React.FC<Plan>=(plan)=><AbsoluteFill style={{background:'#000'}}>{resolvePlan(plan).map(({Component,props,frames,from},i)=><Sequence key={i} from={from} durationInFrames={frames}><Component {...props}/></Sequence>)}</AbsoluteFill>;
const defaultShot:Shot={templateId:'MG-013'};
const Root:React.FC=()=> <>
 <Composition id="MG-Single" component={Single} defaultProps={defaultShot} width={1920} height={1080} fps={30} durationInFrames={255} calculateMetadata={({props})=>({durationInFrames:resolveShot(props).frames})}/>
 <Composition id="MG-Timeline" component={Timeline} defaultProps={{shots:[defaultShot]}} width={1920} height={1080} fps={30} durationInFrames={255} calculateMetadata={({props})=>({durationInFrames:resolvePlan(props).reduce((n,s)=>n+s.frames,0)})}/>
</>;
registerRoot(Root);
