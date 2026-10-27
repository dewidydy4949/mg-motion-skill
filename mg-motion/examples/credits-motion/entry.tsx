import React from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from 'remotion';

// A directed motion study, not a universal script-to-video template.
const W = 1920, H = 1080, FPS = 30;
const C = {paper: '#f4f0e7', ink: '#191b20', blue: '#3155ec', red: '#e65b3e', quiet: '#74756f', line: '#d5d1c9'};
const clamp = (n:number) => Math.max(0, Math.min(1,n));
const mix = (a:number,b:number,p:number) => a+(b-a)*p;
const smooth = (p:number) => {p=clamp(p);return p*p*(3-2*p);};
const out = (p:number) => 1-Math.pow(1-clamp(p),3);
const ramp = (t:number,a:number,b:number) => smooth((t-a)/(b-a));
const visible = (t:number,a:number,b:number) => out((t-a)/.35)*(1-ramp(t,b-.2,b));
const stages = [0,2.4,5,7.2,10.2,13.2,16.6,20];
const copy = [
  {k:'买积分之前', lines:['单价低，','就划算？'], sub:'先想一想：这份额度，你真的用得完吗？'},
  {k:'先看有效期', lines:['还没用完，','到期了。'], sub:'假设未使用的积分，会在约定日期失效。'},
  {k:'到期这一刻', lines:['剩下的，','不再可用。'], sub:'到期失效，不是慢慢消耗。'},
  {k:'选套餐 / 01 看用量', lines:['你要做','多少内容？'], sub:'先把实际任务列出来，再看需要多少额度。'},
  {k:'02 / 看单价', lines:['同样任务，','再比价格。'], sub:'长度、质量、条件一致，单价才有可比性。'},
  {k:'03 / 看产能', lines:['这份额度，','能做多少？'], sub:'把积分换算成可完成的内容。'},
  {k:'回到真正的需求', lines:['用得完，','才划算。'], sub:'用量  ·  单价  ·  产能'},
];

function Copy({t}:{t:number}) {
  const s=Math.min(6,stages.findIndex((a,i)=>i<7&&t>=a&&t<stages[i+1]));
  const start=stages[s],end=stages[s+1];
  const enter=out((t-start)/.55),leave=s===6?0:ramp(t,end-.22,end);
  if(s>=3&&s<=5)return <g opacity={1-leave} transform={`translate(0 ${-leave*26})`}>
    <text x="116" y="202" fontSize="27" fill={C.blue} fontWeight="600" opacity={enter}>{copy[s].k}</text>
    <g clipPath="url(#wide-title)"><text x="108" y="342" fontSize="108" letterSpacing="-5" fontWeight="900" transform={`translate(0 ${(1-enter)*140})`}>
      <tspan fill={C.ink}>{copy[s].lines[0]}</tspan><tspan fill={C.blue}>{copy[s].lines[1]}</tspan>
    </text></g>
    <text x="116" y="421" fontSize="29" fill={C.quiet} opacity={out((t-start-.3)/.4)}>{copy[s].sub}</text>
  </g>;
  return <g>
    <g opacity={1-leave} transform={`translate(0 ${-leave*26})`}>
      <text x="116" y="270" fontSize="27" fill={C.blue} fontWeight="600" opacity={enter}>{copy[s].k}</text>
      {copy[s].lines.map((line,i)=><g key={i} clipPath={`url(#line-${i})`}>
        <text x="108" y={416+i*152} fontSize={s===0||s===6?138:124} letterSpacing="-7" fontWeight="900" fill={i===1?C.blue:C.ink}
          transform={`translate(0 ${(1-out((t-start-i*.10)/.58))*160})`}>{line}</text>
      </g>)}
      <text x="116" y="689" fontSize="29" fill={C.quiet} opacity={out((t-start-.3)/.4)}>{copy[s].sub}</text>
    </g>
  </g>;
}

type Shape={x:number;y:number;w:number;h:number;rx:number;rotate:number;opacity:number};
function position(stage:number,i:number):Shape{
  const angle=(i/12)*Math.PI*2-Math.PI/2;
  const ring={x:1360+Math.cos(angle)*245,y:520+Math.sin(angle)*245,w:60,h:60,rx:30,rotate:0,opacity:1};
  if(stage===0)return {...ring,rotate:i%2?12:-12};
  if(stage===1)return {...ring,x:1360+Math.cos(angle)*225,y:520+Math.sin(angle)*225,w:48,h:48,rx:24};
  if(stage===2)return {...ring,x:1360+Math.cos(angle)*325,y:520+Math.sin(angle)*325,w:10,h:10,rx:5,opacity:0};
  if(stage===3)return {x:280+(i%6)*270,y:570+Math.floor(i/6)*158,w:188,h:110,rx:9,rotate:0,opacity:1};
  if(stage===4)return {x:480+(i%3)*480,y:620+Math.floor(i/3)*12,w:230,h:150,rx:10,rotate:0,opacity:1};
  if(stage===5)return {x:280+(i%6)*270,y:570+Math.floor(i/6)*158,w:188,h:110,rx:10,rotate:0,opacity:1};
  return {...ring,x:1360+Math.cos(angle)*205,y:520+Math.sin(angle)*205,w:24,h:24,rx:12,rotate:0};
}

