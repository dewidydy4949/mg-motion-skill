import React from 'react';
import {interpolate} from 'remotion';
export const FONT='"Microsoft YaHei", "Noto Sans SC", Arial, sans-serif';
export const HAND='KaiTi, STKaiti, "Noto Serif SC", serif';
export const INK='#191b1c';
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ease=(v:number)=>{const n=clamp(v);return 1-Math.pow(1-n,3)};
export const prog=(t:number,start:number,length:number)=>clamp((t-start)/length);
export const em=(s:string)=>Array.from(s).reduce((a,c)=>a+(/[\u0000-\u007f]/.test(c)?(/[MW@%#]/.test(c)?.85:.55):1),0);
export function text(s:unknown,max:number,name:string){if(typeof s!=='string'||!s.trim()||/[\r\n]/.test(s)||em(s)>max)throw new Error(`${name}: 非空单行文字，最多 ${max} 个中文宽度单位`)}
export function duration(n:number,min=5,max=30){if(!Number.isFinite(n)||n<min||n>max)throw new Error(`durationSeconds 必须为 ${min}～${max} 秒`)}
export function array(a:unknown,min:number,max:number,name:string):asserts a is unknown[]{if(!Array.isArray(a)||a.length<min||a.length>max)throw new Error(`${name} 必须有 ${min}～${max} 项`)}
export function numeric(n:number,min:number,max:number,name:string){if(!Number.isFinite(n)||n<min||n>max)throw new Error(`${name} 范围 ${min}～${max}`)}
export const fit=(s:string,width:number,size:number,min=25)=>Math.max(min,Math.min(size,width/Math.max(1,em(s))));
export const Paper:React.FC<{color?:string;grain?:number}>=({color='#f3efdf',grain=.08})=><><rect width="1920" height="1080" fill={color}/><defs><pattern id="paper-dust-c" width="73" height="71" patternUnits="userSpaceOnUse">{Array.from({length:18},(_,i)=><circle key={i} cx={(i*37+11)%73} cy={(i*29+9)%71} r={i%4===0?.8:.45} fill="#64593c" opacity={grain}/>)}</pattern></defs><rect width="1920" height="1080" fill="url(#paper-dust-c)"/></>;
export const Pen:React.FC<{x:number;y:number;color?:string}>=({x,y,color='#202428'})=><g transform={`translate(${x},${y}) rotate(40)`}><path d="M0 0 L-5 -18 L5 -18 Z" fill={color}/><rect x="-5" y="-75" width="10" height="57" rx="2" fill="#eee" stroke="#666" strokeWidth="1.5"/><rect x="-5" y="-89" width="10" height="17" rx="2" fill={color}/><path d="M-1 -70L-1 -22" stroke="#aaa"/></g>;
export const star=(x:number,y:number,r:number)=>Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;const rr=i%2?r*.63:r;return `${x+Math.cos(a)*rr},${y+Math.sin(a)*rr}`}).join(' ');
export const SvgText:React.FC<{x:number;y:number;value:string;size?:number;color?:string;weight?:number;anchor?:'start'|'middle'|'end';hand?:boolean;maxWidth?:number}>=({x,y,value,size=42,color=INK,weight=600,anchor='start',hand=false,maxWidth})=><text x={x} y={y} fill={color} fontFamily={hand?HAND:FONT} fontWeight={weight} fontSize={maxWidth?fit(value,maxWidth,size):size} textAnchor={anchor}>{value}</text>;
