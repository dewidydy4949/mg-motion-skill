import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type IconName = 'person' | 'team' | 'briefcase' | 'money' | 'star' | 'calendar' | 'table' | 'check';
export type TableCell = string | {text: string; tag?: 'rose' | 'blue' | 'green' | 'violet' | 'amber'};
export type FocusColumn = {id: string; label: string; width?: number; icon?: IconName; align?: 'left' | 'right'; locked?: boolean};
export type TableFocusProps = {
  title: string;
  viewLabel: string;
  columns: FocusColumn[];
  rows: {id: string; cells: Record<string, TableCell>}[];
  focus: string[];
  question: string;
  closing: string;
  footnote: string;
  durationSeconds: number;
  dimOpacity?: number;
};

const FONT = 'Arial, "Noto Sans SC", "Microsoft YaHei", sans-serif';
const INK = '#242623';
const HEADER = '#8b8d89';
const GRID = '#eceeec';
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TAGS = {rose: ['#f3dee7', '#755762'], blue: ['#dcecf6', '#506a7c'], green: ['#e0ebe4', '#4b685a'], violet: ['#ebe2f4', '#685677'], amber: ['#f6e7cf', '#7d694a']};
const textOf = (cell: TableCell) => typeof cell === 'string' ? cell : cell.text;
const units = (text: string) => [...text].reduce((n, char) => n + (/[\u0000-\u00ff]/.test(char) ? (char === ' ' ? .3 : .57) : 1), 0);
const fit = (text: string, available: number, preferred: number) => Math.min(preferred, available / Math.max(1, units(text)));

export function validateTableFocus(p: TableFocusProps) {
  if (!p || !Array.isArray(p.columns) || !Array.isArray(p.rows)) throw new Error('P02：必须提供 columns 和 rows。');
  if (p.columns.length < 4 || p.columns.length > 7) throw new Error('P02：支持 4～7 列，请拆分更大的表。');
  if (p.rows.length < 3 || p.rows.length > 6) throw new Error('P02：支持 3～6 行，请分页展示。');
  if (new Set(p.columns.map(c => c.id)).size !== p.columns.length || new Set(p.rows.map(r => r.id)).size !== p.rows.length) throw new Error('P02：行与列的 id 必须分别唯一。');
  if (!Array.isArray(p.focus) || p.focus.length < 1 || p.focus.length > 2 || new Set(p.focus).size !== p.focus.length) throw new Error('P02：focus 应为 1～2 个不重复的相邻列。');
  const focused = p.focus.map(id => p.columns.findIndex(c => c.id === id)).sort((a,b) => a-b);
  if (focused.some(i => i < 0) || (focused.length === 2 && focused[1] !== focused[0]+1)) throw new Error('P02：焦点列必须存在，双列焦点必须相邻。');
  if (!Number.isFinite(p.durationSeconds) || p.durationSeconds < 8 || p.durationSeconds > 12) throw new Error('P02：durationSeconds 支持 8～12 秒。');
  if (p.dimOpacity !== undefined && (p.dimOpacity < .12 || p.dimOpacity > .5)) throw new Error('P02：dimOpacity 应为 0.12～0.5。');
  if (!p.title || units(p.title) > 22 || !p.closing || units(p.closing) > 22) throw new Error('P02：标题和结尾需为短句，最多约 22 个汉字宽度。');
  if (!p.question || p.question.split('\n').length > 3 || p.question.split('\n').some(s => units(s) > 10)) throw new Error('P02：提问最多 3 行，每行最多约 10 个汉字宽度。');
  if (!p.viewLabel || units(p.viewLabel) > 12 || units(p.footnote) > 64) throw new Error('P02：视图名或脚注过长。');
  if (p.columns.some(c => !c.id || !c.label || !Number.isFinite(c.width ?? 240) || (c.width ?? 240) < 150 || (c.width ?? 240) > 440)) throw new Error('P02：列需有 id/label，width 权重应为 150～440。');
  const total = p.columns.reduce((n,c) => n+(c.width ?? 240),0);
  p.columns.forEach(c => {
    const width = (c.width ?? 240)/total*1680;
    if (width < 150 || width > 600) throw new Error(`P02：列“${c.label}”分配后的宽度需为 150～600 像素，请调整各列 width 比例。`);
    if (fit(c.label,width-90-(c.locked ? 40 : 0),32) < 24) throw new Error(`P02：列标题“${c.label}”太长，请缩短或增加列宽。`);
    p.rows.forEach(r => {
      const cell = r.cells[c.id];
      if (cell === undefined || typeof textOf(cell) !== 'string' || /[\r\n]/.test(textOf(cell))) throw new Error(`P02：${r.id}/${c.id} 应有单行文字。`);
      if (fit(textOf(cell),width-44-(typeof cell !== 'string' && cell.tag ? 28 : 0),34) < 25) throw new Error(`P02：${r.id}/${c.id} 文字过长，请缩短、加宽或拆成另一页。`);
    });
  });
}

