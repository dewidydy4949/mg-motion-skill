import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/** P03 · 参考391，10.0–21.5秒。纯帧函数：描线→填写→插图→勾选→授权配置→测试通过。 */
export type P03Props = {
  title: string;
  subtitle: string;
  browserLabel: string;
  fields: {label: string; value: string}[];
  featuresTitle: string;
  features: string[];
  panelTitle: string;
  tabs: [string, string];
  settings: {label: string; value: string}[];
  button: string;
  complete: string;
};

const INK = '#292722';
const PAPER = '#F6F2E6';
const WHITE = '#FFFEF7';
const GOLD = '#FFC927';
const HAND = 'KaiTi, STKaiti, "Noto Serif SC", serif';
const UI = '"Noto Sans SC", "Microsoft YaHei", sans-serif';
export const P03_DURATION = 11.5;
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const phase = (t: number, start: number, end: number) => clamp((t - start) / (end - start));
const ease = (v: number) => v * v * (3 - 2 * v);
const units = (s: string) => Array.from(s).reduce((n, ch) => n + (/[^\x00-\x7F]/.test(ch) ? 1 : 0.55), 0);
const fit = (s: string, max: number, width: number) => Math.min(max, width / Math.max(1, units(s)));
const typed = (s: string, p: number) => Array.from(s).slice(0, Math.ceil(Array.from(s).length * clamp(p))).join('');

export function validateP03(p: P03Props): P03Props {
  const text = (v: unknown, name: string, maxUnits: number) => {
    if (typeof v !== 'string' || !v.trim() || /[\r\n]/.test(v) || units(v) > maxUnits) {
      throw new Error(`P03 ${name} 必须为单行非空文字，中文宽度不超过 ${maxUnits} 字。`);
    }
  };
  text(p.title, 'title', 24); text(p.subtitle, 'subtitle', 23); text(p.browserLabel, 'browserLabel', 35);
  if (!Array.isArray(p.fields) || p.fields.length !== 3) throw new Error('P03 fields 必须为3项。');
  p.fields.forEach((f, i) => { text(f.label, `fields[${i}].label`, 7); text(f.value, `fields[${i}].value`, 15); });
  text(p.featuresTitle, 'featuresTitle', 8);
  if (!Array.isArray(p.features) || p.features.length < 1 || p.features.length > 3) throw new Error('P03 features 支持1到3项。');
  p.features.forEach((v, i) => text(v, `features[${i}]`, 10));
  text(p.panelTitle, 'panelTitle', 8);
  if (!Array.isArray(p.tabs) || p.tabs.length !== 2) throw new Error('P03 tabs 必须为2项。');
  p.tabs.forEach((v, i) => text(v, `tabs[${i}]`, 5));
  if (!Array.isArray(p.settings) || p.settings.length !== 2) throw new Error('P03 settings 必须为2项。');
  p.settings.forEach((f, i) => { text(f.label, `settings[${i}].label`, 8); text(f.value, `settings[${i}].value`, 15); });
  text(p.button, 'button', 6); text(p.complete, 'complete', 4);
  return p;
}

type LineProps = {d: string; p?: number; stroke?: string; width?: number; fill?: string; opacity?: number};
const Line: React.FC<LineProps> = ({d, p = 1, stroke = INK, width = 3.1, fill = 'none', opacity = 1}) => (
  <g opacity={opacity}>
    {fill !== 'none' && <path d={d} fill={fill} opacity={clamp(p * 3)} />}
    <path d={d} pathLength={1} stroke={stroke} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - clamp(p)} />
    <path d={d} pathLength={1} transform="translate(0.85,-0.6)" stroke={stroke} strokeWidth={0.7} opacity={0.38} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - clamp(p)} />
  </g>
);
const box = (x: number, y: number, w: number, h: number, r = 12) => `M ${x+r} ${y} Q ${x+w*.47} ${y-2} ${x+w-r} ${y+1} Q ${x+w+1} ${y+2} ${x+w} ${y+r} L ${x+w-1} ${y+h-r} Q ${x+w+1} ${y+h} ${x+w-r} ${y+h} Q ${x+w*.48} ${y+h-1} ${x+r} ${y+h+1} Q ${x-2} ${y+h} ${x} ${y+h-r} L ${x+1} ${y+r} Q ${x-1} ${y-1} ${x+r} ${y} Z`;
const Check: React.FC<{x: number; y: number; p: number; circle?: boolean; r?: number}> = ({x,y,p,circle=true,r=15}) => (
  <g opacity={clamp(p*3)}>
    {circle && <><circle cx={x} cy={y} r={r} fill={GOLD} stroke={INK} strokeWidth={2.4}/><ellipse cx={x+.3} cy={y-.4} rx={r+.8} ry={r-.5} fill="none" stroke={INK} strokeWidth={0.6}/></>}
    <Line d={`M ${x-r*.52} ${y} L ${x-r*.12} ${y+r*.45} L ${x+r*.57} ${y-r*.5}`} p={p} width={3.2}/>
  </g>
);

