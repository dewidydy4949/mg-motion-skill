// 参考 303 的 220–238 秒：先画层级线，再逐层画分支，最后写叶节点解释。
import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {HAND,Paper,Pen,SvgText,clamp,prog,text,duration,array,fit} from '../parallel-C/common';
export type Props={
  /** 镜头总秒数，12–26。 */ durationSeconds:number;
  /** 白板标题，最多24中文字宽。 */ title:string;
  /** 三层的标记，从根到叶，最多3中文字宽。 */ levels:string[];
  /** 树下的三行说明，每行最多24字宽。 */ summary:string[];
  /** 叶节点标签：不显示用空数组，否则必须8个，每项最多2字宽。 */ leaves:string[];
  /** 可选右侧补充说明，最多3条，每条20字宽。 */ notes:string[];
  /** 底部来源或场景注释，最多54字宽。 */ footnote:string;
};
export function validateProps(p:Props):Props{if(!p)throw Error('缺少参数');duration(p.durationSeconds,12,26);text(p.title,24,'title');array(p.levels,3,3,'levels');p.levels.forEach((x,i)=>text(x,3,`levels[${i}]`));array(p.summary,1,3,'summary');p.summary.forEach((x,i)=>text(x,24,`summary[${i}]`));array(p.leaves,0,8,'leaves');if(p.leaves.length!==0&&p.leaves.length!==8)throw Error('leaves 须为空或8项');p.leaves.forEach((x,i)=>text(x,2,`leaves[${i}]`));array(p.notes,0,3,'notes');p.notes.forEach((x,i)=>text(x,20,`notes[${i}]`));text(p.footnote,54,'footnote');return p;}
const L=[[630,280],[460,445],[800,445],[375,610],[545,610],[715,610],[885,610],[335,770],[415,770],[505,770],[585,770],[675,770],[755,770],[845,770],[925,770]];
const EDGES=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[3,8],[4,9],[4,10],[5,11],[5,12],[6,13],[6,14]];
export const Template:React.FC<Props>=(raw)=>{const p=validateProps(raw);const f=useCurrentFrame(),{fps}=useVideoConfig();const t=f/fps*18/p.durationSeconds;const drawStart=4.3,per=.24;const active=Math.floor((t-drawStart)/per);const segment=EDGES[Math.max(0,Math.min(13,active))];const ap=L[segment[0]],bp=L[segment[1]];const q=prog(t,drawStart+Math.max(0,active)*per,per);return <AbsoluteFill><svg viewBox="0 0 1920 1080" width="100%" height="100%"><Paper color="#303b42"/><rect x="144" y="33" width="1635" height="942" fill="#899498"/><rect x="120" y="15" width="1660" height="940" fill="#c6ced0"/><rect x="132" y="28" width="1636" height="915" fill="#fdfefa"/><path d="M155 45L1745 45" stroke="#fff" strokeWidth="8"/>
<g opacity={prog(t,0,.4)}><SvgText x={225} y={140} value={p.title} size={66} hand maxWidth={1430}/><path d="M218 161 Q700 169 1300 161" fill="none" stroke="#292c2d" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-prog(t,.6,.6)}/></g>
{[280,445,610].map((y,i)=><g key={i}><path d={`M265 ${y} Q650 ${y-2} 1045 ${y+1}`} fill="none" stroke="#a7aba6" strokeWidth="2" strokeDasharray="13 15" opacity={prog(t,1+i*.7,.5)}/><g opacity={prog(t,3.3+i*.25,.25)}><SvgText x={230} y={y+10} value={p.levels[i]} size={34} color={['#37678c','#3a8266','#b44a63'][i]} hand anchor="end" maxWidth={95}/></g></g>)}
{EDGES.map(([a,b],i)=>{const u=L[a],v=L[b];return <path key={i} d={`M${u[0]} ${u[1]} Q${(u[0]+v[0])/2+(i%2?3:-3)} ${(u[1]+v[1])/2} ${v[0]} ${v[1]}`} stroke="#252c2d" strokeWidth="3.7" strokeLinecap="round" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-prog(t,drawStart+i*per,per)}/>})}
{L.slice(7).map(([x,y],i)=><g key={i} opacity={prog(t,7.7+i*.08,.15)}><circle cx={x} cy={y} r="10" fill="#252c2d"/>{p.leaves.length>0&&<SvgText x={x} y={y+39} value={p.leaves[i]} size={26} anchor="middle" hand/>}</g>)}
{p.summary.map((s,i)=><g opacity={prog(t,8.8+i*.7,.4)} key={i}><SvgText x={630} y={852+i*35} value={s} size={30} anchor="middle" hand color={i===2?'#43876a':'#252c2d'} maxWidth={840}/></g>)}
{p.notes.map((s,i)=><g opacity={prog(t,9.4+i*.8,.4)} key={i}><path d={`M1150 ${340+i*130} l25 0`} stroke={['#37678c','#3a8266','#b44a63'][i]} strokeWidth="4"/><SvgText x={1195} y={350+i*130} value={s} size={34} hand maxWidth={480}/></g>)}
{active>=0&&active<14&&<Pen x={ap[0]+(bp[0]-ap[0])*q} y={ap[1]+(bp[1]-ap[1])*q}/>}
<SvgText x={960} y={1020} value={p.footnote} size={27} color="#f1f1ea" weight={400} anchor="middle" maxWidth={1660}/></svg></AbsoluteFill>};
