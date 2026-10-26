import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Comparison, ComparisonProps, validateComparison} from './Comparison';

export const referenceProps:ComparisonProps={
  badge:'03 · 公平竞技',
  title:'同一份数据，',
  emphasis:'同一套提示词',
  subtitle:'只提供客观事实，局势判断全靠 AI 自己',
  sourceName:'prompt · state.json',
  codeLines:[
    '{',
    '  "game": "gomoku",',
    '  "you": "black",',
    '  "board": [ …15×15, 18 stones… ],',
    '  "legalMoves": [ "H7", "J8", "G9", … ],',
    '  "consequences": {',
    '    "J8": "makes four (J5–J8)",',
    '    "G9": "blocks open three"',
    '  },',
    '  "goal": "WIN"',
    '}',
  ],
  models:[
    {name:'GPT-6 Sol',short:'GPT',color:'#259e88'},
    {name:'Claude Opus 5.5',short:'Opus',color:'#bb7863'},
    {name:'Gemini 3.1 Pro',short:'Gem',color:'#5682d7'},
    {name:'Kimi K3',short:'Kimi',color:'#7261d3'},
    {name:'DeepSeek V4 Pro',short:'DS',color:'#4e67d6'},
    {name:'Jev 1.13',short:'Jev',color:'#29a18e'},
  ],
  principles:[
    {text:'统一英文提示词，不为任何模型单独优化',kind:'check'},
    {text:'完整局面 + 合法走法 + 每步直接后果',kind:'check'},
    {text:'不评分、不推荐走法',kind:'cross'},
  ],
};

export const usageProps:ComparisonProps={
  badge:'01 · 对比方法',
  title:'同一段资料，',
  emphasis:'比较不同回答',
  subtitle:'先统一输入和要求，再观察内容是否准确、清晰',
  sourceName:'brief · 会议摘要任务',
  codeLines:[
    '{',
    '  "资料": "一段会议记录",',
    '  "任务": "提炼关键决定与待办",',
    '  "输出要求": [',
    '    "保留事实，不补充未知信息",',
    '    "列出负责人和截止时间",',
    '    "缺少的信息标为待确认"',
    '  ],',
    '  "篇幅": "不超过 200 字"',
    '}',
  ],
  models:[
    {name:'模型 A',short:'A',color:'#27b69b',detail:'同一资料 · 同一要求'},
    {name:'模型 B',short:'B',color:'#bc896c',detail:'同一资料 · 同一要求'},
    {name:'模型 C',short:'C',color:'#7087e2',detail:'同一资料 · 同一要求'},
  ],
  principles:[
    {text:'检查事实是否保留',kind:'check'},
    {text:'观察表达是否清晰',kind:'check'},
    {text:'不预设优胜结果',kind:'cross'},
  ],
  demoLabel:'复用验证 · 内容为演示任务，未展示模型实测结果',
};

validateComparison(referenceProps);
validateComparison(usageProps);

const Root:React.FC=()=> <>
  <Composition id="P01-Reference" component={Comparison} width={1920} height={1080} fps={30} durationInFrames={225} defaultProps={referenceProps}/>
  <Composition id="P01-Usage" component={Comparison} width={1920} height={1080} fps={30} durationInFrames={255} defaultProps={usageProps}/>
</>;

registerRoot(Root);