const Icon: React.FC<{name: IconName; size?: number}> = ({name,size=28}) => {
  const base = {width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  return <svg {...base}>
    {name === 'person' && <><circle cx="12" cy="7" r="4" fill="currentColor" stroke="none"/><path d="M4 22v-2a8 8 0 0 1 16 0v2" fill="currentColor" stroke="none"/></>}
    {name === 'team' && <><circle cx="12" cy="7" r="3" fill="currentColor"/><circle cx="4" cy="9" r="2" fill="currentColor"/><circle cx="20" cy="9" r="2" fill="currentColor"/><path d="M6 21v-3a6 6 0 0 1 12 0v3M1 19v-2a4 4 0 0 1 4-4M23 19v-2a4 4 0 0 0-4-4"/></>}
    {name === 'briefcase' && <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/></>}
    {name === 'money' && <><rect x="2" y="5" width="20" height="14"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/><path d="M2 9a4 4 0 0 0 4-4M18 5a4 4 0 0 0 4 4M2 15a4 4 0 0 1 4 4M18 19a4 4 0 0 1 4-4"/></>}
    {name === 'star' && <path d="m12 1 3.3 6.7 7.4 1.1-5.4 5.2 1.3 7.4-6.6-3.5-6.6 3.5 1.3-7.4L1.3 8.8l7.4-1.1z" fill="currentColor" stroke="none"/>}
    {name === 'calendar' && <><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M7 2v6M17 2v6"/></>}
    {name === 'table' && <><rect x="2" y="3" width="20" height="18" rx="3"/><path d="M2 9h20M2 15h20M9 3v18"/></>}
    {name === 'check' && <><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/></>}
  </svg>;
};

const Lock = () => <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:30,height:32,borderRadius:8,background:'#e9ebeb',color:'#858883',flexShrink:0}}><svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M5 8V5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.2"/><rect x="3" y="8" width="12" height="10" rx="2.5" fill="currentColor"/><path d="M9 12v3" stroke="#e9ebeb" strokeWidth="1.6"/></svg></span>;

const Cell: React.FC<{cell:TableCell;width:number;align:'left'|'right'}> = ({cell,width,align}) => {
  const text = textOf(cell);
  const tag = typeof cell !== 'string' ? cell.tag : undefined;
  const fontSize = fit(text,width-44-(tag?28:0),34);
  return <div style={{fontSize,fontWeight:400,whiteSpace:'nowrap',lineHeight:1.2,fontVariantNumeric:'tabular-nums',textAlign:align}}>{tag ? <span style={{display:'inline-block',padding:'3px 9px',borderRadius:5,background:TAGS[tag][0],color:TAGS[tag][1]}}>{text}</span> : text}</div>;
};

const Header: React.FC<{column:FocusColumn;width:number}> = ({column,width}) => <div style={{height:74,display:'flex',alignItems:'center',gap:11,padding:'0 18px',color:HEADER,borderBottom:`1.5px solid ${GRID}`,boxSizing:'border-box',whiteSpace:'nowrap'}}>
  <span style={{display:'flex',flexShrink:0}}><Icon name={column.icon ?? 'table'}/></span>
  <span style={{fontSize:fit(column.label,width-90-(column.locked?40:0),32),lineHeight:1.2}}>{column.label}</span>
  {column.locked && <Lock/>}
</div>;

