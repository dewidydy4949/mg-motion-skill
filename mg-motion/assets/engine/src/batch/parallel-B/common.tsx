import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export const sans='"Noto Sans SC", "Microsoft YaHei", Arial, sans-serif';
export const serif='"Noto Serif SC", "SimSun", Georgia, serif';
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ease=(v:number)=>{const p=clamp(v);return 1-Math.pow(1-p,3)};
export const prog=(t:number,start:number,length:number)=>ease((t-start)/length);
export const em=(s:string)=>Array.from(s).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?(/[MW@%]/.test(c)?.9:.58):1),0);
export function text(s:unknown,max:number,label:string): asserts s is string {if(typeof s!=='string'||!s.trim()||/[\r\n]/.test(s)||em(s)>max)throw new Error(`${label} 必须为非空单行，宽度不超过 ${max} 个中文字`)}
export function number(n:unknown,min:number,max:number,label:string): asserts n is number {if(typeof n!=='number'||!Number.isFinite(n)||n<min||n>max)throw new Error(`${label} 必须在 ${min}–${max} 范围`)}
export function count(a:unknown,min:number,max:number,label:string): asserts a is unknown[] {if(!Array.isArray(a)||a.length<min||a.length>max)throw new Error(`${label} 数量必须在 ${min}–${max}`)}
export function hex(v:unknown,label:string): asserts v is string {if(typeof v!=='string'||!/^#[0-9a-f]{6}$/i.test(v))throw new Error(`${label} 必须是 #RRGGBB 颜色`)}
export function asset(v:unknown){if(v!==undefined&&(typeof v!=='string'||v.startsWith('/')||v.includes('..')||/^[a-z]+:/i.test(v)))throw new Error('image 必须是 public 内的相对路径')}
export const Box=({x,y,w,h,style,children}:{x:number;y:number;w?:number;h?:number;style?:React.CSSProperties;children?:React.ReactNode})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,...style}}>{children}</div>;
export const Canvas=({color,children,style}:{color:string;children:React.ReactNode;style?:React.CSSProperties})=><AbsoluteFill style={{background:color,color:'#171819',fontFamily:sans,overflow:'hidden',...style}}>{children}</AbsoluteFill>;
export const PlateArt=({color='#B3C29A',image}:{color?:string;image?:string})=>image?<Img src={staticFile(image)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<svg width="100%" height="100%" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice"><rect width="500" height="600" fill="#f3e8ce"/><path d="M0 0H500V600H0Z" fill={color} opacity=".25"/><path d="M-50 60L530 400M-50 150L530 490M-50 240L530 580" stroke="#FFFFFF" strokeWidth="45" opacity=".25"/><ellipse cx="274" cy="361" rx="185" ry="184" fill="#9e8960" opacity=".14"/><circle cx="250" cy="340" r="174" fill="#fffaf0"/><circle cx="250" cy="340" r="145" fill="#e7dbc0"/><circle cx="250" cy="340" r="133" fill="#b87c36"/>{Array.from({length:9},(_,i)=>{const a=i*2.4;return <g key={i} transform={`translate(${250+Math.cos(a)*84},${340+Math.sin(a)*80}) rotate(${i*38})`}><ellipse rx="44" ry="19" fill={i%2?'#56734b':'#ebd08d'}/><path d="M-35 0H35" stroke="#8b9e63" strokeWidth="3"/><circle cx="9" cy="3" r="13" fill="#cf633f"/></g>})}<circle cx="403" cy="130" r="64" fill="#fff8e8"/><circle cx="403" cy="130" r="48" fill="#dbac3e"/><path d="M403 85V175M357 130H450M370 98L436 164M370 164L436 98" stroke="#fff3bc" strokeWidth="4"/><path d="M29 65Q130 82 98 163M53 58Q78 105 18 133M34 28Q98 8 121 66" stroke="#637a4f" strokeWidth="14" fill="none"/></svg>;