const Paper: React.FC = () => (
  <>
    <rect width="1920" height="1080" fill={PAPER}/>
    <defs>
      <filter id="p03-grain"><feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed="31" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <radialGradient id="p03-vignette"><stop offset="52%" stopColor="#B3A78B" stopOpacity="0"/><stop offset="100%" stopColor="#B3A78B" stopOpacity=".17"/></radialGradient>
      <pattern id="p03-fibres" width="97" height="89" patternUnits="userSpaceOnUse">
        <path d="M13 17l1.1 -2 M71 32l1.5 .5 M43 73l-.6 1.5 M84 81l.8 -.3" stroke="#7C715B" opacity=".12" strokeWidth="1.1"/>
        <circle cx="54" cy="21" r=".7" fill="#8A7E68" opacity=".16"/>
      </pattern>
    </defs>
    <rect width="1920" height="1080" filter="url(#p03-grain)" opacity=".055"/>
    <rect width="1920" height="1080" fill="url(#p03-fibres)"/>
    <rect width="1920" height="1080" fill="url(#p03-vignette)"/>
  </>
);

const Robot: React.FC<{t:number}> = ({t}) => {
  const done=t>10.1;
  const bob=Math.sin(t*2.3)*2.1;
  const blink=Math.sin(t*2.1)>.992;
  return <g transform={`translate(265,742) rotate(${Math.sin(t*1.3)*.55}) translate(0,${bob})`}>
    <ellipse cx="0" cy="143" rx="70" ry="7" fill="#9B8C6B" opacity=".08"/>
    <Line d="M -32 108 L -34 139 L -57 140 M 34 108 L 37 140 L 58 139" width={3.7}/>
    <Line d="M -61 50 Q -99 54 -99 93 M 61 52 Q 99 56 99 93" width={3.6}/>
    <circle cx="-99" cy="99" r="8" fill={WHITE} stroke={INK} strokeWidth="3"/>
    <circle cx="99" cy="99" r="8" fill={WHITE} stroke={INK} strokeWidth="3"/>
    <Line d={box(-64,31,128,82,17)} width={3.6} fill={WHITE}/>
    <circle cx="0" cy="68" r="17" fill={GOLD} stroke={INK} strokeWidth="3.2"/>
    <Line d="M0 -84 L0 -109" width={3.7}/>
    <circle cx="0" cy="-118" r="10" fill={GOLD} stroke={INK} strokeWidth="3"/>
    <Line d={box(-82,-79,164,107,22)} width={3.7} fill={WHITE}/>
    {done ? <><Line d="M-40 -27 Q-30 -45 -20 -27" width={4}/><Line d="M20 -27 Q30 -45 40 -27" width={4}/></> : <><ellipse cx="-31" cy="-30" rx="8" ry={blink?2:13} fill={INK}/><ellipse cx="31" cy="-30" rx="8" ry={blink?2:13} fill={INK}/></>}
    <path d="M-20 -2 Q0 19 22 -3" fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round"/>
    <ellipse cx="-51" cy="-6" rx="12" ry="5" fill={GOLD} opacity=".65"/><ellipse cx="51" cy="-6" rx="12" ry="5" fill={GOLD} opacity=".65"/>
    {!done && [0,1,2].map(i=><path key={i} d={`M ${-17-i*9} ${-143-i*10} Q0 ${-156-i*14} ${17+i*9} ${-143-i*10}`} stroke={INK} strokeWidth="2.2" opacity={.2+.35*(.5+.5*Math.sin(t*5-i))} fill="none"/>)}
    {done && <g stroke={GOLD} strokeWidth="4" strokeLinecap="round" opacity={phase(t,10.1,10.4)}><path d="M-108 -64l-17 -8 M-106 -40l-19 2 M108 -64l17 -8 M106 -40l19 2"/></g>}
  </g>;
};

