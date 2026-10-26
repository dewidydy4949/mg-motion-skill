// 参考 362 的 39.65–43.5 秒；四个连续移动的孔版印刷控制滑杆。
import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Paper,SvgText,prog,ease,text,duration,array,numeric,FONT} from '../parallel-C/common';
export type Props={
 /** 4–15秒。 */ durationSeconds:number;
 /** 标题，最多15中文字宽。 */ title:string;
 /** 2–5个滑杆。标签最多6中文字宽，关键值0–100，每个3–6个值。 */ sliders:{label:string;values:number[]}[];
 /** 是否显示当前位置百分比。 */ showValues:boolean;
 /** 底部可选注释，空串关闭。 */ note:string;
};
export function validateProps(p:Props):Props{if(!p)throw Error('缺少参数');duration(p.durationSeconds,4,15);text(p.title,15,'title');array(p.sliders,2,5,'sliders');p.sliders.forEach((s,i)=>{text(s.label,6,`sliders[${i}].label`);array(s.values,3,6,`sliders[${i}].values`);s.values.forEach((v,j)=>numeric(v,0,100,`values[${j}]`))});if(typeof p.showValues!=='boolean')throw Error('showValues须为布尔值');if(p.note!=='')text(p.note,40,'note');return p}
export const Template:React.FC<Props>=(raw)=>{const p=validateProps(raw);const f=useCurrentFrame(),{fps}=useVideoConfig();const u=f/fps/p.durationSeconds;return <AbsoluteFill><svg viewBox="0 0 1920 1080" width="100%" height="100%"><Paper color="#eae6d8" grain={.22}/><defs><pattern id="riso-speck" width="41" height="47" patternUnits="userSpaceOnUse">{Array.from({length:24},(_,i)=><circle key={i} cx={(i*19+3)%41} cy={(i*31+7)%47} r={i%3===0?1.5:.8} fill="#000" opacity={.48}/>)}</pattern><mask id="riso-mask"><rect width="1920" height="1080" fill="white"/><rect width="1920" height="1080" fill="url(#riso-speck)" opacity=".75"/></mask></defs>
<g opacity={prog(u,0,.06)} mask="url(#riso-mask)"><SvgText x={960} y={215} value={p.title} size={112} color="#087098" weight={900} anchor="middle" maxWidth={1600}/>
{p.sliders.map((s,i)=>{const x=300+i*1320/(p.sliders.length-1);const z=Math.max(0,Math.min(.99999,(u-.08)/.76))*(s.values.length-1);const idx=Math.floor(z);const v=s.values[idx]+(s.values[Math.min(idx+1,s.values.length-1)]-s.values[idx])*ease(z-idx);const y=875-v*5.4;return <g key={i} opacity={prog(u,.04+i*.025,.06)}><path d={`M${x} 330 L${x+1.5} 875`} stroke="#08779e" strokeWidth="17"/><path d={`M${x-60} 881L${x+64} 881`} stroke="#dcd94c" strokeWidth="4"/><rect x={x-79} y={y-38} width="158" height="78" rx="17" fill="#ef4a8a"/><path d={`M${x} ${y-38}v78`} stroke="#076e94" strokeWidth="16" opacity=".8"/><SvgText x={x} y={968} value={s.label} size={52} anchor="middle" color="#08779e" weight={900} maxWidth={250}/>{p.showValues&&<SvgText x={x+100} y={y+12} value={`${Math.round(v)}%`} size={34} color="#08779e" weight={700}/>}</g>})}</g>
{p.note&&<SvgText x={960} y={1038} value={p.note} size={26} anchor="middle" color="#687174" weight={400}/>}</svg></AbsoluteFill>};
