import React from 'react';
import {AbsoluteFill,Composition,Easing,interpolate,registerRoot,useCurrentFrame} from 'remotion';
type Props={sourceLabel:string;questionLabel:string;toolNames:[string,string];finalLabel:string};
const defaults:Props={sourceLabel:'同一段资料',questionLabel:'同一个问题',toolNames:['工具 A','工具 B'],finalLabel:'逐条核对，答案有依据吗？'};
const C={bg:'#080e19',white:'#eef4fb',muted:'#8493a8',gold:'#efbd5d',a:'#70d8c0',b:'#a6b7ff'};
const ease=(t:number,a:number,b:number)=>interpolate(t,[a,b],[0,1],{easing:Easing.bezier(.2,.75,.25,1),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const Supplement:React.FC<Props>=(p)=>{
 const t=useCurrentFrame()/30,entry=ease(t,0,.55),send=ease(t,1.3,2.5),unfold=ease(t,3,3.65),inspect=ease(t,5,5.65),readA=ease(t,6,6.7),readB=ease(t,7.3,8),result=ease(t,8.2,8.75);
 const docX=mix(200,170,inspect),docY=mix(345,330,inspect),docW=mix(680,720,inspect),docH=mix(438,470,inspect);
 const toolX=1230,toolY=[mix(385,325,unfold),mix(610,605,unfold)],sx=docX+docW,sy=docY+228;
 return <AbsoluteFill style={{background:C.bg,color:C.white,fontFamily:'"Microsoft YaHei", "Noto Sans SC", sans-serif',overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 18% 48%,#15334855,transparent 55%),radial-gradient(ellipse at 84% 30%,#2d254a44,transparent 50%)'}}/>
  <AbsoluteFill style={{opacity:.13,backgroundImage:'radial-gradient(#9aabc6 1px,transparent 1px)',backgroundSize:'28px 28px',maskImage:'linear-gradient(transparent,black 40%,transparent)'}}/>
  <div style={{position:'absolute',left:130,right:130,top:78,opacity:entry,transform:`translateY(${(1-entry)*15}px)`}}>
   <div style={{display:'flex',alignItems:'center',gap:16,fontSize:22,letterSpacing:4,color:C.gold}}><span style={{width:30,height:2,background:C.gold}}/>回答对比的方法</div>
   <div style={{fontSize:68,fontWeight:800,marginTop:20,letterSpacing:-2,lineHeight:1.2}}>同一份输入，<span style={{color:C.gold}}>回到原文核对</span></div>
  </div>
  <div style={{position:'absolute',right:180,top:246,display:'flex',alignItems:'center',gap:18,fontSize:22,color:C.muted,opacity:entry}}>
   {['统一输入','分别回答','核对依据'].map((label,i)=>{const active=i===0?t<3:i===1?t>=3&&t<5:t>=5;return <React.Fragment key={label}><span style={{color:active?C.gold:C.muted,fontWeight:active?700:400}}>{label}</span>{i<2&&<span style={{color:'#425066'}}>→</span>}</React.Fragment>})}
  </div>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0,opacity:1-inspect}}>
   {[0,1].map(i=>{const ey=toolY[i]+65,pr=Math.max(0,Math.min(1,(t-1.55)/1.1)),q=1-pr,x=q*q*q*sx+3*q*q*pr*1030+3*q*pr*pr*1050+pr*pr*pr*toolX,y=q*q*q*sy+3*q*q*pr*sy+3*q*pr*pr*ey+pr*pr*pr*ey;return <g key={i}>
    <path d={`M${sx} ${sy} C1030 ${sy} 1050 ${ey} ${toolX} ${ey}`} stroke={i===0?C.a:C.b} strokeWidth="3" fill="none" opacity=".4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-send}/>
    <g opacity={Math.sin(pr*Math.PI)}><circle cx={x} cy={y} r="17" fill={C.gold} opacity=".13"/><rect x={x-10} y={y-13} width="20" height="26" rx="4" fill={C.gold}/><path d={`M${x-5} ${y-3}h10m-10 6h7`} stroke={C.bg} strokeWidth="2"/></g>
   </g>})}
  </svg>
  <div style={{position:'absolute',left:docX,top:docY,width:docW,height:docH,borderRadius:22,background:'linear-gradient(135deg,#182536,#101a29)',border:'1.5px solid #374459',boxShadow:'0 30px 100px #0006',opacity:entry,transform:`translateY(${(1-entry)*35}px)`}}>
   <div style={{height:85,display:'flex',alignItems:'center',padding:'0 32px',gap:16,borderBottom:'1px solid #324156'}}><svg width="36" height="40" viewBox="0 0 36 40"><path d="M5 2h18l8 9v27H5z M23 2v10h8M11 20h14M11 27h11" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round"/></svg><div style={{fontSize:29,fontWeight:700}}>{p.sourceLabel}</div><span style={{marginLeft:'auto',fontSize:17,letterSpacing:2,color:C.muted}}>SOURCE</span></div>
   <div style={{position:'absolute',left:35,right:35,top:116}}>{[0,1,2,3,4,5].map(j=>{const h=j<2?readA:j>=3&&j<5?readB:0,col=j<2?C.a:C.b;return <div key={j} style={{height:41,display:'flex',alignItems:'center',gap:20}}><div style={{width:23,fontSize:17,color:'#5e7089',fontFamily:'Consolas'}}>{String(j+1).padStart(2,'0')}</div><div style={{height:11,width:[.86,.74,.91,.79,.87,.55][j]*(docW-140),borderRadius:6,background:h?col:'#71839c',opacity:mix(.46,.94,h),transform:`scaleX(${ease(t,.42+j*.07,.85+j*.07)})`,transformOrigin:'left'}}/></div>})}</div>
   {[0,1].map(i=>{const a=i===0?readA:readB;return <div key={i} style={{position:'absolute',left:70,right:31,top:i===0?116:239,height:78,border:`2px solid ${i===0?C.a:C.b}`,borderRadius:8,background:i===0?'#70d8c010':'#a6b7ff10',opacity:a*.8,transform:`scale(${.98+.02*a})`}}/>})}
   <div style={{position:'absolute',bottom:25,left:35,fontSize:20,color:C.muted,opacity:inspect}}>定位原文段落 · 逐条查找</div>
  </div>
  <div style={{position:'absolute',left:docX+104,top:docY+docH+25,opacity:(1-inspect)*ease(t,.7,1.2),transform:`translateY(${(1-ease(t,.7,1.2))*18}px)`,display:'flex',alignItems:'center',gap:15,fontSize:28,fontWeight:650,border:`1px solid ${C.gold}66`,borderRadius:40,padding:'18px 30px',background:'#28251d'}}><span style={{display:'grid',placeItems:'center',width:35,height:35,borderRadius:'50%',background:C.gold,color:C.bg,fontFamily:'Arial',fontWeight:800}}>?</span>{p.questionLabel}<span style={{fontSize:21,color:C.gold,marginLeft:12}}>一起发送</span></div>
  {[0,1].map(i=>{const color=i===0?C.a:C.b,appear=ease(t,1.65+i*.12,2.2+i*.12),scan=i===0?readA:readB;return <div key={i} style={{position:'absolute',left:toolX,top:toolY[i],width:510,height:mix(132,215,unfold),borderRadius:22,border:`1.5px solid ${color}66`,background:'linear-gradient(135deg,#172331,#111b2b)',opacity:appear,transform:`translateX(${(1-appear)*35}px)`,boxShadow:'0 20px 60px #0004'}}>
   <div style={{position:'absolute',top:26,left:28,display:'flex',alignItems:'center',gap:19}}><div style={{display:'grid',placeItems:'center',width:69,height:69,borderRadius:18,background:`${color}19`,border:`1px solid ${color}66`,color,fontFamily:'Arial',fontSize:34,fontWeight:700}}>{i===0?'A':'B'}</div><div><div style={{fontSize:32,fontWeight:700}}>{p.toolNames[i]}</div><div style={{fontSize:20,color:C.muted,marginTop:5,opacity:1-unfold}}>相同资料与问题</div></div></div>
   <div style={{position:'absolute',right:30,top:43,fontSize:20,color,opacity:unfold}}>回答 {i===0?'A':'B'}</div>
   <div style={{position:'absolute',left:30,right:30,top:118,opacity:unfold,transform:`translateY(${(1-unfold)*10}px)`}}><div style={{height:13,width:'88%',borderRadius:7,background:color,opacity:mix(.52,.95,scan),transform:`scaleX(${ease(t,3.3+i*.2,3.9+i*.2)})`,transformOrigin:'left'}}/><div style={{height:10,width:i===0?'69%':'76%',borderRadius:6,background:'#5a6e88',marginTop:21,transform:`scaleX(${ease(t,3.55+i*.2,4.2+i*.2)})`,transformOrigin:'left'}}/></div>
   <div style={{position:'absolute',left:22,right:22,top:106,height:39,border:`2px solid ${color}`,borderRadius:8,opacity:scan}}/>
  </div>})}
  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>{[0,1].map(i=>{const a=i===0?readA:readB,color=i===0?C.a:C.b,fromY=toolY[i]+125,toY=docY+(i===0?156:280);return <g key={i} opacity={inspect}><path d={`M${toolX+22} ${fromY} C1100 ${fromY} 1040 ${toY} ${docX+docW-30} ${toY}`} stroke={color} strokeWidth="3" fill="none" opacity=".8" pathLength="1" strokeDasharray="1" strokeDashoffset={1-a}/><circle cx={docX+docW-30} cy={toY} r="8" fill={color} opacity={a}/><circle cx={docX+docW-30} cy={toY} r="18" fill="none" stroke={color} opacity={a*.35}/></g>})}</svg>
  <div style={{position:'absolute',left:939,top:562,width:191,height:56,display:'flex',alignItems:'center',justifyContent:'center',gap:12,borderRadius:28,background:'#17273a',border:'1px solid #314862',fontSize:23,color:C.white,opacity:inspect}}><svg width="28" height="28"><circle cx="11" cy="11" r="7.5" fill="none" stroke={C.gold} strokeWidth="2.5"/><path d="M17 17l7 7" stroke={C.gold} strokeWidth="3" strokeLinecap="round"/></svg>查找出处</div>
  <div style={{position:'absolute',left:130,right:130,bottom:96,borderTop:'1px solid #29384c',paddingTop:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:650,color:C.gold,opacity:result,transform:`translateY(${(1-result)*16}px)`}}>{p.finalLabel}</div>
  <div style={{position:'absolute',left:130,bottom:43,fontSize:17,letterSpacing:2,color:'#61728b'}}>流程示意</div><div style={{position:'absolute',right:130,bottom:43,fontSize:17,letterSpacing:3,color:'#61728b'}}>INPUT → ANSWERS → EVIDENCE</div>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Supplement" component={Supplement} width={1920} height={1080} fps={30} durationInFrames={300} defaultProps={defaults}/>;
registerRoot(Root);