const MiniPreview: React.FC<{x:number;y:number;type:number;p:number}> = ({x,y,type,p}) => <g opacity={clamp(p*2)}>
  <Line d={box(x,y,132,82,2)} p={p} width={2.4} fill={WHITE}/>
  {type===0 && [23,43,31,58].map((h,i)=><rect key={i} x={x+15+i*25} y={y+68-h*ease(p)} width="14" height={h*ease(p)} fill={GOLD} stroke={INK} strokeWidth="1.7"/>)}
  {type===1 && <><circle cx={x+29} cy={y+40} r={18*p} fill={GOLD} stroke={INK} strokeWidth="2"/><Line d={`M${x+60} ${y+25}l58 -1 M${x+60} ${y+40}l51 1 M${x+60} ${y+55}l56 -1`} p={p} width={2}/></>}
  {type===2 && <><circle cx={x+100} cy={y+21} r={10*p} fill={GOLD} stroke={INK} strokeWidth="2"/><Line d={`M${x+7} ${y+73}l35 -43 29 26 19 -19 36 36`} p={p} width={2.5}/></>}
</g>;

const Pencil: React.FC<{x:number;y:number;angle:number;opacity:number}> = ({x,y,angle,opacity}) => <g transform={`translate(${x},${y}) rotate(${angle})`} opacity={opacity}>
  <path d="M0 0L29 -12L29 12Z" fill="#E7C69B" stroke={INK} strokeWidth="2.7"/>
  <path d="M0 0L10 -4L10 4Z" fill={INK}/>
  <path d="M29 -12L183 -10L183 10L29 12Z" fill={GOLD} stroke={INK} strokeWidth="2.7"/>
  <path d="M31 -4L179 -3" stroke="#FFF19A" strokeWidth="3"/>
  <path d="M178 -11L193 -10L193 10L178 11Z" fill="#C2BFB5" stroke={INK} strokeWidth="2.5"/>
  <path d="M193 -10L207 -10Q215 -8 214 0Q215 8 207 10L193 10Z" fill="#ECA1AA" stroke={INK} strokeWidth="2.5"/>
</g>;

