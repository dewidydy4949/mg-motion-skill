import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Box,Canvas,serif,sans,em,prog,clamp,text,count,number} from '../parallel-B/common';
/** 参考374的28–36秒：正文保持原位，朗读进度依次强调词组。 */
export type Props={
  /** 总时长6–30秒；须覆盖所有词组时间。 */ durationSeconds:number;
  /** 顶部短名称，最多8字宽。 */ label:string;
  /** 主标题，最多16字宽。 */ title:string;
  /** 章节名，最多18字宽。 */ chapter:string;
  /** 显式中文分词及开始时间，2–18词组，总计不超过40字宽。 */ tokens:{text:string;at:number;marked?:boolean}[];
  /** 手机后续正文，最多115字宽。 */ context:string;
  /** 左侧译文或补充解释，最多36字宽。 */ translation:string;
  /** 手机底部操作标签，最多12字宽。 */ action:string;
};
export function validateProps(p:Props){number(p.durationSeconds,6,30,'durationSeconds');text(p.label,8,'label');text(p.title,16,'title');text(p.chapter,18,'chapter');text(p.context,115,'context');text(p.translation,36,'translation');text(p.action,12,'action');count(p.tokens,2,18,'tokens');let last=-1,total=0;p.tokens.forEach(t=>{text(t.text,10,'词组');number(t.at,.8,p.durationSeconds-1.2,'词组时间');if(t.at<=last)throw new Error('词组时间必须严格递增');last=t.at;total+=em(t.text)});if(total>40)throw new Error('主句总长度不得超过40个中文字宽');return p}
export const Template:React.FC<Props>=(props)=>{
  const p=validateProps(props);const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;const progress=clamp(t/(p.durationSeconds-1));
  const active=p.tokens.reduce((n,w,i)=>t>=w.at?i:n,-1);const isDone=active===p.tokens.length-1;
  const words=(size:number)=><span style={{fontSize:size,lineHeight:1.65}}>{p.tokens.map((w,i)=><span key={i} style={{color:i<=active?'#211e1a':'#b4afa2',fontWeight:i<=active?600:400,background:w.marked?'#fad998':undefined,borderRadius:3,padding:w.marked?'3px 3px':undefined,boxDecorationBreak:'clone'}}>{w.text}</span>)}</span>;
  return <Canvas color="#f4eddf" style={{fontFamily:serif,color:'#29241e'}}>
    <Box x={140} y={55} style={{fontSize:40}}>{p.label}</Box>
    <Box x={140} y={132} style={{display:'flex',gap:12,fontFamily:sans}}>{['01 阅读','02 查词','03 朗读','04 讨论'].map((x,i)=><div key={x} style={{fontSize:19,letterSpacing:2,padding:'8px 15px',border:'1px solid #ded6c6',background:i===2?'#29231e':'transparent',color:i===2?'#f4eddf':'#8e877b',borderRadius:3}}>{x}</div>)}</Box>
    <Box x={140} y={245+(1-prog(t,.1,.65))*25} w={935} style={{fontSize:Math.min(82,900/em(p.title)),fontWeight:400,opacity:prog(t,.1,.65),lineHeight:1.25}}>{p.title}</Box>
    <Box x={143} y={425} w={900} style={{fontFamily:sans,fontSize:19,letterSpacing:4,color:'#82796a',opacity:prog(t,.45,.5)}}>{p.chapter}</Box>
    <Box x={140} y={470} w={900} style={{opacity:prog(t,.55,.55)}}>{words(52)}</Box>
    <Box x={143} y={790} w={860} style={{fontSize:28,lineHeight:1.65,fontStyle:'italic',color:'#847d70',opacity:prog(t,Math.max(.8,p.tokens[p.tokens.length-1].at-.5),.6)}}>{p.translation}</Box>
    <Box x={1160} y={70} w={454} h={930} style={{borderRadius:64,background:'#29241e',padding:13,boxSizing:'border-box',boxShadow:'0 26px 28px #4e422e26',transform:`translateY(${(1-prog(t,0,.65))*24}px)`}}>
      <div style={{height:'100%',borderRadius:51,background:'#faf6e9',position:'relative',overflow:'hidden'}}>
        <Box x={28} y={35} w={372} style={{fontFamily:sans,fontSize:17,color:'#9c9487',display:'flex',justifyContent:'space-between'}}><span>{p.chapter}</span><span>☼　×</span></Box>
        <Box x={28} y={94} w={372} style={{fontSize:27,lineHeight:1.65}}>{words(27)}<span style={{color:'#b4afa2'}}>{p.context}</span></Box>
        <Box x={0} y={630} w={428} h={145} style={{background:'linear-gradient(transparent,#faf6e9 55%)'}}/>
        <Box x={195} y={706} w={38} h={4} style={{borderRadius:4,background:'#bcb4a6'}}/>
        <Box x={34} y={750} w={360} style={{fontFamily:sans,fontSize:17,color:'#a9a194',textAlign:'center'}}>轻点词语，查看解释</Box>
        <Box x={25} y={788} w={378} h={54} style={{fontFamily:sans,fontSize:21,textAlign:'center',lineHeight:'54px',background:'#eee6d4',borderRadius:8}}>♩　{p.action}</Box>
        <Box x={0} y={848} w={428} style={{borderTop:'1px solid #e0d9ca'}}/>
        <Box x={26} y={858} w={375} style={{fontFamily:sans,fontSize:17,display:'flex',alignItems:'center',justifyContent:'space-between',color:'#898173'}}><span>0:{String(Math.floor(t)).padStart(2,'0')}</span><span>↤</span><span>−10</span><span style={{border:'2px solid #bf776b',width:42,height:42,lineHeight:'40px',borderRadius:'50%',textAlign:'center',color:'#bb6e61',fontSize:24}}>{isDone?'▶':'Ⅱ'}</span><span>+10</span><span>↦</span><span>1×</span></Box>
        <Box x={25} y={848} w={378*progress} h={3} style={{background:'#c9967b'}}/>
      </div>
    </Box>
  </Canvas>;
};
