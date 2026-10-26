import React from 'react';
import {interpolate,spring} from 'remotion';
export const font='"Noto Sans SC","Microsoft YaHei",Arial,sans-serif';
export const serif='"Noto Serif SC","SimSun",Georgia,serif';
export const clamp=(x:number)=>Math.min(1,Math.max(0,x));
export const ease=(x:number)=>1-Math.pow(1-clamp(x),3);
export const widthUnits=(s:string)=>Array.from(s).reduce((n,c)=>n+(/^[\x00-\x7F]$/.test(c)?(/^[MW@#%]$/.test(c)?.9:.57):1),0);
export const text=(value:unknown,name:string,max:number)=>{if(typeof value!=='string'||!value.trim()||/[\r\n]/.test(value)||widthUnits(value)>max)throw new Error(`${name}须为非空单行且不超过${max}中文字宽`);};
export const number=(v:unknown,n:string,min:number,max:number)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new Error(`${n}应为${min}至${max}之间数字`);};
export const array=(v:unknown,n:string,min:number,max:number)=>{if(!Array.isArray(v)||v.length<min||v.length>max)throw new Error(`${n}须${min}至${max}项`);};
export const color=(v:unknown,n:string)=>{if(typeof v!=='string'||!/^#[0-9a-f]{6}$/i.test(v))throw new Error(`${n}须为六位十六进制颜色`);};
export const pop=(frame:number,fps:number,start:number)=>spring({frame:frame-start*fps,fps,config:{damping:17,stiffness:160}});
export const fade=(t:number,start:number,d=.35)=>clamp((t-start)/d);
export const sized=(s:string,max:number,w:number,min=26)=>Math.max(min,Math.min(max,w/Math.max(1,widthUnits(s))));
export function Mark({kind,size=120,color:ink='#391322'}:{kind:number;size?:number;color?:string}){const k=((kind%8)+8)%8;return <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">{k===0?<><circle cx="60" cy="60" r="42"/><path d="m60 20 16 27-16 16-26-12M60 63l9 31m-35-43-13 23m55-27 24 19"/></>:k===1?<><path fill="#e9c251" d="m24 39 18 16 18-32 18 32 18-16-8 55H32z"/><path d="M32 81h56"/></>:k===2?<><path d="M82 18a46 46 0 1 0 17 75 42 42 0 0 1-17-75z"/></>:k===3?<><path fill="#f6df88" d="m42 17 18 24 18-24 9 12-17 31H50L33 29z"/><circle cx="60" cy="78" r="25" fill="#f6ce48"/><path d="m60 61 5 10 12 2-8 8 2 11-11-6-11 6 2-11-8-8 12-2z"/></>:k===4?<><path fill="#bee3d9" d="m15 98 31-65 18 32 16-21 28 54z"/><path d="m34 59 12-26 14 25-15-7z"/></>:k===5?<><path d="M26 24h68v72H26zM26 46h68M48 24v72M70 24v72M26 72h68"/></>:k===6?<><path d="m60 15 10 31 32-3-26 19 11 31-27-18-27 18 11-31-26-19 32 3z" fill="#fbe0a3"/></>:<><rect x="22" y="32" width="76" height="60" rx="14"/><path d="M60 32V17m-15 42h1m28 0h1M44 74q16 12 32 0"/><circle cx="60" cy="13" r="5"/></>}</svg>}