function Tokens({t}:{t:number}) {
  const s=Math.min(6,stages.findIndex((a,i)=>i<7&&t>=a&&t<stages[i+1]));
  return <g>{Array.from({length:12},(_,i)=>{
    const prev=position(Math.max(0,s-1),i),next=position(s,i);
    const delay=s===2?0:(i%4)*.035;
    const p=out((t-stages[s]-delay)/.82);
    const intro=out((t-.12-i*.045)/.75);
    let x=mix(prev.x,next.x,p),y=mix(prev.y,next.y,p);
    if(s===0){x=mix(1360,x,intro);y=mix(520,y,intro);}
    const w=mix(prev.w,next.w,p),h=mix(prev.h,next.h,p),rx=mix(prev.rx,next.rx,p);
    const opacity=mix(prev.opacity,next.opacity,p)*intro;
    const active=s===3?Math.floor(clamp((t-7.8)/1.65)*11):s===5?Math.floor(clamp((t-13.75)/1.9)*11):11;
    const filled=!(s===3||s===5)||i<=active;
    const stroke=s===2?C.red:C.blue;
    const isJob=mix(s-1>=3&&s-1<=5?1:0,s>=3&&s<=5?1:0,p);
    const bounce=(s===3||s===5)&&i===active?Math.sin(clamp((t-stages[s])%(.16))/.16*Math.PI)*3:0;
    return <g key={i} opacity={opacity} transform={`translate(${x} ${y-bounce}) rotate(${mix(prev.rotate,next.rotate,p)})`}>
      <rect x={-w/2+5} y={-h/2+7} width={w} height={h} rx={rx} fill={C.ink} opacity={.11*(1-isJob)}/>
      <rect x={-w/2} y={-h/2} width={w} height={h} rx={rx} fill={s===2?C.paper:filled?C.blue:C.paper} stroke={stroke} strokeWidth={filled?0:2.5}/>
      <g opacity={1-isJob} stroke={C.paper} strokeWidth="2.5"><path d={`M ${-w*.13} 0 L ${w*.13} 0 M 0 ${-h*.13} L 0 ${h*.13}`}/></g>
      <g opacity={isJob*(s===4?.5:1)} fill={filled?C.paper:C.blue}>
        <path d="M -10 -15 L 15 0 L -10 15 Z"/>
        <path d={`M ${-w/2+13} ${h/2-11} H ${w/2-13}`} stroke={filled?C.paper:C.blue} strokeWidth="2" opacity=".45"/>
      </g>
    </g>;
  })}</g>;
}

