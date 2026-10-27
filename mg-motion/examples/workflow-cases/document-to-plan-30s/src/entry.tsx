import React from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame, useVideoConfig} from 'remotion';
type Props={durationSeconds:number; accent:string; background:string};
const C={paper:'#f4f0e4', ink:'#202820', faint:'#b1b7a7', green:'#d3e6a5', amber:'#f6c952', line:'#5d6858'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
const p=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
const lerp=(a:number,b:number,v:number)=>a+(b-a)*v;
const seg=(t:number,a:number,b:number,c:number,d:number)=>p(t,a,b)*(1-p(t,c,d));
const font='"Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
const Text=({x,y,size=30,fill=C.paper,weight=500,children,anchor='start',opacity=1}:any)=><text x={x} y={y} fill={fill} fontSize={size} fontWeight={weight} textAnchor={anchor} opacity={opacity} fontFamily={font}>{children}</text>;
const Check=({x,y,scale=1,color=C.ink,progress=1}:any)=><path d={`M ${x} ${y+12*scale} l ${10*scale} ${10*scale} l ${22*scale} ${-28*scale}`} fill="none" stroke={color} strokeWidth={5*scale} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress}/>;
const Arrow=({x1,y1,x2,y2,color=C.faint,opacity=1}:any)=><g opacity={opacity}><path d={`M${x1} ${y1} H${x2-20}`} fill="none" stroke={color} strokeWidth="3"/><path d={`M${x2-32} ${y2-12} L${x2-18} ${y2} L${x2-32} ${y2+12}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g>;
const Paper=({x,y,s=1,rotation=0,id='A',opacity=1,highlight=0}:any)=><g transform={`translate(${x},${y}) scale(${s}) rotate(${rotation})`} opacity={opacity}>
  <path d="M12 16H290V348H12Z" fill="#000" opacity=".22"/><path d="M0 0H234L278 44V332H0Z" fill={C.paper}/><path d="M234 0V44H278" fill="#d6d9cb"/>
  <Text x={26} y={65} size={34} fill={C.ink} weight={800}>资料 {id}</Text>
  {[0,1,2,3,4].map(i=><rect key={i} x="26" y={105+i*35} width={i%2?174:220} height="8" rx="2" fill="#bfc4b6"/>)}
  <rect x="17" y="158" width="242" height="38" fill={C.amber} opacity={highlight*.8}/>
  <rect x="26" y="272" width="102" height="33" rx="16" fill={C.ink}/><Text x={77} y={296} anchor="middle" size={19} fill={C.paper} weight={700}>{id} · 原文</Text>
</g>;
const refs=[['A · 01','B · 01'],['C · 01','A · 02'],['B · 02','C · 02']];
const themes=['目标','约束','行动'];
const actions=['明确目标','核对约束','安排行动'];
const snippets=[{code:'A · 01',group:0,row:0},{code:'B · 01',group:0,row:1},{code:'C · 01',group:1,row:0},{code:'A · 02',group:1,row:1},{code:'B · 02',group:2,row:0},{code:'C · 02',group:2,row:1}];
const Chip=({x,y,label,amber=false,opacity=1}:any)=><g opacity={opacity}><rect x={x} y={y} width="116" height="36" rx="18" fill={amber?C.amber:'#dce3cf'}/><Text x={x+58} y={y+25} anchor="middle" size={21} weight={700} fill={C.ink}>{label}</Text></g>;
const Snippet=({x,y,code,width=300,opacity=1,scale=1}:any)=><g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
  <rect x="7" y="8" width={width} height="130" fill="#000" opacity=".18"/><rect width={width} height="130" rx="4" fill={C.paper}/><rect x="0" y="0" width="6" height="130" fill={C.green}/><Text x="24" y="43" size={26} fill={C.ink} weight={700}>关键信息</Text>
  <rect x="24" y="62" width={width-48} height="5" fill="#c5cbbb"/><Chip x={24} y={81} label={code}/>
</g>;
const Todo=({x,y,width=850,index=0,opacity=1,uncertain=false,confirmed=false,scale=1,draw=0}:any)=><g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
 <rect x="9" y="10" width={width} height="142" fill="#000" opacity=".18"/><rect width={width} height="142" rx="9" fill={C.paper}/><rect x="0" y="0" width="8" height="142" rx="3" fill={uncertain?C.amber:C.green}/>
 <rect x="28" y="37" width="46" height="46" rx="5" fill='none' stroke={C.ink} strokeWidth="3"/>
 <Text x="96" y="61" size={34} weight={800} fill={C.ink}>{actions[index]}</Text><Text x="96" y="106" size={23} fill="#68715f">{confirmed?'已确认 · 待执行':'待办 '+(index+1)}</Text>
 {refs[index].map((r,i)=><Chip key={r} x={width-280+i*126} y={69} label={r} amber={uncertain&&i===1}/>)}
 {uncertain&&<g><rect x={width-190} y="-20" width="174" height="47" rx="23" fill={C.amber}/><Text x={width-103} y="12" size={26} weight={800} fill={C.ink} anchor="middle">? 待确认</Text></g>}
</g>;
const headings=[
 {a:0,b:3.0,main:'从资料，到可执行的计划',small:'让信息一步步变成行动'},
 {a:3.0,b:7.5,main:'先提取关键信息',small:'保留每条信息的来源'},
 {a:7.5,b:11.7,main:'再按主题归类',small:'把相关的信息放在一起'},
 {a:11.7,b:15.5,main:'把结论变成待办',small:'形成可以继续推进的行动'},
 {a:15.5,b:20.2,main:'每个待办，都能回到原始依据',small:'从行动，追溯到资料中的对应位置'},
 {a:20.2,b:23.8,main:'不确定的信息，先标出来',small:'需要核实的地方，保持可见'},
 {a:23.8,b:30.2,main:'由人确认后，再开始执行',small:'依据留得住，判断交给人'}
];
const Supplement:React.FC<Props>=({durationSeconds,accent,background})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps*30/durationSeconds;
 const extract=p(t,2.65,3.65), grouping=p(t,7.2,8.45), making=p(t,11.25,12.65), trace=p(t,15.25,16.35), untrace=p(t,19.7,20.6), confirmLayout=p(t,23.5,24.65), execute=p(t,26.7,27.8);
 const confirmed=t>=26.1;const sourceOpacity=1-p(t,22.9,24.0);
 return <AbsoluteFill style={{background,color:C.paper,fontFamily:font}}><svg width="1920" height="1080" viewBox="0 0 1920 1080">
 <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#dbe2c9" opacity=".055"/></pattern><linearGradient id="vignette"><stop stopColor="#3e4737" stopOpacity=".2"/><stop offset="1" stopColor="#0e150f" stopOpacity=".05"/></linearGradient></defs>
 <rect width="1920" height="1080" fill="url(#vignette)"/><rect width="1920" height="1080" fill="url(#dots)"/><rect x="100" y="92" width="12" height="80" rx="6" fill={accent}/>
 {headings.map((h,i)=>{const o=i===0?1-p(t,h.b-.25,h.b+.1):seg(t,h.a-.08,h.a+.3,h.b-.25,h.b+.1);return <g key={h.a} opacity={o} transform={`translate(0,${(1-o)*-12})`}><Text x="142" y="152" size={58} weight={800}>{h.main}</Text><Text x="144" y="213" size={27} fill={C.faint}>{h.small}</Text></g>})}
 <path d="M100 920H1820" stroke={C.line} strokeWidth="1"/><Text x="100" y="981" size={21} fill="#8f9a86">流程示意 · 非真实界面</Text><Text x="1820" y="981" size={21} fill="#8f9a86" anchor="end">资料 → 信息 → 待办 → 确认 → 执行</Text>
 {/* Same source papers remain through extraction and trace-back. */}
 {['A','B','C'].map((id,i)=>{const initialX=[340,820,1300][i],initialY=[388,351,406][i];let x=lerp(initialX,130,extract),y=lerp(initialY,310+i*185,extract),s=lerp(1,.45,extract),r=lerp([-7,2,8][i],0,extract);const focus=trace*(1-untrace);x=lerp(x,i===0?150:70,focus);y=lerp(y,i===0?335:315+i*200,focus);s=lerp(s,i===0?1.32:.3,focus);const op=sourceOpacity*(i===0?1:1-focus*.8)*p(t,-.1+i*.17,.6+i*.17);return <Paper key={id} x={x} y={y} s={s} rotation={r} id={id} opacity={op} highlight={i===0?focus:0}/>;})}
 <g opacity={seg(t,1.0,1.7,2.65,3.4)}><Text x="960" y="818" size={33} weight={700} anchor="middle" fill={C.faint}>一堆资料</Text><path d="M620 837 Q960 890 1300 837" stroke={C.line} strokeWidth="2" fill="none"/></g>
 {/* Strips travel from extraction into theme groups, without scoring. */}
 <g opacity={seg(t,3.0,3.6,10.9,11.6)}><path d="M365 340V830" stroke={C.line} strokeWidth="2"/><Text x="362" y="306" size={23} anchor="middle" fill={C.faint}>提取</Text><path d={`M350 ${350+(t-3)*80%440}h30`} stroke={accent} strokeWidth="5" opacity={1-grouping}/></g>
 {themes.map((theme,i)=><g key={theme} opacity={seg(t,7.55+i*.1,8.2+i*.1,11.45,12.1)}><rect x={505+i*430} y="310" width="360" height="510" rx="20" fill="#d4e1af" fillOpacity=".025" stroke={C.line} strokeWidth="2"/><Text x={685+i*430} y="370" size={36} weight={800} anchor="middle">{theme}</Text><path d={`M${535+i*430} 397h300`} stroke={C.line} strokeWidth="2"/></g>)}
 {snippets.map((item,i)=>{const appear=p(t,3.6+i*.35,4.6+i*.35),x0=lerp(250,570+(i%2)*580,appear),y0=380+Math.floor(i/2)*156,gx=535+item.group*430,gy=430+item.row*180;let x=lerp(x0,gx,grouping),y=lerp(y0,gy,grouping);x=lerp(x,760+item.row*110,making);y=lerp(y,346+item.group*180,making);return <Snippet key={item.code} x={x} y={y} code={item.code} opacity={appear*(1-p(t,11.8+item.group*.12,12.4+item.group*.12))} scale={1-making*.12}/>;})}
 {/* Three actions inherit their provenance chips. */}
 {[0,1,2].map(i=>{const focus=trace*(1-untrace),x=lerp(700,180,confirmLayout),y=lerp(330+i*180,365+i*150,confirmLayout),s=lerp(1,.95,confirmLayout),op=p(t,12.0+i*.16,12.75+i*.16)*(i===1?1:1-focus*.66);return <Todo key={i} x={x} y={y} scale={s} index={i} opacity={op} uncertain={i===2&&t>=20.85&&!confirmed} confirmed={confirmed} draw={p(t,26.1+i*.1,26.5+i*.1)}/>;})}
 <g opacity={seg(t,12.75,13.3,15.0,15.6)}><Text x="550" y="581" size={25} fill={C.faint} anchor="middle">结论</Text><Arrow x1={590} y1={570} x2={675} y2={570}/></g>
 {/* Trace backwards from a source chip to the original paper. */}
 <g opacity={trace*(1-untrace)}><path d="M1454 597 C1454 830 560 880 510 570" stroke={accent} fill="none" strokeWidth="4" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p(t,16.5,17.7)}/><circle cx="1454" cy="597" r="18" fill="none" stroke={accent} strokeWidth="3" opacity={p(t,16.1,16.5)}/><path d="M498 595L510 570L532 587" stroke={accent} strokeWidth="4" fill="none" opacity={p(t,17.5,17.8)}/><rect x="710" y="788" width="325" height="60" rx="30" fill={accent} opacity={p(t,17.3,17.8)}/><Text x="872" y="829" size={28} weight={800} fill={C.ink} anchor="middle" opacity={p(t,17.3,17.8)}>追溯到原始依据</Text><Text x="333" y="827" size={25} fill={C.faint} anchor="middle" opacity={p(t,17.7,18.1)}>原文中的对应位置</Text></g>
 <g opacity={seg(t,20.9,21.4,23.45,24.1)}><path d="M1355 741Q1545 710 1556 780Q1550 845 1356 817" stroke={C.amber} strokeWidth="4" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p(t,21.4,22.25)}/><circle cx="485" cy="530" r="92" fill={C.amber}/><Text x="485" y="565" size={110} fill={C.ink} weight={700} anchor="middle">?</Text><Text x="485" y="679" size={29} fill={C.amber} weight={700} anchor="middle">先标记，再核实</Text></g>
 {/* Human approval is an explicit gate before execution. */}
 <g opacity={confirmLayout}><rect x="156" y="306" width="855" height="527" rx="22" fill="none" stroke={confirmed?accent:C.line} strokeWidth="2"/><rect x="195" y="284" width="245" height="45" rx="20" fill={background}/><Text x="218" y="318" size={28} weight={800} fill={confirmed?accent:C.faint}>{confirmed?'已确认的计划':'待确认的计划'}</Text></g>
 <g opacity={confirmLayout*(1-execute)} transform={`translate(${1415},555)`}><circle r="156" fill={C.paper} fillOpacity=".035" stroke={C.line} strokeWidth="2"/><circle cy="-47" r="38" fill="none" stroke={C.paper} strokeWidth="5"/><path d="M-78 80V48C-78-3 78-3 78 48V80" fill="none" stroke={C.paper} strokeWidth="5" strokeLinecap="round"/><Text x="0" y="222" size={38} weight={800} anchor="middle">由人确认</Text><g opacity={p(t,25.7,26.1)}><circle cx="101" cy="-111" r="42" fill={accent}/><Check x={82} y={-115} scale={1.25} progress={p(t,26.0,26.45)}/></g></g>
 <g opacity={seg(t,24.8,25.2,26.7,27.4)}><path d="M1240 555H1050" stroke={confirmed?accent:C.faint} strokeWidth="3"/><path d="M1070 542L1050 555L1070 568" stroke={confirmed?accent:C.faint} strokeWidth="3" fill="none"/><Text x="1147" y="525" size={23} fill={confirmed?accent:C.faint} anchor="middle">{confirmed?'确认':'核实'}</Text></g>
 <g opacity={execute}><path d="M1045 555H1280" stroke={accent} strokeWidth="4" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p(t,27.1,27.8)}/><path d="M1258 541L1280 555L1258 569" stroke={accent} strokeWidth="4" fill="none"/><circle cx="1430" cy="555" r="148" fill={accent}/><path d="M1398 491L1490 555L1398 619Z" fill={C.ink}/><Text x="1430" y="783" size={46} weight={800} anchor="middle">开始执行</Text><Text x="1430" y="840" size={26} fill={C.faint} anchor="middle">保留依据 · 带着确认出发</Text><rect x="1050" y="615" width="215" height="47" rx="23" fill="#d4e1af" fillOpacity=".1"/><Text x="1157" y="647" size={25} fill={accent} weight={700} anchor="middle">确认后放行</Text></g>
 </svg></AbsoluteFill>;
};
const defaults:Props={durationSeconds:30,accent:'#d3e6a5',background:'#242b23'};
const Root=()=> <Composition id="Supplement" component={Supplement} width={1920} height={1080} fps={30} durationInFrames={900} defaultProps={defaults} calculateMetadata={({props})=>({durationInFrames:Math.round(props.durationSeconds*30)})}/>;
registerRoot(Root);

