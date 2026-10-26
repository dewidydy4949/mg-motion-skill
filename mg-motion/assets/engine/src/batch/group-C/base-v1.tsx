import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
export const C={ink:'#202224',paper:'#F5F0E4',blue:'#376CDC',red:'#CA5155',yellow:'#F4D448',cyan:'#8FD7DF',navy:'#080E1C'};
export const FONT='"Noto Sans SC","Microsoft YaHei",sans-serif';
export const HAND='KaiTi,STKaiti,"Noto Serif SC",serif';
export const MONO='Consolas,"Microsoft YaHei",monospace';
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ph=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
export const smooth=(v:number)=>v*v*(3-2*v);
export const ease=(t:number,a:number,b:number)=>smooth(ph(t,a,b));
export const rise=(t:number,a:number)=>1-Math.exp(-8*Math.max(0,t-a))*(1+8*Math.max(0,t-a));
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const hash=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
export const measure=(s:string)=>Array.from(s).reduce((n,c)=>n+(/[^\x00-\x7f]/.test(c)?1:/[MW@]/.test(c)?.95:/[ilI.,: ']/.test(c)?.3:.59),0);
export const typed=(s:string,p:number)=>Array.from(s).slice(0,Math.ceil(Array.from(s).length*clamp(p))).join('');
export const fmt=(v:number)=>Math.round(v).toLocaleString('en-US');
export function txt(v:unknown,name:string,max=24){if(typeof v!=='string'||!v.trim()||/[\r\n]/.test(v)||measure(v)>max)throw new Error(`${name}: 需要非空单行文字，最多${max}中文宽度`)}
export function num(v:unknown,name:string,min:number,max:number){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new Error(`${name}: 应为${min}～${max}的数值`)}
export function arr(v:unknown,name:string,min:number,max:number){if(!Array.isArray(v)||v.length<min||v.length>max)throw new Error(`${name}: 项数必须在${min}～${max}`)}
export function base(p:{duration:number;title:string}){num(p.duration,'duration',3,40);txt(p.title,'title',32)}
export const useT=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig();return f/fps};
export const Svg:React.FC<{children:React.ReactNode;bg?:string}>=({children,bg=C.paper})=><AbsoluteFill style={{background:bg}}><svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{fontFamily:FONT}}>{children}</svg></AbsoluteFill>;
export const T:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;width?:number;fill?:string;weight?:number;anchor?:'start'|'middle'|'end';font?:string;opacity?:number;rotate?:number}>=({x,y,children,size=40,width,fill=C.ink,weight=400,anchor='start',font=FONT,opacity=1,rotate=0})=>{const s=String(children??'');const sz=width?Math.min(size,width/Math.max(1,measure(s))):size;return <text x={x} y={y} fontSize={sz} fill={fill} fontWeight={weight} textAnchor={anchor} fontFamily={font} opacity={opacity} transform={rotate?`rotate(${rotate} ${x} ${y})`:undefined}>{children}</text>};
export const Path:React.FC<{d:string;p?:number;stroke?:string;width?:number;fill?:string;opacity?:number;dash?:string}>=({d,p=1,stroke=C.ink,width=3,fill='none',opacity=1,dash})=><path d={d} pathLength={1} stroke={stroke} strokeWidth={width} fill={fill} opacity={opacity} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash??1} strokeDashoffset={dash?0:1-clamp(p)}/>;
export const sketch=(x:number,y:number,w:number,h:number)=>`M${x+3} ${y+2} Q${x+w*.4} ${y-3} ${x+w} ${y+1} L${x+w-2} ${y+h} Q${x+w*.5} ${y+h-2} ${x} ${y+h+1} Z`;
export const Box:React.FC<{x:number;y:number;w:number;h:number;p?:number;fill?:string;stroke?:string;width?:number}>=({x,y,w,h,p=1,fill='none',stroke=C.ink,width=3})=><g><path d={sketch(x,y,w,h)} fill={fill} opacity={ph(p,0,.3)}/><Path d={sketch(x,y,w,h)} p={p} stroke={stroke} width={width}/><Path d={sketch(x+.7,y-.4,w,h)} p={p} stroke={stroke} width={.7} opacity={.35}/></g>;
export const Paper:React.FC<{color?:string;grid?:boolean}>=({color=C.paper,grid=false})=><><defs><filter id="c-paper"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" seed="23"/><feColorMatrix type="saturate" values="0"/></filter><pattern id="c-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#9CAFB6" strokeWidth=".8" opacity=".2"/></pattern></defs><rect width="1920" height="1080" fill={color}/><rect width="1920" height="1080" filter="url(#c-paper)" opacity=".055"/>{grid&&<rect width="1920" height="1080" fill="url(#c-grid)"/>}</>;
export const Arrow:React.FC<{d:string;end:[number,number];p:number;stroke?:string;angle?:number}>=({d,end,p,stroke=C.ink,angle=90})=><g><Path d={d} p={p} stroke={stroke} width={3}/><g transform={`translate(${end[0]},${end[1]}) rotate(${angle})`} opacity={ph(p,.8,1)}><path d="M-14 -7L0 0L-14 7" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round"/></g></g>;
export const Tick:React.FC<{x:number;y:number;p:number;color?:string}>=({x,y,p,color=C.blue})=><Path d={`M${x-10} ${y}l8 9 18 -23`} p={p} stroke={color} width={4}/>;
export const Tape:React.FC<{x:number;y:number;w:number;color?:string;rotate?:number}>=({x,y,w,color=C.yellow,rotate=-4})=><path d={`M${x} ${y}l9 -3 8 4 8 -3 ${w-44} 1 10 -2 8 3 -3 31 -8 3 -9 -3 -8 2 ${-w+44} -1 -10 2 -8 -3Z`} fill={color} opacity=".9" transform={`rotate(${rotate} ${x+w/2} ${y+15})`}/>;
export const Footer:React.FC<{text:string;dark?:boolean}>=({text,dark=false})=><T x={105} y={1018} size={24} fill={dark?'#6D8094':'#8A887E'}>{text}</T>;
