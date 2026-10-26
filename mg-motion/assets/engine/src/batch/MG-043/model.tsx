import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Box,Canvas,em,prog,clamp,text,count,number} from '../parallel-B/common';
/** 参考280的0–5.8秒，横屏改编为左标题、右手机，保留键盘开合与双向气泡。 */
export type Props={
 /** 总长6–25秒。 */ durationSeconds:number;
 /** 两行标题，分别最多9中文字宽。 */ title:string;emphasis:string;
 /** 辅助说明最多32中文字宽。 */ subtitle:string;
 /** 联系人名称最多9字宽。 */ contact:string;
 /** 2–4条交替对话；从me开始；时间严格递增，正文总高度受限。 */ messages:{role:'me'|'other';text:string;at:number}[];
 /** 左下短提示最多20字宽。 */ note:string;
};
const bubbleHeight=(s:string)=>Math.ceil(em(s)/10)*34+28;
export function validateProps(p:Props){number(p.durationSeconds,6,25,'durationSeconds');text(p.title,9,'title');text(p.emphasis,9,'emphasis');text(p.subtitle,32,'subtitle');text(p.contact,9,'contact');text(p.note,20,'note');count(p.messages,2,4,'messages');let last=0,sum=0;p.messages.forEach((m,i)=>{if(m.role!==(i%2?'other':'me'))throw new Error('消息必须从me开始交替');text(m.text,31,'消息');number(m.at,1.3,p.durationSeconds-1,'消息时间');if(m.at-last<.65)throw new Error('消息时间至少相隔0.65秒');last=m.at;sum+=bubbleHeight(m.text)+20});if(sum>480)throw new Error('对话总高度超限，请缩短正文或拆成下一镜头');if(p.messages.slice(0,2).reduce((s,m)=>s+bubbleHeight(m.text)+20,0)>260)throw new Error('前两条消息太长，无法同时显示输入键盘');return p}
export const Template:React.FC<Props>=(props)=>{
 const p=validateProps(props);const f=useCurrentFrame();const{fps}=useVideoConfig();const t=f/fps;const visible=p.messages.filter(m=>t>=m.at);const pending=p.messages.find(m=>t<m.at);const typing=!!pending&&t>pending.at-.8;const keyboard=typing&&pending?.role==='me';let y=0;
 return <Canvas color="#fcf1e5" style={{backgroundImage:'radial-gradient(ellipse at 72% 45%,#ffe5cd 0%,transparent 53%),radial-gradient(#c5a58b30 1.2px,transparent 1.2px)',backgroundSize:'auto,40px 40px'}}>
  {[0,1,2].map(i=><Box key={i} x={100+i*630} y={160+i*290} w={140} h={65} style={{background:'#b9595120',borderRadius:24,transform:`rotate(${i%2?12:-7}deg)`}}><div style={{margin:'20px 26px',height:7,background:'#fff4',width:75}}/><div style={{margin:'-9px 26px',height:6,background:'#fff4',width:45}}/></Box>)}
  <Box x={155} y={290+(1-prog(t,.05,.5))*35} w={850} style={{opacity:prog(t,.05,.5),fontSize:Math.min(98,820/Math.max(em(p.title),em(p.emphasis))),fontWeight:900,letterSpacing:-4,lineHeight:1.16}}>{p.title}<br/><span style={{color:'#b65046',position:'relative'}}>{p.emphasis}<svg style={{position:'absolute',left:0,bottom:-22,width:'100%',height:27}} viewBox="0 0 800 27" preserveAspectRatio="none"><path d="M5 12Q130 25 266 11T520 14T795 10" stroke="#b65046" strokeWidth="7" strokeLinecap="round" fill="none"/></svg></span></Box>
  <Box x={160} y={580} w={780} style={{fontSize:34,color:'#786e62',lineHeight:1.65,opacity:prog(t,.3,.5)}}>{p.subtitle}</Box>
  <Box x={160} y={800} w={770} style={{fontSize:27,color:'#b07f6b',opacity:prog(t,p.messages[p.messages.length-1].at,.4)}}><span style={{color:'#b65046'}}>✓</span>　{p.note}</Box>
  <Box x={1130} y={110+(1-prog(t,0,.65))*75} w={490} h={870} style={{background:'#151518',border:'5px solid #504b4a',borderRadius:70,padding:15,boxSizing:'border-box',boxShadow:'0 22px 25px #4a352f38',transform:`rotate(${(1-prog(t,0,.8))*3}deg)`}}><div style={{background:'white',height:'100%',borderRadius:51,overflow:'hidden',position:'relative'}}>
   <Box x={127} y={0} w={200} h={37} style={{background:'#151518',borderRadius:'0 0 24px 24px'}}/>
   <Box x={29} y={18} style={{fontSize:19,fontWeight:700}}>9:41</Box><Box x={350} y={20} style={{fontSize:18}}>▮▮ ▰</Box>
   <Box x={0} y={48} w={450} h={85} style={{background:'#f7f7f9',borderBottom:'1px solid #eee',textAlign:'center'}}><span style={{position:'absolute',left:20,top:18,color:'#3499df',fontSize:42}}>‹</span><div style={{fontSize:24,marginTop:14,color:'#b3b5b9'}}>●</div><div style={{fontSize:19,fontWeight:600}}>{p.contact}</div><span style={{position:'absolute',right:22,top:34,color:'#3499df'}}>▣　♧</span></Box>
   <Box x={20} y={160} w={410} h={490}>{visible.map((m,i)=>{const h=bubbleHeight(m.text);const top=y;y+=h+20;const a=prog(t,m.at,.25);return <Box key={i} x={m.role==='me'?70:0} y={top+(1-a)*18} w={340} h={h} style={{background:m.role==='me'?'#168cfb':'#e8e8ec',color:m.role==='me'?'white':'#2a2b31',borderRadius:m.role==='me'?'24px 24px 6px 24px':'24px 24px 24px 6px',padding:'14px 20px',boxSizing:'border-box',fontSize:28,lineHeight:'34px',opacity:a,transform:`scale(${.92+.08*a})`,transformOrigin:m.role==='me'?'right bottom':'left bottom'}}>{m.text}</Box>})}{typing&&pending?.role==='other'&&<Box x={0} y={y} w={88} h={50} style={{background:'#e8e8ec',borderRadius:22,color:'#aaa',fontSize:35,textAlign:'center'}}>···</Box>}</Box>
   <Box x={0} y={keyboard?535:740} w={450} h={75} style={{background:'#f8f8fa',borderTop:'1px solid #eee',display:'flex',alignItems:'center',padding:13,boxSizing:'border-box',gap:10}}><span style={{background:'#a5a7ae',color:'white',borderRadius:'50%',width:31,height:31,lineHeight:'28px',fontSize:28,textAlign:'center'}}>+</span><div style={{border:'1px solid #d8d9de',borderRadius:25,padding:'9px 12px',fontSize:19,color:keyboard?'#676971':'#c4c6cd',height:42,boxSizing:'border-box',width:361,whiteSpace:'nowrap',overflow:'hidden'}}>{keyboard&&pending?pending.text.slice(0,Math.floor(clamp((t-(pending.at-.8))/.7)*pending.text.length)):'信息'}{keyboard?'│':''}</div></Box>
   {keyboard&&<Box x={0} y={610} w={450} h={205} style={{background:'#d0d2d8',padding:'12px 10px',boxSizing:'border-box'}}>{['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].map((row,r)=><div key={row} style={{display:'flex',justifyContent:'center',gap:4,marginBottom:8}}>{row.split('').map(c=><div key={c} style={{width:38,height:39,background:'white',borderRadius:6,fontSize:23,textAlign:'center',lineHeight:'38px',boxShadow:'0 2px 0 #a5a7af'}}>{c}</div>)}</div>)}<div style={{width:240,height:30,background:'white',borderRadius:5,margin:'2px auto',fontSize:16,textAlign:'center',lineHeight:'30px'}}>空格</div></Box>}
   <Box x={151} y={818} w={150} h={6} style={{background:'#1c1c1e',borderRadius:5}}/>
  </div></Box>
 </Canvas>
};
