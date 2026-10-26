import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * P01 · 参考 244 / 21.5–29.0 秒：共同输入 → 彩色连线 → 多模型。
 * 独立试点，不依赖共享 core；帧决定全部动画，不修改已审核模板。
 */
export type ModelItem = {
  name: string;
  short: string;
  color: string;
  detail?: string;
};

export type ComparisonProps = {
  badge: string;
  title: string;
  emphasis: string;
  subtitle: string;
  sourceName: string;
  codeLines: string[];
  models: ModelItem[];
  principles: {text: string; kind: 'check' | 'cross'}[];
  demoLabel?: string;
};

const FONT = '"Noto Sans SC", "Microsoft YaHei", sans-serif';
const MONO = 'Consolas, "Noto Sans SC", monospace';
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const units = (s: string) => [...s].reduce((n,c) => n + (/[\u0000-\u00ff]/.test(c) ? 0.59 : 1),0);
const hash = (i: number) => { const n = Math.sin(i*127.1+17.7)*43758.5453; return n-Math.floor(n); };

export function validateComparison(p: ComparisonProps) {
  if(p.models.length < 2 || p.models.length > 6) throw new Error('P01 支持 2～6 个模型，不能静默丢弃条目。');
  if(p.codeLines.length < 2 || p.codeLines.length > 12) throw new Error('P01 输入内容须为 2～12 行。');
  if(p.codeLines.some(l=>units(l)>27)) throw new Error('P01 单行输入过长，请在不改变含义的前提下换行。');
  if(units(p.title+p.emphasis)>24) throw new Error('P01 主标题过长，建议不超过 24 个中文字宽。');
  if(p.subtitle.length>42 || p.sourceName.length>35) throw new Error('P01 副标题或文件名过长。');
  if(p.models.some(m=>units(m.name)>10.5 || m.short.length>4 || units(m.detail??'')>12.5)) throw new Error('P01 模型名称/简称/描述超出展示范围。');
  if(p.principles.length<1 || p.principles.length>3 || p.principles.some(x=>x.text.length>27)) throw new Error('P01 底部说明支持 1～3 条，每条不超过 27 字。');
  if(p.principles.reduce((s,x)=>s+units(x.text)*26+42,0)+25*(p.principles.length-1)>1617) throw new Error('P01 底部说明总长度过长，请缩短文案。');
}