export const TableFocus: React.FC<TableFocusProps> = (p) => {
  validateTableFocus(p);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame/(fps*p.durationSeconds);
  const ease = (from:number,to:number) => interpolate(t,[from,to],[0,1],{...CLAMP,easing:Easing.bezier(.22,1,.36,1)});
  const widths = p.columns.map(c => (c.width ?? 240)/p.columns.reduce((s,col)=>s+(col.width??240),0)*1680);
  const lefts = widths.map((_,i) => widths.slice(0,i).reduce((a,b)=>a+b,0));
  const focused = p.focus.map(id=>p.columns.findIndex(c=>c.id===id)).sort((a,b)=>a-b);
  const first = focused[0];
  const fullFocusWidth = focused.reduce((s,i)=>s+widths[i],0);
  const rowH = Math.min(84,480/p.rows.length);
  const tableH = 74+p.rows.length*rowH;
  const maxZoom = Math.min(2.15,970/tableH,1320/fullFocusWidth);
  const zoomIn = ease(.14,.19);
  const finalPhase = t >= .70;
  const returnProgress = ease(.70,.79);
  const zoom = finalPhase ? 1+.28*(1-returnProgress) : 1+(maxZoom-1)*zoomIn;
  const focusCenter = lefts[first]+fullFocusWidth/2;
  const tx = finalPhase ? interpolate(returnProgress,[0,1],[960-focusCenter*1.28,120]) : interpolate(zoomIn,[0,1],[120,960-focusCenter*maxZoom]);
  const ty = finalPhase ? interpolate(returnProgress,[0,1],[540-tableH*1.28/2,356]) : interpolate(zoomIn,[0,1],[356,540-tableH*maxZoom/2]);
  const tableOpacity = finalPhase ? ease(.70,.735) : 1-ease(.385,.415);
  const soloOpacity = ease(.385,.42)*(1-ease(.68,.715));
  const selectOpacity = ease(.045,.07)*(1-ease(.37,.405));
  const selectWidth = widths[first]+(fullFocusWidth-widths[first])*ease(.09,.12);
  const dim = finalPhase ? 1 : 1-zoomIn*(1-(p.dimOpacity??.22));
  const soloScale = Math.min(1.58,760/tableH,600/widths[first]);
  const soloWidth = widths[first]*soloScale;
  const soloX = 290;
  const soloY = (1080-tableH*soloScale)/2;
  const questionX = soloX+soloWidth+130;
  const questionW = 1920-questionX-140;
  const questionSize = Math.min(...p.question.split('\n').map(line=>fit(line,questionW,90)));
  return <AbsoluteFill style={{background:'#fff',fontFamily:FONT,color:INK,overflow:'hidden'}}>
    <div style={{position:'absolute',left:120,top:164,display:'flex',alignItems:'center',gap:22,opacity:(1-zoomIn)*(1-ease(.375,.4))}}>
      <div style={{width:42,height:58,borderRadius:10,background:'#e78b1b',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="person" size={29}/></div>
      <div style={{fontSize:70,fontWeight:700,letterSpacing:-2,lineHeight:1.15}}>{p.title}</div>
    </div>
    <div style={{position:'absolute',left:120,top:267,height:58,padding:'0 18px',borderRadius:29,background:'#f5f5f4',display:'flex',alignItems:'center',gap:12,fontSize:29,opacity:(1-zoomIn)*(1-ease(.375,.4))}}><Icon name="table" size={28}/>{p.viewLabel}</div>
    <div style={{position:'absolute',left:0,top:0,width:1680,height:tableH,transform:`translate(${tx}px,${ty}px) scale(${zoom})`,transformOrigin:'0 0',opacity:tableOpacity}}>
      <div style={{position:'absolute',left:lefts[first],top:0,width:selectWidth,height:tableH,boxSizing:'border-box',background:'#edf5fc',border:'2px solid #3b8dcc',borderRadius:3,opacity:selectOpacity}}/>
      {p.columns.map((c,i)=><div key={c.id} style={{position:'absolute',left:lefts[i],top:0,width:widths[i],height:tableH,opacity:focused.includes(i)?1:dim,borderLeft:i?`1.2px solid ${GRID}`:undefined,boxSizing:'border-box'}}>
        <Header column={c} width={widths[i]}/>
        {p.rows.map((r,j)=><div key={r.id} style={{height:rowH,padding:'0 18px',boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:c.align==='right'?'flex-end':'flex-start',borderBottom:j<p.rows.length-1?`1.2px solid ${GRID}`:undefined}}><Cell cell={r.cells[c.id]} width={widths[i]} align={c.align??'left'}/></div>)}
      </div>)}
    </div>
    <div style={{position:'absolute',inset:0,opacity:soloOpacity}}>
      <div style={{position:'absolute',left:soloX,top:soloY,width:widths[first],height:tableH,transform:`scale(${soloScale})`,transformOrigin:'0 0',borderLeft:`1.4px solid ${GRID}`,borderRight:`1.4px solid ${GRID}`}}>
        <Header column={p.columns[first]} width={widths[first]}/>
        {p.rows.map((r,j)=><div key={r.id} style={{height:rowH,padding:'0 18px',boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:p.columns[first].align==='right'?'flex-end':'flex-start',borderBottom:j<p.rows.length-1?`1.2px solid ${GRID}`:undefined}}><Cell cell={r.cells[p.columns[first].id]} width={widths[first]} align={p.columns[first].align??'left'}/></div>)}
      </div>
      <div style={{position:'absolute',left:questionX,top:368,width:questionW,fontSize:questionSize,fontWeight:700,lineHeight:1.16,letterSpacing:-2,whiteSpace:'pre-line',transform:`translateY(${(1-ease(.41,.455))*18}px)`}}>{p.question}</div>
    </div>
    <div style={{position:'absolute',top:164,left:110,right:110,textAlign:'center',fontSize:76,fontWeight:700,lineHeight:1.15,letterSpacing:-2,opacity:ease(.70,.765)}}>{p.closing}</div>
    <div style={{position:'absolute',bottom:20,left:40,right:40,textAlign:'center',fontSize:22,color:'#9b9e99',letterSpacing:.2,lineHeight:1.3,background:'#fff'}}>{p.footnote}</div>
  </AbsoluteFill>;
};
