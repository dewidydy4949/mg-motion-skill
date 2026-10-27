import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
const C={paper:'#f5efd9',blue:'#293bc9',pink:'#ee77a6',yellow:'#f8cc37',ink:'#172986'};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(t:number,a:number,b:number)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p)};
const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
const pulse=(t:number,a:number,b:number)=>Math.sin(clamp((t-a)/(b-a))*Math.PI);
const window=(t:number,a:number,b:number)=>ease(t,a,a+.25)*(1-ease(t,b-.25,b));
const font='"Microsoft YaHei", "Noto Sans SC", sans-serif';
const T=({x,y,size=36,color=C.ink,weight=800,anchor='start',children,...rest}:any)=><text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor} fontFamily={font} {...rest}>{children}</text>;
function Packet({x,y,version=1,scale=1,rotation=0,opacity=1}:any){return <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}>
 <path d="M-74-72H45L74-43V72H-74Z" fill={version===1?C.pink:C.yellow}/><path d="M45-72V-43H74" fill="none" stroke={C.ink} strokeWidth="5"/>
 <path d="M-48-35H10M-48-12H36" stroke={C.ink} strokeWidth="6"/><T x={0} y={43} size={45} anchor="middle">v{version}</T>
</g>}
const Caption=({t,start,end,line1,line2}:any)=>{const incoming=ease(t,start,start+.48),out=end?ease(t,end-.35,end):0;return <g opacity={incoming*(1-out)} transform={`translate(0 ${32*(1-incoming)-25*out})`}>
 <T x={115} y={166} size={108}>{line1}</T><T x={115} y={292} size={108}>{line2}</T>
</g>};
export const Scene=()=>{
 const t=useCurrentFrame()/30;
 const establish=ease(t,0,.7),seed=ease(t,1.5,3.7),stored=ease(t,3.55,3.9),fetch=ease(t,5.15,6.0),renew=ease(t,8.15,9.75),updated=ease(t,9.72,9.9);
 const sx=335,sy=665,cx=1160,cy=665,ux=1640;
 const travel=(p:number,from:number,to:number,arch:number)=>({x:lerp(from,to,p),y:cy-Math.sin(p*Math.PI)*arch});
 const a=travel(seed,sx,cx,230),c=travel(renew,sx,cx,230);
 const version=t>=7.65?2:1;
 return <AbsoluteFill style={{background:C.paper,overflow:'hidden'}}><svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs>
  <pattern id="grain" width="53" height="59" patternUnits="userSpaceOnUse">{Array.from({length:12},(_,i)=><circle key={i} cx={(i*23+5)%53} cy={(i*17+9)%59} r={i%3===0?1:.6} fill={C.ink} opacity=".12"/>)}</pattern>
  <pattern id="stripe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><path d="M0 0V16" stroke={C.blue} strokeWidth="7"/></pattern>
  <clipPath id="clip-title"><rect x="90" y="45" width="1650" height="290"/></clipPath>
 </defs>
 <rect width="1920" height="1080" fill="url(#grain)"/>
 <circle cx="1890" cy="-15" r="255" fill={C.pink}/><circle cx="1890" cy="-15" r="190" fill={C.paper}/>
 <g clipPath="url(#clip-title)">
  <Caption t={t} start={0} end={4.35} line1="常用的内容，" line2="留一份在手边。"/>
  <Caption t={t} start={4.3} end={7.2} line1="下次需要，" line2="就近取用。"/>
  <Caption t={t} start={7.15} end={10.05} line1="发现版本变了，" line2="更新这份副本。"/>
  <Caption t={t} start={10} line1="副本已更新，" line2="继续留在手边。"/>
 </g>
 <g opacity={establish} transform={`translate(0 ${45*(1-establish)})`}>
  <path d="M110 935H1810" stroke={C.ink} strokeWidth="3"/>
  <path d="M160 825V600a175 175 0 0 1 350 0v225Z" fill="url(#stripe)"/>
  <path d="M174 825V603a161 161 0 0 1 322 0v222Z" fill={C.blue} opacity=".12"/>
  <path d="M138 830H532" stroke={C.ink} strokeWidth="12"/>
  <Packet x={sx} y={sy} version={version} rotation={-7}/>
  <T x={sx} y={904} size={39} anchor="middle">原始内容</T>
  <path d={`M${cx-175} ${cy+38}H${cx+127}L${cx+175} ${cy+83}H${cx-127}Z`} fill="#ffe898" stroke={C.ink} strokeWidth="5"/>
  <path d={`M${cx-175} ${cy+38}V${cy+125}L${cx-127} ${cy+170}V${cy+83}Z`} fill={C.yellow} stroke={C.ink} strokeWidth="5"/>
  <path d={`M${cx-127} ${cy+83}H${cx+175}V${cy+170}H${cx-127}Z`} fill={C.yellow} stroke={C.ink} strokeWidth="5"/>
  <path d={`M${cx-38} ${cy+112}H${cx+62}`} stroke={C.ink} strokeWidth="8" strokeLinecap="round"/>
  <T x={cx} y={904} size={39} anchor="middle">手边的缓存</T>
  <circle cx={ux} cy={cy+12} r="157" fill={C.pink}/>
  <path d={`M${ux-89} ${cy+60}q30-21 53-24v-79q0-20 17-20t17 20v54l14-58q5-19 22-13t12 25l-11 55 17-39q8-17 23-9t8 25l-23 62q-17 52-66 52h-47z`} fill={C.paper} stroke={C.ink} strokeWidth="6" strokeLinejoin="round"/>
  <T x={ux} y={904} size={39} anchor="middle">现在要用</T>
  <path d={`M${sx+90} ${cy-80}C650 305 940 305 ${cx-45} ${cy-90}`} fill="none" stroke={C.blue} strokeWidth="5" strokeDasharray="7 15" opacity={.28*ease(t,.6,1.3)}/>
  <path d={`M${cx+80} ${cy-80}Q1400 440 ${ux-25} ${cy-90}`} fill="none" stroke={C.blue} strokeWidth="6" opacity={.25*ease(t,4.4,4.9)}/>
 </g>
 <Packet x={a.x} y={a.y} scale={.92} rotation={lerp(-7,0,seed)} opacity={window(t,1.4,3.88)} version={1}/>
 <Packet x={cx} y={cy-15} scale={.92} opacity={stored*(1-ease(t,9.25,9.45))} version={1}/>
 {[.16,.08,0].map((lag,i)=>{const p=clamp(fetch-lag),pt=travel(p,cx,ux,110);return <Packet key={i} x={pt.x} y={pt.y-15} scale={.92} rotation={Math.sin(p*Math.PI)*10} opacity={window(t,5.1,6.17)*(i===2?1:.12)} version={1}/>})}
 <g opacity={window(t,6,7.3)}><path d="M1520 462l25 24 45-55" fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round"/><T x="1490" y="398" size="41">直接取用</T></g>
 <g opacity={window(t,7.35,9.9)} transform={`translate(${sx} 408) rotate(-6)`}><rect x="-115" y="-45" width="230" height="67" fill={C.yellow}/><T x="0" y="4" anchor="middle" size="34">发现新版本</T></g>
 <Packet x={c.x} y={c.y} scale={.92} rotation={lerp(-7,0,renew)} opacity={window(t,8.08,9.96)} version={2}/>
 <g opacity={pulse(t,9.25,10)}><path d={`M${cx+87} ${cy+45}q100 22 170 95`} stroke={C.pink} strokeWidth="7" fill="none"/><path d={`M${cx+240} ${cy+127}l17 13-4-24`} stroke={C.pink} strokeWidth="7" fill="none"/></g>
 <Packet x={cx+190*ease(t,9.25,9.85)} y={cy-15+150*ease(t,9.25,9.85)} scale={.92*(1-.35*ease(t,9.25,9.85))} rotation={25*ease(t,9.25,9.85)} opacity={window(t,9.25,9.96)} version={1}/>
 <Packet x={cx} y={cy-15} scale={.92} opacity={updated} version={2}/>
 <g opacity={ease(t,10.1,10.5)}><path d={`M${cx+80} ${cy-80}Q1400 440 ${ux-25} ${cy-90}`} fill="none" stroke={C.blue} strokeWidth="7" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ease(t,10.1,10.8)}/><path d="M1597 554l18 22-30-2" fill="none" stroke={C.blue} strokeWidth="7"/></g>
 <g opacity={ease(t,10.5,10.95)}><T x="1400" y="466" size="34" anchor="middle">下一次，也从这里取</T></g>
 <T x="114" y="1006" size="27" weight="500">缓存：保留副本，按需复用。</T><T x="1805" y="1006" size="27" weight="500" anchor="end">概念示意</T>
 </svg></AbsoluteFill>
};