const codeTokens = (line: string) => {
  const parts=line.split(/("[^"]*"|\b\d+(?:\.\d+)?\b)/g);
  return parts.map((part,i)=>({part,color:part.startsWith('"') ? ((parts[i+1]??'').trimStart().startsWith(':') ? '#63cbb8':'#e8bd61') : /^\d/.test(part)?'#b9a0dc':'#8f99ae'}));
};

const getPoint=(t:number,y:number)=>{
  const q=1-t;
  return {x:q*q*q*992+3*q*q*t*1145+3*q*t*t*1235+t*t*t*1386,
    y:q*q*q*580+3*q*q*t*580+3*q*t*t*y+t*t*t*y};
};

const Check:React.FC<{kind:'check'|'cross';size?:number}> = ({kind,size=29}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" style={{flexShrink:0}}>
    <circle cx="14" cy="14" r="13" fill={kind==='check'?'#1d5b4e':'#5f3444'} opacity=".48" />
    <path d={kind==='check'?'M8 14l4 4 8-9':'M9 9l10 10M19 9L9 19'} stroke={kind==='check'?'#67d9b5':'#d88c9f'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const Comparison: React.FC<ComparisonProps> = (props) => {
  validateComparison(props);
  const frame=useCurrentFrame();
  const {fps,durationInFrames}=useVideoConfig();
  const sec=frame/fps;
  const totalDuration=durationInFrames/fps;
  if(totalDuration<6) throw new Error('P01 至少需要 6 秒，才能完整显示输入、模型和说明。');
  const appear=(start:number,len=.45)=>interpolate(sec,[start,start+len],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const ease=(start:number)=>spring({frame:frame-start*fps,fps,config:{damping:23,stiffness:165,mass:.8}});
  const panelP=ease(.62);
  const codeText=props.codeLines.join('\n');
  const codeTime=Math.min(3.05,totalDuration-3.9);
  const shown=Math.floor(clamp((sec-1.02)/codeTime)*codeText.length);
  const codeSize=Math.min(28,720/Math.max(...props.codeLines.map(units)));
  const lineHeight=Math.min(40,422/props.codeLines.length);
  const cardH=props.models.length<=3?108:74;
  const gap=props.models.length<=3?26:17;
  const stackH=props.models.length*cardH+(props.models.length-1)*gap;
  const top=580-stackH/2;
  const titleSize=Math.min(70,1410/units(props.title+props.emphasis));
  let consumed=0;

  return <AbsoluteFill style={{background:'#080d13',fontFamily:FONT,color:'#f2f3f7',overflow:'hidden'}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 24% 15%,rgba(118,87,27,.15),transparent 43%),radial-gradient(ellipse at 60% 85%,rgba(55,67,113,.23),transparent 60%),radial-gradient(ellipse at 87% 42%,rgba(11,77,84,.13),transparent 55%)'}} />
    {Array.from({length:96},(_,i)=><div key={i} style={{position:'absolute',left:hash(i+1)*1920,top:hash(i+140)*1080,width:i%7===0?2.3:1.3,height:i%7===0?2.3:1.3,borderRadius:'50%',background:'#c5c8cf',opacity:(.06+hash(i+440)*.13)*(.8+.2*Math.sin(sec*.4+i))}} />)}
    <AbsoluteFill style={{background:'radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,.28) 100%)'}} />

    <div style={{position:'absolute',top:64,width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div style={{opacity:appear(0,.32),transform:`translateY(${(1-ease(0))*10}px)`,border:'1.5px solid #68552c',background:'rgba(75,56,20,.25)',color:'#dfb857',borderRadius:28,padding:'5px 20px',fontSize:21,fontWeight:650,letterSpacing:3}}>{props.badge}</div>
      <div style={{fontSize:titleSize,fontWeight:850,letterSpacing:-2,lineHeight:1.25,marginTop:17,whiteSpace:'nowrap',opacity:appear(.15,.42),transform:`translateY(${(1-ease(.12))*18}px)`}}>
        {props.title}<span style={{color:'#efb843'}}>{props.emphasis}</span>
      </div>
      <div style={{fontSize:29,color:'#87909e',marginTop:17,letterSpacing:.6,opacity:appear(.38,.5)}}>{props.subtitle}</div>
    </div>

    <div style={{position:'absolute',left:158,top:316,width:832,height:530,borderRadius:24,background:'linear-gradient(145deg,#0e1320,#0b0f1a)',border:'1.6px solid #252a3a',boxShadow:'0 20px 70px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.025)',opacity:appear(.6,.4),transform:`translateY(${(1-panelP)*24}px) scale(${.985+.015*panelP})`}}>
      <div style={{height:61,borderBottom:'1px solid #202535',display:'flex',alignItems:'center',padding:'0 25px',gap:12}}>
        {['#f1656a','#e9bd56','#53c8a0'].map(c=><div key={c} style={{width:13,height:13,borderRadius:'50%',background:c}}/>)}
        <div style={{position:'absolute',left:130,right:130,textAlign:'center',fontSize:21,fontFamily:MONO,color:'#687285'}}>{props.sourceName}</div>
      </div>
      <div style={{padding:'23px 26px 18px 20px',fontFamily:MONO,fontSize:codeSize,lineHeight:`${lineHeight}px`,whiteSpace:'pre'}}>
        {props.codeLines.map((line,i)=>{
          const before=consumed;consumed+=line.length+1;
          const count=Math.max(0,Math.min(line.length,shown-before));
          const lineVisible=line.slice(0,count);
          const active=shown>=before&&shown<=before+line.length&&sec<1.02+codeTime;
          return <div key={i} style={{height:lineHeight,display:'flex',alignItems:'baseline'}}>
            <span style={{width:40,paddingRight:14,textAlign:'right',fontSize:20,color:'#343d51',flexShrink:0}}>{i+1}</span>
            <span>{codeTokens(lineVisible).map((x,j)=><span key={j} style={{color:x.color}}>{x.part}</span>)}{active&&Math.floor(frame/8)%2===0?<span style={{display:'inline-block',width:10,height:23,background:'#7b9cbd',verticalAlign:'-3px',opacity:.6}}/>:null}</span>
          </div>;
        })}
      </div>
    </div>

    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
      <defs>{props.models.map((_,i)=><clipPath id={`fan-${i}`} key={i}><rect x="990" y="220" width={clamp((sec-2.32-i*.055)/.65)*420} height="660"/></clipPath>)}</defs>
      {props.models.map((m,i)=>{
        const y=top+i*(cardH+gap)+cardH/2;
        const delay=2.6+i*.095;
        const phase=sec>delay?((sec-delay)%2.0)/2.0:0;
        const point=getPoint(phase,y);
        const particleOpacity=sec>delay?Math.sin(phase*Math.PI)*.92:0;
        return <g key={m.name}>
          <path d={`M992 580 C1145 580 1235 ${y} 1386 ${y}`} fill="none" stroke={m.color} strokeWidth="2" strokeDasharray="5 8" opacity=".48" clipPath={`url(#fan-${i})`} />
          <circle cx={point.x} cy={point.y} r="12" fill={m.color} opacity={particleOpacity*.16}/>
          <circle cx={point.x} cy={point.y} r="5" fill={m.color} opacity={particleOpacity}/>
          <circle cx={point.x} cy={point.y} r="2" fill="#e2fff8" opacity={particleOpacity*.8}/>
        </g>;
      })}
    </svg>

    {props.models.map((m,i)=>{
      const p=ease(2.78+i*.11);
      const y=top+i*(cardH+gap);
      return <div key={m.name} style={{position:'absolute',left:1386,top:y,width:390,height:cardH,boxSizing:'border-box',borderRadius:cardH/2,border:`1.6px solid ${m.color}55`,background:'linear-gradient(90deg,#101c26,#101823 80%)',boxShadow:`0 0 24px ${m.color}08,inset 0 1px 0 #ffffff05`,opacity:appear(2.78+i*.11,.35),transform:`translateX(${(1-p)*38}px)`}}>
        <div style={{position:'absolute',left:8,top:(cardH-57)/2,width:57,height:57,borderRadius:'50%',background:`linear-gradient(140deg,${m.color},${m.color}80)`,border:'1px solid #ffffff35',boxShadow:`0 0 18px ${m.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Arial, sans-serif',fontWeight:750,fontSize:m.short.length>3?16:20,color:'#ecfffd'}}>{m.short}</div>
        <div style={{position:'absolute',left:81,right:14,top:0,height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',gap:6}}>
          <span style={{fontSize:Math.min(29,284/units(m.name)),fontWeight:700,whiteSpace:'nowrap',lineHeight:1.15}}>{m.name}</span>
          {m.detail?<span style={{fontSize:22,color:'#8d9bab',lineHeight:1.2}}>{m.detail}</span>:null}
        </div>
      </div>;
    })}

    <div style={{position:'absolute',left:158,right:145,top:919,display:'flex',justifyContent:'space-between',alignItems:'center',gap:25}}>
      {props.principles.map((x,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:13,opacity:appear(4.15+i*.38,.45),transform:`translateY(${(1-ease(4.15+i*.38))*13}px)`,fontSize:26,lineHeight:1.35,whiteSpace:'nowrap',color:x.kind==='cross'?'#ca9aa5':'#d4dbe6'}}><Check kind={x.kind}/><span>{x.text}</span></div>)}
    </div>
    {props.demoLabel?<div style={{position:'absolute',left:0,right:0,bottom:46,textAlign:'center',fontSize:19,color:'#748092',letterSpacing:1}}>{props.demoLabel}</div>:null}
  </AbsoluteFill>;
};
