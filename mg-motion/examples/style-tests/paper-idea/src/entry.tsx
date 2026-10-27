import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame} from 'remotion';
const C={paper:'#eee5d2',ink:'#463b30',white:'#fffaf0',ochre:'#e3b94f',rust:'#ba654b',sage:'#809474',muted:'#9a8b73'};
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
const smooth=(x:number)=>{const v=clamp(x);return v*v*(3-2*v)};
const p=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
const lerp=(a:number,b:number,v:number)=>a+(b-a)*v;
const hand='KaiTi, STKaiti, "Noto Serif SC", serif';
const Draw=({d,progress=1,color=C.ink,width=5,opacity=1}:any)=><g opacity={opacity}><path d={d} fill="none" stroke={color} strokeWidth={width} pathLength={1} strokeDasharray={1} strokeDashoffset={1-clamp(progress)} strokeLinecap="round" strokeLinejoin="round"/><path d={d} fill="none" stroke={color} strokeWidth={.9} transform="translate(1.3,-1.1)" opacity={.38} pathLength={1} strokeDasharray={1} strokeDashoffset={1-clamp(progress)} strokeLinecap="round" strokeLinejoin="round"/></g>;
const Pencil=({x,y,angle=-28,opacity=1,scale=1}:any)=><g opacity={opacity} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}><path d="M0 0 L37 -16 L259 -16 Q270 -16 270 -4 L270 7 Q270 18 258 18 L37 18Z" fill={C.ochre} stroke={C.ink} strokeWidth="3"/><path d="M37 -16 L0 0 L37 18Z" fill="#dfc2a0" stroke={C.ink} strokeWidth="2"/><path d="M0 0L12 -5L13 6Z" fill={C.ink}/><path d="M228 -16v34" stroke={C.ink} strokeWidth="3"/><path d="M245 -16h15q10 0 10 12v11q0 11-12 11h-13Z" fill="#c98172"/><path d="M45 -6h174M44 8h174" stroke="#fff6cb" strokeWidth="3" opacity=".65"/></g>;
const Paper=({children,tape=true}:any)=><g><path d="M-288 -273 L286 -280 L296 -156 L290 -30 L297 126 L285 278 L158 273 L19 280 L-128 274 L-291 280 L-285 120 L-295 -36Z" fill="#7a684b" opacity=".12" transform="translate(9,15)"/><path d="M-288 -273 L286 -280 L296 -156 L290 -30 L297 126 L285 278 L158 273 L19 280 L-128 274 L-291 280 L-285 120 L-295 -36Z" fill={C.white}/><path d="M-288 -273L286 -280M-291 280L285 278" fill="none" stroke="#d6c8aa" strokeWidth="2"/>{tape&&<path d="M-94 -303L102 -298L93 -249L-98 -256L-92 -270L-101 -282Z" fill={C.ochre} opacity=".65"/>}{children}</g>;
const Bulb=({progress=1}:any)=><g><Draw d="M-51 65 C-58 39 -98 21 -97 -29 C-97 -150 94 -151 96 -31 C97 19 58 45 51 65Z" width={6} progress={progress}/><Draw d="M-49 80 Q-1 72 50 78 M-44 96Q0 91 43 94 M-25 110Q0 124 25 109" progress={progress} width={5}/><Draw d="M-26 57L-35 -13L-8 6L13 -14L37 5L27 57" progress={progress} width={4}/>{[-140,-90,-40,10,60,110,160].map((a,i)=>{const q=a*Math.PI/180,x=Math.cos(q)*144,y=Math.sin(q)*144-24;return <Draw key={i} d={`M${x} ${y}l${Math.cos(q)*24} ${Math.sin(q)*24}`} color={C.rust} width={5} progress={progress}/>})}</g>;
const Film=()=>{
 const t=useCurrentFrame()/30,enter=p(t,0,.8),settle=p(t,1.9,3.5),next=p(t,8,9.8),end=p(t,9.1,10.1);
 const bx=lerp(1000,410,settle)-150*next,by=lerp(540,460,settle),bs=lerp(1.4,.72,settle)*(1-.15*next);
 const sx=lerp(2400,1180,settle)-510*next,sy=lerp(620,550,settle)+35*next,ss=lerp(1,.79,next);
 const sketch=p(t,4.35,6.45),checked=p(t,6.65,7.3);
 const points=[[ -185,112],[-100,-10],[-20,82],[55,-55],[185,112],[-185,112]];
 const lengths=points.slice(1).map((v,i)=>Math.hypot(v[0]-points[i][0],v[1]-points[i][1])),total=lengths.reduce((a,b)=>a+b,0);
 let distance=sketch*total,k=0;while(k<lengths.length-1&&distance>lengths[k]){distance-=lengths[k];k++;}const u=distance/lengths[k];
 const tipX=lerp(points[k][0],points[k+1][0],u),tipY=lerp(points[k][1],points[k+1][1],u);
 const sketchD='M-185 112 L-100 -10 L-20 82 L55 -55 L185 112 Z';
 return <AbsoluteFill style={{background:C.paper}}><svg viewBox="0 0 1920 1080" width="1920" height="1080">
 <defs><pattern id="fibres" width="117" height="107" patternUnits="userSpaceOnUse"><path d="M12 20l2 -1M58 55l4 1M96 28l-2 2M33 97l2 -1" stroke="#a39276" strokeWidth="1" opacity=".22"/><circle cx="88" cy="91" r="1.1" fill="#9e8b70" opacity=".16"/></pattern><radialGradient id="warm"><stop offset=".35" stopColor="#fffaf0" stopOpacity=".5"/><stop offset="1" stopColor="#c7ad86" stopOpacity=".17"/></radialGradient><filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#826e4c" floodOpacity=".1"/></filter></defs>
 <rect width="1920" height="1080" fill="url(#warm)"/><rect width="1920" height="1080" fill="url(#fibres)"/>
 <g opacity={enter*(1-settle)} transform={`translate(0 ${(1-enter)*25})`}><text x="960" y="180" textAnchor="middle" fontFamily={hand} fontSize="93" fontWeight="700" fill={C.ink}>想法很大</text><Draw d="M743 211Q945 224 1175 204" color={C.rust} width={7} progress={enter}/></g>
 <g opacity={1-next*.55} transform={`translate(${bx} ${by}) scale(${bs*enter}) rotate(${-4+settle*4})`}>
 <path d="M-190 -84C-259 -110-241 -191-152 -183C-152-270-12-278 22-220C86-286 188-238 168-173C267-168 291-70 224-26C291 61 219 155 138 118C104 210-29 204-63 138C-164 180-247 105-213 39C-282 7-264-67-190-84Z" fill="#f8f1df" stroke="#d9c9a8" strokeWidth="2"/>
 <g opacity={1-settle}><Draw d="M-172 0C-280-110-35-227 93-157C241-66 14 192-150 97C-311-55-3-234 167-107C288 11 30 201-127 88" progress={p(t,.1,1.3)} color={C.muted} width={2.5} opacity={.45}/></g><Bulb progress={enter}/>
 </g>
 <g opacity={settle*(1-next)}><text x="402" y="710" textAnchor="middle" fontFamily={hand} fontSize="48" fill={C.ink}>先落到一个小动作</text><Draw d="M546 488C660 434 693 464 784 514" color={C.rust} width={5} progress={p(t,2.5,3.5)}/><Draw d="M757 495L787 515L753 527" color={C.rust} width={5} progress={p(t,3.2,3.5)}/></g>
 <g transform={`translate(${sx} ${sy}) rotate(${lerp(-8,-3,settle)+next*5}) scale(${ss})`}>
 <Paper><text x="-218" y="-178" fill={C.rust} fontFamily={hand} fontWeight="700" fontSize="35">今天的第一步</text><text x="-220" y="-104" fill={C.ink} fontFamily={hand} fontWeight="700" fontSize="58" opacity={p(t,3.3,4.2)}>画一张草图</text><Draw d="M-222 -76Q0 -69 213 -80" color={C.ochre} width={18} opacity={.55} progress={p(t,3.55,4.3)}/>
 <g transform="translate(0 32)"><Draw d={sketchD} progress={sketch} width={4.5}/><Draw d="M-194 139Q-8 128 201 138" progress={p(t,6.15,6.55)} width={3} color={C.muted}/><circle cx="115" cy="-47" r="28" fill={C.ochre} opacity={p(t,5.7,6.25)}/><Draw d="M-74 16l18 31 23 -4M28 -11L54 14 84 3" progress={p(t,6.1,6.5)} width={3.3}/></g>
 <g opacity={checked} transform={`translate(207 205) rotate(-12) scale(${1+.15*Math.sin(checked*Math.PI)})`}><circle r="58" fill={C.sage}/><Draw d="M-28 0L-8 21L32 -24" color={C.white} width={7} progress={checked}/></g></Paper>
 <Pencil x={tipX} y={tipY+32} angle={-32} scale={.74} opacity={p(t,3.95,4.3)*(1-p(t,6.45,6.8))}/>
 </g>
 <g opacity={next}><Draw d="M924 590C1050 571 1108 633 1183 594" progress={p(t,8.45,9.55)} color={C.rust} width={5}/><Draw d="M1160 574L1186 593L1162 610" progress={p(t,9.3,9.6)} color={C.rust} width={5}/></g>
 <g opacity={p(t,8.45,9.15)} transform={`translate(${lerp(2090,1460,next)} ${lerp(770,610,next)}) rotate(${lerp(18,6,next)}) scale(.68)`}><Paper><text x="-210" y="-164" fontFamily={hand} fontSize="48" fill={C.rust}>下一步</text><Draw d="M-194 -95Q-28 -101 193 -91M-194 -20Q-16 -25 115 -15" color={C.muted} width={3} progress={p(t,9.15,9.8)}/><Draw d="M-150 129Q-17 143 145 118M111 91L151 120L119 146" color={C.ink} width={6} progress={p(t,9.7,10.2)}/></Paper><Pencil x={70} y={189} angle={-11} scale={.85}/></g>
 <g opacity={end}><text x="960" y="218" textAnchor="middle" fontFamily={hand} fontWeight="700" fontSize="83" fill={C.ink}>做完一步，再接一步。</text><Draw d="M724 249Q1038 271 1410 246" progress={p(t,9.6,10.5)} color={C.rust} width={6}/><text x="950" y="939" textAnchor="middle" fontFamily={hand} fontSize="35" fill={C.muted}>让想法，有一个开始。</text></g>
 {[0,1,2,3,4].map((i)=>{const q=p(t,7.1,7.7),a=(i*65-160)*Math.PI/180,r=100+q*60;return <g key={i} opacity={Math.sin(q*Math.PI)*.75} transform={`translate(${sx+185+Math.cos(a)*r} ${sy+180+Math.sin(a)*r}) rotate(${i*28})`}><path d="M-10 0h20M0-10v20" stroke={i%2?C.rust:C.sage} strokeWidth="3"/></g>})}
 </svg></AbsoluteFill>;
};
const Root=()=> <Composition id="Supplement" component={Film} width={1920} height={1080} fps={30} durationInFrames={360}/>;
registerRoot(Root);