export const AgentForm: React.FC<P03Props> = (input) => {
  const p=validateP03(input);
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  const mainP=ease(phase(t,0,.7));
  const detailP=phase(t,.32,1.0);
  const starts=[1.65,2.55,3.4];
  const ends=[2.25,3.2,3.85];
  const textY=[440,532,624];
  const fp=starts.map((s,i)=>phase(t,s,ends[i]));
  const pictureP=phase(t,4.0,4.65);
  const panelP=phase(t,6.5,7.15);
  const settingP=[phase(t,8.05,8.65),phase(t,8.85,9.4)];
  const doneP=phase(t,10.0,10.32);

  // 铅笔沿每个实际填写目标移动，所有坐标由时间直接计算，无随机状态或定时器。
  const targets: [number,number,number,number][] = [
    [1.25,595,390,-45],[1.65,847,440,-31],
    [2.25,847+units(p.fields[0].value)*fit(p.fields[0].value,38,395),440,-31],
    [2.48,847,532,-32],[3.2,847+units(p.fields[1].value)*fit(p.fields[1].value,37,395),532,-30],
    [3.35,847,624,-31],[3.85,847+units(p.fields[2].value)*fit(p.fields[2].value,37,395),624,-29],
    [4.0,511,595,-35],[4.22,585,501,-36],[4.4,642,556,-34],[4.65,791,595,-32],
    [4.9,510,715,-36],[5.15,510,759,-32],[5.4,510,803,-31],
    [5.65,877,800,-30],[5.95,1028,787,-27],[6.2,1190,787,-30],
    [6.55,1348,421,-30],[7.25,1565,450,-30],[7.65,1620,533,-30],
    [8.02,1375,639,-25],[8.65,1375+units(p.settings[0].value)*fit(p.settings[0].value,32,385),639,-25],
    [8.83,1375,738,-25],[9.4,1375+units(p.settings[1].value)*fit(p.settings[1].value,32,385),738,-25],
    [9.75,1470,823,-32],[10.15,1540,950,-8],[11.5,1540,950,-8]
  ];
  let ti=targets.findIndex((v,i)=>i<targets.length-1 && t>=v[0] && t<targets[i+1][0]);
  if(ti<0) ti=t<targets[0][0]?0:targets.length-2;
  const from=targets[ti],to=targets[ti+1];
  const q=ease(phase(t,from[0],to[0]));
  const pencilX=from[1]+(to[1]-from[1])*q;
  const pencilY=from[2]+(to[2]-from[2])*q+(t<10?Math.sin(t*24)*1.4:0);
  // 长设置值写到右侧时把笔杆转向左上，避免允许范围内的文案把铅笔推到画外。
  const pencilAngle=from[3]+(to[3]-from[3])*q-112*ease(clamp((pencilX-1700)/80));

  return <AbsoluteFill style={{background:PAPER}}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{fontFamily:HAND, color:INK}}>
      <Paper/>
      <g transform="rotate(-.45 970 165)">
        <circle cx="184" cy="141" r="43" fill={GOLD} stroke={INK} strokeWidth="3.7"/>
        <ellipse cx="184" cy="141" rx="44.5" ry="42" fill="none" stroke={INK} strokeWidth="1"/>
        <text x="184" y="158" textAnchor="middle" fontFamily={UI} fontWeight="900" fontSize="49" fill={INK}>2</text>
        <text x="259" y="159" fontSize={fit(p.title,57,1430)} fontWeight="700" fill={INK}>{typed(p.title,phase(t,0,.8))}</text>
        <text x="265" y="227" fontSize={fit(p.subtitle,43,1320)} fontWeight="700" fill={INK}>{typed(p.subtitle,phase(t,6.25,7.1))}</text>
      </g>

      <Robot t={t}/>

      <g transform="rotate(-.15 900 596)">
        <Line d={box(470,319,868,551,18)} p={mainP} width={4.1} fill={WHITE}/>
        <Line d="M472 375 Q884 372 1336 376" p={detailP} width={3}/>
        {[0,1,2].map(i=><circle key={i} cx={504+i*26} cy="347" r="7" stroke={INK} strokeWidth="2.5" fill={WHITE} opacity={detailP}/>)}
        <Line d={box(583,334,727,26,12)} p={detailP} width={2.3}/>
        <text x="603" y="354" fontFamily={UI} fontSize="20" fill="#7D786D" opacity={detailP}>{p.browserLabel}</text>

        <Line d={box(505,402,296,215,1)} p={detailP} width={3}/>
        <Line d="M510 610 L580 514 L638 575 L688 539 L796 612" p={pictureP} width={3.5}/>
        <circle cx="739" cy="453" r={23*ease(phase(t,4.5,4.8))} fill={GOLD} stroke={INK} strokeWidth="3"/>
        {p.fields.map((field,i)=><g key={i} opacity={detailP}>
          <text x="838" y={textY[i]-43} fontFamily={UI} fontSize="26" fill="#8C877B">{field.label}</text>
          <Line d={`M839 ${textY[i]+18} Q1070 ${textY[i]+16} 1301 ${textY[i]+19}`} p={detailP} stroke="#B8B0A2" width={1.45}/>
          <text x="838" y={textY[i]} fontSize={fit(field.value,38,395)} fontWeight="700" fill={INK}>{typed(field.value,fp[i])}</text>
          <Check x={Math.min(1284,857+units(field.value)*fit(field.value,38,395))} y={textY[i]-11} p={phase(t,ends[i],ends[i]+.16)} r={13}/>
        </g>)}
        <text x="505" y="676" fontFamily={UI} fontSize="26" fill="#8C877B" opacity={detailP}>{p.featuresTitle}</text>
        {p.features.map((s,i)=><g key={i} opacity={detailP}>
          <Line d={box(506,695+i*44,23,25,0)} p={detailP} width={2.5}/>
          <Check x={518} y={707+i*44} p={phase(t,4.9+i*.25,5.1+i*.25)} circle={false} r={13}/>
          <text x="545" y={716+i*44} fontSize={fit(s,31,260)} fill={INK} opacity={phase(t,4.85+i*.25,5.03+i*.25)}>{s}</text>
        </g>)}
        <text x="838" y="682" fontFamily={UI} fontSize="26" fill="#8C877B" opacity={detailP}>预览素材</text>
        {[0,1,2].map(i=><MiniPreview key={i} x={838+i*151} y={711} type={i} p={phase(t,5.55+i*.2,5.9+i*.2)}/>)}
      </g>

      {panelP>0 && <g transform="rotate(1.2 1575 650)">
        <Line d={box(1324,398,477,491,18)} p={panelP} width={3.7} fill={WHITE}/>
        <text x="1360" y="458" fontSize={fit(p.panelTitle,42,335)} fontWeight="700" fill={INK}>{typed(p.panelTitle,phase(t,7.0,7.38))}</text>
        <g opacity={phase(t,7.2,7.45)}><circle cx="1742" cy="441" r="13" stroke={INK} strokeWidth="2.9" fill="none"/><Line d="M1755 441l30 1v11m-10 -10v8" width={2.8}/></g>
        <Line d={box(1361,491,181,59,27)} p={phase(t,7.16,7.5)} width={2.6}/>
        <Line d={box(1562,491,200,59,27)} p={phase(t,7.25,7.6)} width={2.6}/>
        <path d="M1574 509Q1650 493 1755 505L1752 537Q1654 548 1571 536Z" fill={GOLD} opacity={phase(t,7.6,7.88)}/>
        <text x="1452" y="530" textAnchor="middle" fontSize="29" fill={INK} opacity={phase(t,7.3,7.55)}>{p.tabs[0]}</text>
        <text x="1662" y="530" textAnchor="middle" fontSize="29" fontWeight="700" fill={INK} opacity={phase(t,7.3,7.55)}>{p.tabs[1]}</text>
        <Line d="M1556 515C1557 477 1758 475 1771 515C1778 559 1580 573 1556 527" p={phase(t,7.7,8.0)} width={2.4}/>
        {p.settings.map((s,i)=><g key={i}>
          <text x="1364" y={596+i*99} fontFamily={UI} fontSize="26" fill="#8C877B" opacity={phase(t,7.45,7.8)}>{s.label}</text>
          <text x="1364" y={639+i*99} fontSize={fit(s.value,32,395)} fontWeight="600" fill={INK}>{typed(s.value,settingP[i])}</text>
          <Line d={`M1363 ${657+i*99} Q1577 ${655+i*99} 1766 ${658+i*99}`} p={phase(t,7.5,7.85)} width={1.4} stroke="#B8B0A2"/>
        </g>)}
        <Line d={box(1364,791,210,58,15)} p={phase(t,9.45,9.75)} width={2.8} fill={GOLD}/>
        <text x="1469" y="830" textAnchor="middle" fontSize="30" fontWeight="700" fill={INK} opacity={phase(t,9.6,9.8)}>{p.button}</text>
        <Check x={1618} y={820} p={doneP} r={18}/>
        <text x="1650" y="832" fontSize={fit(p.complete,31,120)} fontWeight="700" fill={INK} opacity={doneP}>{p.complete}</text>
      </g>}

      <Pencil x={pencilX} y={pencilY} angle={pencilAngle} opacity={phase(t,1.25,1.5)}/>
    </svg>
  </AbsoluteFill>;
};
