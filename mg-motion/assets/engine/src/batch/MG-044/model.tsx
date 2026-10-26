import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Box,Canvas,prog,clamp,em,text,count,number,hex} from '../parallel-B/common';
/** 参考301的22–25.8秒：便签落入周历→重点任务扇出到四个渠道。 */
export type Props={
 /** 6–20秒，全段动作同比缩放。 */ durationSeconds:number;
 /** 标题最多23字宽。 */ title:string;
 /** 七个日期标题，每项最多4字宽。 */ days:string[];
 /** 三至七项，日期不可重复；slot 0–2控制纵向时间段。 */ tasks:{label:string;time:string;day:number;slot:number;color:string}[];
 /** 选中的tasks索引。 */ selected:number;
 /** 二至四个渠道。 */ channels:{name:string;short:string;color:string}[];
 /** 完成提示最多12字宽。 */ complete:string;
};
export function validateProps(p:Props){number(p.durationSeconds,6,20,'durationSeconds');text(p.title,23,'title');text(p.complete,12,'complete');count(p.days,7,7,'days');p.days.forEach(x=>text(x,4,'日期'));count(p.tasks,3,7,'tasks');number(p.selected,0,p.tasks.length-1,'selected');if(!Number.isInteger(p.selected))throw new Error('selected必须是整数');const days=new Set<number>();p.tasks.forEach((x,i)=>{text(x.label,i===p.selected?10:7,'任务');text(x.time,5,'时间');number(x.day,0,6,'day');number(x.slot,0,2,'slot');if(!Number.isInteger(x.day)||!Number.isInteger(x.slot)||days.has(x.day))throw new Error('日期和slot必须为整数，每天最多一项');days.add(x.day);hex(x.color,'color')});count(p.channels,2,4,'channels');p.channels.forEach(x=>{text(x.name,7,'渠道');text(x.short,2,'渠道简称');hex(x.color,'渠道颜色')});return p}
export const Template:React.FC<Props>=(props)=>{
 const p=validateProps(props);const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps*7.5/p.durationSeconds;const sx=145+p.tasks[p.selected].day*159;const sy=358+p.tasks[p.selected].slot*142;const originX=sx+134;const originY=sy+155;
 return <Canvas color="#f6f7fc" style={{color:'#17192e'}}>
  <Box x={100} y={85+(1-prog(t,0,.5))*30} w={1720} style={{fontSize:72,fontWeight:900,letterSpacing:-3,lineHeight:1.3,opacity:prog(t,0,.5)}}>{p.title}</Box>
  <Box x={100} y={270} w={1195} h={700} style={{background:'#fff',borderRadius:35,boxShadow:'0 12px 0 #d4d5db',opacity:prog(t,.15,.55)}}>
   {p.days.map((d,i)=><Box key={i} x={30+i*159} y={20} w={147} h={651} style={{textAlign:'center',fontWeight:700,fontSize:27,color:i===p.tasks[p.selected].day?'#2784e8':'#707083'}}><div style={{height:57}}>{d}</div><div style={{height:580,background:i===p.tasks[p.selected].day?'#e9f1ff':'#f7f7fb',borderRadius:16}}/></Box>)}
  </Box>
  {p.tasks.map((v,i)=>{const a=prog(t,.6+i*.18,.7);const sel=i===p.selected;const x=145+v.day*159;const y=358+v.slot*142;return <Box key={i} x={x} y={y-(1-a)*400} w={134} h={sel?255:148} style={{zIndex:1,background:sel?'#fff':v.color,border:sel?'4px solid #2b84e8':undefined,borderRadius:18,boxShadow:sel?'0 7px 0 #1d68b8':'0 7px 0 #0000001c',color:sel?'#1e2134':v.color==='#ffce00'?'#191b29':'white',boxSizing:'border-box',padding:'17px 13px',opacity:a,transform:`rotate(${(1-a)*(i%2?12:-12)}deg)`}}><div style={{fontSize:sel?28:26,fontWeight:750,lineHeight:1.14,overflowWrap:'break-word'}}>{v.label}</div><div style={{position:'absolute',bottom:16,left:13,fontSize:21,fontWeight:500}}>{v.time}</div></Box>})}
  <svg width="1920" height="1080" style={{position:'absolute',left:0,top:0}}>{p.channels.map((c,i)=>{const y=365+i*144;const a=prog(t,3.15+i*.13,.6);const d=`M${originX} ${originY} C${originX+180} ${originY},1335 ${y},1490 ${y}`;const k=clamp(((t-3.6-i*.2)%1.5)/1.5);const x=(1-k)**3*originX+3*(1-k)**2*k*(originX+180)+3*(1-k)*k*k*1335+k**3*1490;const py=(1-k)**3*originY+3*(1-k)**2*k*originY+3*(1-k)*k*k*y+k**3*y;return <g key={i}><path d={d} pathLength={1} stroke="#2c87e9" strokeWidth={5} fill="none" strokeDasharray="1" strokeDashoffset={1-a}/>{t>3.8+i*.15&&<rect x={x-10} y={py-10} width={20} height={20} rx={6} fill="#ffd000"/>}</g>})}</svg>
  {p.channels.map((v,i)=>{const a=prog(t,2.75+i*.15,.65);return <Box key={i} x={1490+(1-a)*60} y={310+i*144} w={320} h={110} style={{background:'#fff',borderRadius:24,boxShadow:'0 9px 0 #d9dae0',display:'flex',alignItems:'center',gap:20,padding:20,boxSizing:'border-box',opacity:a}}><span style={{width:65,height:65,flexShrink:0,borderRadius:17,background:v.color,color:v.color==='#ffce00'?'#14182c':'#fff',fontSize:25,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>{v.short}</span><span style={{fontSize:Math.min(31,180/em(v.name)),fontWeight:800,whiteSpace:'nowrap'}}>{v.name}</span></Box>})}
  <Box x={1475} y={920} w={350} h={63} style={{background:'#ffce00',borderRadius:14,fontSize:Math.min(25,310/(em(p.complete)+1.8)),fontWeight:700,textAlign:'center',lineHeight:'63px',opacity:prog(t,4.8,.6),transform:`translateY(${(1-prog(t,4.8,.6))*15}px)`}}>✓　{p.complete}</Box>
 </Canvas>
};
