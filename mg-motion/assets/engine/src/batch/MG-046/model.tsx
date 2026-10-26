import React from 'react';
import {Svg,T,Box,Path,Arrow,C,useT,ease,ph,base,arr,txt,HAND} from '../group-C/base-v1';
export type Props={duration:number;title:string;subtitle:string;topLabel:string;resources:string[];middle:string;bottomLabel:string;clients:string[];edgeLabels:[string,string];boundary:string;conclusion:string;note:string};
export function validateProps(p:Props){base(p);txt(p.title,'title',10);txt(p.subtitle,'subtitle',12);['subtitle','conclusion','note'].forEach(k=>txt(p[k as keyof Props],k,25));['topLabel','middle','bottomLabel','boundary'].forEach(k=>txt(p[k as keyof Props],k,10));arr(p.resources,'resources',2,5);arr(p.clients,'clients',2,4);p.resources.forEach(x=>txt(x,'resource',8));p.clients.forEach(x=>txt(x,'client',10));arr(p.edgeLabels,'edgeLabels',2,2);p.edgeLabels.forEach(x=>txt(x,'edgeLabel',10));return p}
export const Template:React.FC<Props>=(input)=>{const p=validateProps(input),t=useT()*10/p.duration;return <Svg bg="#fff"><rect width="1920" height="1080" fill="#fff"/>
 <T x={120} y={270} size={70} weight={900} width={570}>{p.title}</T><T x={120} y={355} size={56} weight={800} width={570}>{p.subtitle}</T><Path d="M125 387Q370 380 654 389" p={ph(t,.2,1.0)} stroke={C.blue} width={6}/>
 <Box x={820} y={150} w={960} h={200} p={ph(t,.45,1.3)}/><T x={1300} y={211} size={31} fill="#8C8D90" anchor="middle" opacity={ease(t,1,1.4)}>{p.topLabel}</T>
 {p.resources.map((s,i)=><T key={i} x={865+(i+.5)*870/p.resources.length} y={294} size={38} width={840/p.resources.length} weight={700} anchor="middle" opacity={ease(t,1.2+i*.12,1.6+i*.12)}>{s}</T>)}
 <Arrow d="M1300 356Q1295 402 1300 450" end={[1300,450]} p={ph(t,1.8,2.45)}/><T x={1340} y={415} size={29} opacity={ease(t,2.2,2.6)}>{p.edgeLabels[0]}</T>
 <Box x={1050} y={465} w={500} h={160} p={ph(t,2.55,3.2)} stroke={C.blue} width={5}/><T x={1300} y={570} size={64} width={440} weight={900} fill={C.blue} anchor="middle" opacity={ease(t,3,3.5)}>{p.middle}</T>
 <Arrow d="M1300 630Q1305 672 1300 714" end={[1300,714]} p={ph(t,3.6,4.25)}/><T x={1340} y={685} size={29} opacity={ease(t,4,4.5)}>{p.edgeLabels[1]}</T>
 <Box x={820} y={728} w={960} h={200} p={ph(t,4.4,5.15)}/><T x={1300} y={784} size={31} fill="#8C8D90" anchor="middle" opacity={ease(t,4.9,5.4)}>{p.bottomLabel}</T>
 {p.clients.map((s,i)=><T key={i} x={865+(i+.5)*870/p.clients.length} y={866} size={38} width={840/p.clients.length} weight={700} anchor="middle" opacity={ease(t,5.15+i*.14,5.6+i*.14)}>{s}</T>)}
 <path d="M1004 435Q1297 440 1599 435L1598 655Q1310 650 1004 656Z" stroke={C.red} fill="none" strokeWidth="3.2" strokeDasharray="17 11" opacity={ease(t,6,6.7)}/><T x={980} y={555} size={32} fill={C.red} weight={800} anchor="end" opacity={ease(t,6.2,6.8)}>{p.boundary}</T>
 <g opacity={ease(t,7,7.7)}><path d="M115 551h520v63H115Z" fill="#F8E79D" opacity=".65"/><T x={120} y={597} size={39} width={500} weight={800} fill={C.red}>{p.conclusion}</T><T x={120} y={680} size={31} width={560}>{p.note}</T></g>
 <T x={120} y={1008} size={23} fill="#96979B">手绘结构 · 按层逐步连接</T></Svg>};
