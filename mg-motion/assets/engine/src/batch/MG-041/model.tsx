import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Box,Canvas,PlateArt,clamp,prog,em,text,count,number,hex,asset} from '../parallel-B/common';
/** 参考271的0–8秒：输入→单稿→多平台卡片→周历。 */
export type Props={
  /** 片长6–20秒，整段节奏同比缩放。 */ durationSeconds:number;
  /** 三段标题，每段最多14个中文字宽。 */ titles:[string,string,string];
  /** 输入要求，最多28个中文字宽。 */ prompt:string;
  /** 主视觉标题，最多12个中文字宽。 */ artworkTitle:string;
  /** 自有素材在public下的相对路径；留空显示原创餐盘图。 */ image?:string;
  /** 主视觉色彩，#RRGGBB。 */ accent:string;
  /** 三至六种发布形式；day为0至6，slot为0至2。 */ cards:{platform:string;caption:string;day:number;slot:number;color:string}[];
  /** 七个日期标题，每项最多4字宽。 */ days:string[];
};
export function validateProps(p:Props){
  number(p.durationSeconds,6,20,'durationSeconds');count(p.titles,3,3,'titles');p.titles.forEach(x=>text(x,14,'标题'));text(p.prompt,28,'prompt');text(p.artworkTitle,12,'artworkTitle');hex(p.accent,'accent');asset(p.image);count(p.days,7,7,'days');p.days.forEach(x=>text(x,4,'日期'));count(p.cards,3,6,'cards');const used=new Set<string>();
  p.cards.forEach(c=>{text(c.platform,6,'平台');text(c.caption,9,'卡片标题');number(c.day,0,6,'day');number(c.slot,0,2,'slot');if(!Number.isInteger(c.day)||!Number.isInteger(c.slot))throw new Error('day和slot必须整数');hex(c.color,'color');const k=`${c.day}/${c.slot}`;if(used.has(k))throw new Error('同一日期时段最多一项');used.add(k)});return p;
}
export const Template:React.FC<Props>=(props)=>{
  const p=validateProps(props);const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps*8/p.durationSeconds;
  const stage=t<3.8?0:t<5.9?1:2;
  const phase=stage===0?0:stage===1?3.8:5.9;
  const enter=prog(t,phase,.45);
  const faintDots='radial-gradient(#17181909 1.5px, transparent 1.5px)';
  return <Canvas color="#ffffff" style={{backgroundImage:faintDots,backgroundSize:'40px 40px'}}>
    <Box x={120} y={85} style={{fontSize:28,fontWeight:600,color:'#885547',opacity:prog(t,0,.4)}}>{String(stage+1).padStart(2,'0')} <span style={{display:'inline-block',width:70,height:1,background:'#d4d0ca',verticalAlign:'middle',marginLeft:20}}/></Box>
    <Box x={120} y={140+(1-enter)*24} w={1660} style={{fontSize:78,fontWeight:800,letterSpacing:-3,opacity:enter}}>{p.titles[stage]}</Box>
    {stage===0&&<>
      <Box x={350} y={500} w={1220} h={126} style={{border:'1px solid #eaeaea',borderRadius:36,boxShadow:'0 18px 22px #0000000b',display:'flex',alignItems:'center',padding:'0 36px',boxSizing:'border-box',opacity:prog(t,.45,.35)*(1-prog(t,1.85,.35)),transform:`translateY(${(1-prog(t,.45,.5))*28}px)`}}><span style={{fontSize:48,marginRight:35}}>✦</span><span style={{fontSize:Math.min(43,Math.floor(940/em(p.prompt))),whiteSpace:'nowrap'}}>{p.prompt.slice(0,Math.floor(clamp((t-.7)/1.05)*p.prompt.length))}{t<1.8?'│':''}</span><span style={{position:'absolute',right:28,top:22,width:82,height:82,borderRadius:'50%',background:'#111',color:'white',fontSize:50,textAlign:'center',lineHeight:'78px'}}>↑</span></Box>
      <Box x={735} y={285+(1-prog(t,1.9,.55))*80} w={450} h={635} style={{borderRadius:24,overflow:'hidden',opacity:prog(t,1.9,.45),transform:`scale(${.9+.1*prog(t,1.9,.6)})`,boxShadow:'0 22px 30px #393b2622'}}><PlateArt color={p.accent} image={p.image}/><Box x={35} y={42} w={370} style={{fontSize:46,fontFamily:'Georgia, "Noto Serif SC", serif',lineHeight:1.25,color:'#252b20'}}>{p.artworkTitle}</Box></Box>
    </>}
    {stage===1&&<>{p.cards.map((c,i)=>{const n=p.cards.length;const x=960+(i-(n-1)/2)*(n===6?274:320);const a=prog(t,3.8+i*.055,.6);const wide=i%3===2;const h=wide?360:465;const y=wide?405:355;return <Box key={i} x={960+(x-960)*a-126} y={y+(1-a)*70} w={252} h={h} style={{opacity:a,background:'#fff',border:'1px solid #efefed',borderRadius:20,boxShadow:'0 18px 20px #21261d20',overflow:'hidden',transform:`perspective(1000px) rotateY(${(i-(n-1)/2)*-5}deg) rotateZ(${(i-(n-1)/2)*1.6}deg)`}}><Box x={16} y={16} style={{display:'flex',alignItems:'center',gap:12,fontSize:21,fontWeight:700}}><span style={{width:32,height:32,borderRadius:'50%',background:c.color,color:'white',textAlign:'center',lineHeight:'32px',fontSize:18}}>{i+1}</span>{c.platform}</Box><Box x={0} y={66} w={252} h={h-142}><PlateArt color={p.accent} image={p.image}/></Box><Box x={18} y={h-68} w={216} style={{fontSize:23,fontWeight:650,lineHeight:1.3}}>{c.caption}</Box><Box x={18} y={h-25} w={216} style={{fontSize:16,color:'#a9aca6'}}>♡　↗　▱</Box></Box>})}</>}
    {stage===2&&<Box x={125} y={295+(1-enter)*45} w={1670} h={660} style={{background:'white',borderRadius:24,boxShadow:'0 22px 22px #00000012',opacity:enter}}>
      {p.days.map((d,i)=><Box key={i} x={80+i*220} y={24} w={208} h={604} style={{borderRight:i<6?'1px solid #eeefed':undefined}}><div style={{textAlign:'center',fontSize:25,fontWeight:600,marginBottom:24}}>{d}</div>{[0,1,2].map(r=><div key={r} style={{height:173,borderTop:'1px solid #f4f4f2'}}/>)}</Box>)}
      {['09:00','13:00','18:00'].map((v,i)=><Box key={v} x={14} y={94+i*174} style={{fontSize:18,color:'#949894'}}>{v}</Box>)}
      {p.cards.map((c,i)=>{const a=prog(t,6+i*.075,.6);const x=90+c.day*220;const y=80+c.slot*174;return <Box key={i} x={x} y={y+(1-a)*80} w={187} h={145} style={{opacity:a,transform:`scale(${.7+.3*a})`}}><div style={{height:100,overflow:'hidden',borderRadius:12,boxShadow:'0 4px 8px #00000014',position:'relative'}}><PlateArt color={p.accent} image={p.image}/><span style={{position:'absolute',top:6,left:6,background:c.color,color:'white',borderRadius:5,fontSize:16,padding:'3px 7px'}}>{c.platform}</span></div><div style={{fontSize:19,marginTop:7,whiteSpace:'nowrap'}}>{c.caption}</div><div style={{fontSize:16,color:'#628171',marginTop:2}}>✓ 已排程</div></Box>})}
    </Box>}
  </Canvas>;
};