function Diagram({t}:{t:number}) {
  const opening=visible(t,.6,2.4);
  const balance=visible(t,2.4,7.2);
  const atExpiry=t>=5;
  const unit=visible(t,10.5,13.2);
  const finish=out((t-16.8)/.65);
  const sweep=ramp(t,2.6,5);
  return <g>
    <g opacity={opening}>
      <text x="1360" y="515" textAnchor="middle" fontSize="82" fontWeight="800" fill={C.ink}>积分</text>
      <text x="1360" y="568" textAnchor="middle" fontSize="26" fill={C.quiet}>越多，就越值？</text>
    </g>
    <g opacity={balance}>
      <circle cx="1360" cy="520" r="308" stroke={C.line} strokeWidth="2" fill="none"/>
      <circle cx="1360" cy="520" r="308" stroke={atExpiry?C.red:C.blue} strokeWidth="5" fill="none" strokeLinecap="round"
        strokeDasharray={`${2*Math.PI*308*sweep} 2000`} transform="rotate(-90 1360 520)"/>
      <circle cx="1360" cy="212" r="8" fill={atExpiry?C.red:C.blue}/>
      <text x="1360" y="180" textAnchor="middle" fontSize="26" fill={atExpiry?C.red:C.quiet}>{atExpiry?'已到期':'约定到期日'}</text>
      <text x="1360" y="550" textAnchor="middle" fontSize={atExpiry?212:158} letterSpacing="-10" fontWeight="900" fill={atExpiry?C.red:C.ink}>{atExpiry?'0':'120'}</text>
      <text x="1360" y="611" textAnchor="middle" fontSize="26" fill={C.quiet}>{atExpiry?'可用积分':'剩余积分 · 示意'}</text>
      {atExpiry&&<circle cx="1360" cy="520" r={220+(t-5)*90} stroke={C.red} strokeWidth="2" fill="none" opacity={1-ramp(t,5,5.7)}/>}
    </g>
    <g opacity={visible(t,7.7,10.2)}>
      <text x="1760" y="484" fontSize="25" fill={C.quiet} textAnchor="end">把任务排出来</text>
      <path d="M 186 850 H 1724" stroke={C.line} strokeWidth="2"/>
      <path d={`M 186 850 H ${186+1538*ramp(t,7.8,9.5)}`} stroke={C.blue} strokeWidth="5"/>
    </g>
    <g opacity={unit}>
      {[480,960,1440].map((x,i)=><g key={x} transform={`translate(${x} 0)`}>
        <text x="0" y="504" fontSize="25" fill={C.quiet} textAnchor="middle">同一项任务</text>
        <path d="M 0 750 V 780 M -7 773 L 0 780 L 7 773" stroke={C.ink} strokeWidth="2" fill="none"/>
        <text x="0" y="864" textAnchor="middle" fontSize="64" fontWeight="700" fill={C.blue} opacity={out((t-10.8-i*.25)/.45)}>¥ / 次</text>
      </g>)}
      <path d={`M 365 900 H ${mix(365,1555,ramp(t,11.3,12.3))}`} stroke={C.blue} strokeWidth="4"/>
    </g>
    <g opacity={visible(t,13.5,16.6)}>
      <text x="1760" y="484" fontSize="25" fill={C.quiet} textAnchor="end">额度 → 能完成的内容</text>
      <path d="M 186 850 H 1724" stroke={C.line} strokeWidth="2"/>
      <path d={`M 186 850 H ${186+1538*ramp(t,13.8,15.8)}`} stroke={C.blue} strokeWidth="5"/>
      <text x="1724" y="901" textAnchor="end" fontSize="23" fill={C.quiet}>任务示意，不代表实际兑换比例</text>
    </g>
    <g opacity={finish}>
      <circle cx="1360" cy="520" r={mix(175,160,finish)} fill={C.blue}/>
      <path d="M 1280 520 L 1333 570 L 1442 460" pathLength="1" stroke={C.paper} strokeWidth="21" fill="none" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={`${out((t-17.2)/.7)} 1`}/>
      <text x="1360" y="824" fontSize="28" fill={C.blue} textAnchor="middle">适合任务，也适合预算</text>
    </g>
  </g>;
}

const CreditsMotion:React.FC=()=>{
  const t=useCurrentFrame()/FPS;
  return <AbsoluteFill style={{background:C.paper,fontFamily:'"Microsoft YaHei", "Noto Sans SC", sans-serif'}}>
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <defs><clipPath id="line-0"><rect x="90" y="270" width="940" height="167"/></clipPath><clipPath id="line-1"><rect x="90" y="437" width="940" height="157"/></clipPath><clipPath id="wide-title"><rect x="90" y="222" width="1700" height="143"/></clipPath></defs>
      <path d="M 116 112 H 1804" stroke={C.line} strokeWidth="2"/>
      <circle cx="128" cy="76" r="10" fill={C.blue}/>
      <text x="155" y="85" fontSize="25" fill={C.ink} fontWeight="700">积分，怎么选</text>
      <text x="1804" y="85" fontSize="21" fill={C.quiet} textAnchor="end">规则示意</text>
      <Copy t={t}/>
      <Tokens t={t}/>
      <Diagram t={t}/>
      <path d="M 116 949 H 1804" stroke={C.line} strokeWidth="2"/>
      <path d={`M 116 949 H ${116+1688*clamp(t/19.96)}`} stroke={C.blue} strokeWidth="3"/>
      <text x="116" y="1000" fontSize="21" fill={C.quiet}>实际有效期与兑换规则，以所选平台说明为准</text>
      <text x="1804" y="1000" fontSize="21" fill={C.quiet} textAnchor="end">用量 / 单价 / 产能</text>
    </svg>
  </AbsoluteFill>;
};
const Root=()=> <Composition id="Credits-Motion-Study" component={CreditsMotion} durationInFrames={600} fps={FPS} width={W} height={H}/>;
registerRoot(Root);
