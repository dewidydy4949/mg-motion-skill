import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
export const FONT='"Noto Sans SC", "Microsoft YaHei", sans-serif';
export const MONO='"Cascadia Code", Consolas, monospace';
export const clamp=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,v));
export const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
export const phase=(t:number,a:number,b:number)=>ease((t-a)/(b-a));
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const time=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();return f/fps};
export function ok(c:unknown,m:string):asserts c {if(!c)throw new Error(m)}
export const str=(v:unknown,key:string,max=40,min=1)=>{ok(typeof v==='string'&&v.length>=min&&v.length<=max,`${key}: 必须为 ${min}–${max} 字符文本`);return v};
export const num=(v:unknown,key:string,min:number,max:number)=>{ok(typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max,`${key}: 必须介于 ${min}–${max}`);return v};
export const arr=(v:unknown,key:string,min:number,max:number)=>{ok(Array.isArray(v)&&v.length>=min&&v.length<=max,`${key}: 必须有 ${min}–${max} 项`);return v};
export const base=(p:{durationSeconds:number;title:string},min=6,max=30)=>{num(p.durationSeconds,'durationSeconds',min,max);str(p.title,'title',24)};
export type Media={src:string;type:'image'|'video';fit?:'cover'|'contain';startFrom?:number};
export function mediaCheck(m?:Media){if(!m)return;str(m.src,'media.src',3000000);ok(m.type==='image'||m.type==='video','media.type: image 或 video');if(m.startFrom!==undefined)num(m.startFrom,'media.startFrom',0,999999)}
export const MediaView:React.FC<{media:Media;style?:React.CSSProperties;offsetSeconds?:number}>=({media,style,offsetSeconds=0})=>{const {fps}=useVideoConfig();const s:React.CSSProperties={width:'100%',height:'100%',objectFit:media.fit||'cover',...style};return media.type==='video'?<Sequence from={Math.round(offsetSeconds*fps)} layout="none"><OffthreadVideo src={media.src} startFrom={media.startFrom||0} muted style={s}/></Sequence>:<Img src={media.src} style={s}/>};
export const Stage:React.FC<{children:React.ReactNode;bg?:string;color?:string}>=({children,bg='#f5f5f3',color='#17191e'})=><AbsoluteFill style={{fontFamily:FONT,background:bg,color,overflow:'hidden'}}>{children}</AbsoluteFill>;
export const Cursor:React.FC<{x:number;y:number;scale?:number;color?:string}>=({x,y,scale=1,color='#151820'})=><svg width={45*scale} height={56*scale} viewBox="0 0 45 56" style={{position:'absolute',left:x,top:y,filter:'drop-shadow(0 3px 3px #0003)'}}><path d="M4 3 L37 30 L23 32 L16 48 Z" fill={color} stroke="white" strokeWidth="3"/></svg>;
export const Chrome:React.FC<{label:string;dark?:boolean}>=({label,dark})=><div style={{height:54,borderBottom:`1px solid ${dark?'#ffffff15':'#dce1e6'}`,display:'flex',alignItems:'center',padding:'0 24px',gap:9,color:dark?'#8f969f':'#85909c',fontSize:17}}>{['#ec806f','#e9c66d','#7abca0'].map(c=><span key={c} style={{width:10,height:10,borderRadius:10,background:c}}/>)}<span style={{marginLeft:22}}>{label}</span></div>;
export const Tag:React.FC<{children:React.ReactNode;color?:string}>=({children,color='#4652dc'})=><span style={{display:'inline-block',fontSize:19,fontWeight:600,letterSpacing:1,color,background:color+'12',padding:'8px 14px',borderRadius:6}}>{children}</span>;
