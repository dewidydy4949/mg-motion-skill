import React from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';
// Identity and action permissions are deliberately separate states.
const C={bg:'#080d12',ink:'#ecf5f2',muted:'#76918f',line:'#284741',mint:'#7fffd4',amber:'#ffb96f',red:'#ff7c81'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const p=(t:number,a:number,b:number)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x);};
const mix=(a:number,b:number,v:number)=>a+(b-a)*v;
const show=(t:number,a:number,b:number,c:number,d:number)=>p(t,a,b)*(1-p(t,c,d));
const font='"Microsoft YaHei", "Noto Sans SC", sans-serif';
const T=({x,y,children,size=28,fill=C.ink,anchor='start',opacity=1,weight=500,letter=0}:any)=><text x={x} y={y} fill={fill} fontFamily={font} fontSize={size} fontWeight={weight} textAnchor={anchor} opacity={opacity} letterSpacing={letter}>{children}</text>;
const Draw=({d,color=C.mint,width=3,progress=1,opacity=1,...rest}:any)=><path d={d} stroke={color} strokeWidth={width} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} {...rest}/>;
const Eye=({x,y,scale=1,color=C.mint}:any)=><g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"><path d="M-30 0Q0 -35 30 0Q0 35 -30 0Z"/><circle r="9"/></g>;
const Pen=({x,y,scale=1,color=C.amber}:any)=><g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round"><path d="M-19 22l4-18L14-25l14 14L-1 18Z M-15 4L-1 18M10-21L24-7M-19 22l9-2"/></g>;
const Check=({x,y,progress=1,color=C.mint}:any)=><Draw d={`M${x-10} ${y}l8 8l16-20`} color={color} width={4} progress={progress}/>;
function point(q:number,lower:boolean){
 const sign=lower?1:-1,u=clamp(q);
 if(u<.42){const v=u/.42,z=1-v;return {x:z*z*z*480+3*z*z*v*650+3*z*v*v*610+v*v*v*810,y:z*z*z*540+3*z*z*v*540+3*z*v*v*(540+sign*200)+v*v*v*(540+sign*200)};}
 if(u<.68)return {x:mix(810,1030,(u-.42)/.26),y:540+sign*200};
 const v=(u-.68)/.32,z=1-v;return {x:z*z*z*1030+3*z*z*v*1140+3*z*v*v*1140+v*v*v*1200,y:z*z*z*(540+sign*200)+3*z*z*v*(540+sign*200)+3*z*v*v*(540+sign*90)+v*v*v*(540+sign*90)};
}
const routes=['M480 540C650 540 610 340 810 340H1030C1140 340 1140 450 1200 450','M480 540C650 540 610 740 810 740H1030C1140 740 1140 630 1200 630'];
const Supplement:React.FC=()=>{
 const t=useCurrentFrame()/30;
 const build=p(t,0,.9),spread=p(t,1.65,2.65),identity=p(t,3.25,4.15),readOpen=p(t,4.7,5.25),editOpen=p(t,8.85,9.4);
 const read=p(t,5.2,6.6),blocked=p(t,5.45,6.55)*.536,edit=p(t,9.35,10.55);
 const docX=mix(960,1335,spread),docScale=mix(1.13,1,spread),write=p(t,10.25,10.95);
 const badgeOpacity=p(t,2.1,2.65),trace=p(t,2.5,3.25),final=p(t,10.65,11.2);
 const editFail=show(t,6.4,6.65,8.35,8.6),grant=show(t,8.25,8.6,9.3,9.7);
 const readPos=point(read,false),blockPos=point(blocked,true),editPos=point(edit,true);
 return <AbsoluteFill style={{background:C.bg}}><svg width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
   <radialGradient id="ambient"><stop offset="0" stopColor="#254b43" stopOpacity=".46"/><stop offset="1" stopColor={C.bg} stopOpacity="0"/></radialGradient>
   <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1e3935" stopOpacity=".65"/><stop offset="1" stopColor="#0e191d" stopOpacity=".92"/></linearGradient>
   <linearGradient id="scan"><stop stopColor={C.mint} stopOpacity="0"/><stop offset=".7" stopColor={C.mint} stopOpacity=".2"/><stop offset="1" stopColor={C.mint} stopOpacity=".6"/></linearGradient>
   <filter id="glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="8"/></filter>
   <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#5b8073" strokeWidth=".6" opacity=".13"/></pattern>
   <clipPath id="docClip"><path d="M-135-185H65L135-115V185H-135Z"/></clipPath>
  </defs>
  <rect width="1920" height="1080" fill={C.bg}/><ellipse cx="1170" cy="530" rx="950" ry="700" fill="url(#ambient)"/>
  <rect x="120" y="190" width="1680" height="720" fill="url(#grid)" opacity={.6*spread}/>
  {[0,1,2,3].map(i=><g key={i} opacity={.4*spread} transform={`translate(${i%2?1795:125} ${i<2?210:875})`} stroke={C.muted} fill="none"><path d={`M${i%2?-24:24} 0H0V${i<2?24:-24}`}/></g>)}
  <g opacity={p(t,2.35,2.8)}>
   <T x={160} y={123} size={20} fill={C.muted} letter={5}>ACCESS / 权限机制</T>
   <T x={160} y={196} size={54} weight={750} opacity={show(t,2.35,2.8,4.35,4.65)}>先确认：你是谁</T>
   <T x={160} y={196} size={54} weight={750} opacity={show(t,4.55,4.9,8.2,8.5)}>再确认：你能做什么</T>
   <T x={160} y={196} size={54} weight={750} opacity={p(t,8.4,8.8)}>每项操作，分别授权</T>
  </g>
  {/* One file is built once and remains the endpoint for both actions. */}
  <g transform={`translate(${docX} 540) scale(${docScale})`}>
   <g opacity={.45*build} transform={`rotate(${mix(-24,0,p(t,.4,1.6))})`}>
    <circle r="259" fill="none" stroke={C.line} strokeWidth="1"/>
    <circle r="275" fill="none" stroke={C.mint} strokeWidth="1.4" strokeDasharray="15 56"/>
    <path d="M-290 0h28M262 0h28M0-290v28M0 262v28" stroke={C.muted} strokeWidth="2"/>
   </g>
   <g transform="translate(16 17)" opacity={.6*build}><path d="M-135-185H65L135-115V185H-135Z" fill="#091519" stroke={C.line} strokeWidth="2"/></g>
   <path d="M-135-185H65L135-115V185H-135Z" fill="url(#glass)" opacity={build}/>
   <Draw d="M-135 185V-185H65L135-115V185H-135 M65-185V-115H135" progress={build} color={C.ink} width={3}/>
   {[0,1,2,3].map((i)=><Draw key={i} d={`M-87 ${-65+i*48}H${[70,91,45,78][i]}`} color={i===0?C.mint:C.muted} width={i===0?7:4} progress={p(t,.5+i*.1,1.05+i*.1)}/>)}
   <g clipPath="url(#docClip)" opacity={show(t,6.15,6.35,6.85,7.15)}><rect x="-134" y={mix(-185,185,p(t,6.2,6.9))-85} width="268" height="85" fill="url(#scan)"/><path d={`M-134 ${mix(-185,185,p(t,6.2,6.9))}H134`} stroke={C.mint} strokeWidth="3"/></g>
   <Draw d="M-87 134H64" color={C.amber} width={5} progress={write}/>
   <g opacity={show(t,10.1,10.35,10.9,11.3)}><Pen x={mix(-87,64,write)+14} y={117} scale={.53}/></g>
   <T x={0} y={237} size={24} anchor="middle" fill={C.muted} opacity={build}>同一份文件</T>
   <g opacity={p(t,6.65,6.95)*(1-final)}><circle cx="-16" cy="-225" r="4" fill={C.mint}/><T x={0} y={-217} size={18} fill={C.mint}>内容可见</T></g>
  </g>
  {/* Opening icons move into independent permission ports. */}
  <g opacity={p(t,.6,1.1)}><Eye x={mix(605,940,spread)} y={mix(540,270,spread)} scale={mix(1.8,1,spread)}/><Pen x={mix(1315,940,spread)} y={mix(540,835,spread)} scale={mix(1.7,.9,spread)}/></g>
  <T x={960} y={905} size={58} weight={700} anchor="middle" opacity={show(t,.45,1.1,1.8,2.3)}>同一份文件，不同操作</T>
  <T x={605} y={655} size={27} fill={C.mint} anchor="middle" opacity={show(t,.7,1.2,1.7,2.2)}>查看</T><T x={1315} y={655} size={27} fill={C.amber} anchor="middle" opacity={show(t,.7,1.2,1.7,2.2)}>编辑</T>
  <g opacity={badgeOpacity} transform="translate(410 540)">
   <circle r="108" fill="#0a181a" stroke={C.line} strokeWidth="2"/><circle r="92" fill="none" stroke={C.muted} strokeWidth="1.5" strokeDasharray="3 10"/>
   <circle r="108" fill="none" stroke={C.mint} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(t,2.9,4.05)} transform="rotate(-90)"/>
   <g opacity={1-identity}><circle cy="-24" r="24" fill="none" stroke={C.ink} strokeWidth="3"/><path d="M-44 45C-44-6 44-6 44 45" fill="none" stroke={C.ink} strokeWidth="3"/><path d={`M-80 ${mix(-76,76,p(t,2.8,3.65))}H80`} stroke={C.mint} strokeWidth="2" opacity={show(t,2.8,2.9,3.65,3.8)}/></g>
   <g opacity={identity}><Check x={0} y={3} progress={identity}/><T x={0} y={51} size={18} anchor="middle" fill={C.mint}>身份已通过</T></g>
   <T x={0} y={161} size={26} anchor="middle">访问者</T>
   <T x={0} y={205} size={22} anchor="middle" fill={C.muted} opacity={show(t,4.5,4.85,8.5,8.85)}>当前权限：查看</T>
   <T x={0} y={205} size={22} anchor="middle" fill={C.muted} opacity={p(t,8.8,9.2)}>当前权限：查看 + 编辑</T>
  </g>
  {routes.map((d,i)=><g key={i} opacity={spread}><Draw d={d} color={C.line} progress={trace} width={3}/><Draw d={d} color={i===0?C.mint:C.amber} progress={i===0?read:edit} opacity={.6} width={3}/></g>)}
  {/* A gate opens on its own authorization, never solely on identity. */}
  {[{y:340,open:readOpen,color:C.mint},{y:740,open:editOpen,color:C.amber}].map((g,i)=><g key={i} transform={`translate(940 ${g.y})`} opacity={trace}>
   <circle r={40+g.open*9} fill={C.bg} stroke={g.color} strokeWidth="1" opacity=".75"/>
   <g stroke={g.color} strokeWidth="5" fill="none" strokeLinecap="round"><path d={`M${-17-g.open*21} -25V25`}/><path d={`M${17+g.open*21} -25V25`}/><path d="M-17 0H17" opacity={1-g.open}/></g>
   {i===0?<T x={0} y={-96} size={23} anchor="middle" fill={C.mint}>查看</T>:null}
   <T x={0} y={i===0?88:-78} size={24} anchor="middle" fill={g.color} opacity={g.open}>{i===0?'查看放行':'编辑放行'}</T>
  </g>)}
  <g opacity={show(t,5.2,5.35,6.5,6.75)}><circle cx={readPos.x} cy={readPos.y} r="19" fill={C.mint} filter="url(#glow)" opacity=".55"/><circle cx={readPos.x} cy={readPos.y} r="7" fill={C.mint}/></g>
  <g opacity={show(t,5.45,5.65,8.45,8.7)}><circle cx={blockPos.x} cy={blockPos.y} r="7" fill={t>6.5?C.red:C.amber}/><circle cx={blockPos.x} cy={blockPos.y} r={12+8*editFail} fill="none" stroke={C.red} opacity={editFail}/></g>
  <g opacity={editFail}><Draw d="M922 727L948 753M948 727L922 753" color={C.red} width={4}/><T x={940} y={905} size={27} anchor="middle" fill={C.red}>未获编辑权限</T></g>
  <g opacity={grant} transform={`translate(${mix(715,865,p(t,8.25,8.9))} 742)`}><rect x="-87" y="-26" width="174" height="52" rx="26" fill={C.amber}/><T x={0} y={8} size={22} anchor="middle" fill={C.bg} weight={700}>授予编辑</T></g>
  <g opacity={show(t,9.35,9.5,10.5,10.8)}><circle cx={editPos.x} cy={editPos.y} r="20" fill={C.amber} filter="url(#glow)" opacity=".6"/><circle cx={editPos.x} cy={editPos.y} r="7" fill={C.amber}/></g>
  <T x={940} y={905} size={24} anchor="middle" fill={C.amber} opacity={editOpen}>编辑</T>
  <g opacity={final}><T x={160} y={986} size={28} fill={C.muted}>身份确认“你是谁”</T><path d="M492 968V990" stroke={C.line} strokeWidth="2"/><T x={525} y={986} size={28}>权限决定“能做什么”</T></g>
 </svg></AbsoluteFill>;
};
const Root=()=> <Composition id="Supplement" component={Supplement} width={1920} height={1080} fps={30} durationInFrames={360}/>;
registerRoot(Root);
