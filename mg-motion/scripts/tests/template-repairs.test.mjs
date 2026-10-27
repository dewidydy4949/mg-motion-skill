import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {after, test} from 'node:test';

const skill=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const engine=path.join(skill,'assets/engine');
const require=createRequire(path.join(engine,'package.json'));
const esbuild=require('esbuild');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const clockKey='__mgTemplateRegressionFrame';
globalThis[clockKey]=30;
after(()=>delete globalThis[clockKey]);

// These are deterministic component/parameter tests, not rendered-video tests.
// Stub only the frame context; real React renders the actual template markup.
async function loadTemplate(id){
  const result=await esbuild.build({
    entryPoints:[path.join(engine,'src/batch',id,'model.tsx')],
    bundle:true,write:false,platform:'node',format:'cjs',logLevel:'silent',external:['react'],
    plugins:[{name:'test-frame-context',setup(build){
      build.onResolve({filter:/^remotion$/},()=>({path:'remotion',namespace:'test'}));
      build.onLoad({filter:/.*/,namespace:'test'},()=>({loader:'js',contents:`
        const React=require('react');
        exports.useCurrentFrame=()=>globalThis.${clockKey};
        exports.useVideoConfig=()=>({fps:30,durationInFrames:600,width:1920,height:1080});
        exports.spring=({frame})=>Math.min(1,Math.max(0,frame/8));
        exports.AbsoluteFill=({children,...props})=>React.createElement('div',props,children);
        exports.Img=props=>React.createElement('img',props);
        exports.staticFile=value=>value;
      `}));
    }}],
  });
  const module={exports:{}};
  new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);
  return module.exports;
}

const example=id=>JSON.parse(fs.readFileSync(path.join(skill,'assets/params',id+'-usage.json'),'utf8').replace(/^\uFEFF/,''));
const markup=(template,props)=>renderToStaticMarkup(React.createElement(template.Template,props));

test('MG-020 preserves ordinal/static numbers while actual metrics can count up',async()=>{
  const m=await loadTemplate('MG-020'),p=example('MG-020');
  const ordinal={value:3,decimals:0,suffix:'看产能',label:'积分能出几条',color:'#6579be',numberMode:'ordinal'};
  for(const progress of [0,.1,.5,1]) assert.equal(m.statDisplayValue(ordinal,progress),'3');
  assert.equal(m.statDisplayValue({...ordinal,numberMode:'static'},0),'3');
  assert.equal(m.statDisplayValue({...ordinal,numberMode:'metric'},0),'0');
  assert.equal(m.statDisplayValue({...ordinal,value:100,numberMode:'metric'},.5),'50');
  m.validateProps({...p,stats:[ordinal,{...ordinal,value:2}]});
  for(const invalid of [{value:0},{value:1.5},{decimals:1},{numberMode:'counter'}]){
    assert.throws(()=>m.validateProps({...p,stats:[{...ordinal,...invalid},ordinal]}));
  }
  assert(!markup(m,p).includes('PRODUCT INSIGHTS'));
  assert(markup(m,{...p,footerLabel:'测试页脚'}).includes('测试页脚'));
});

test('MG-022 keeps threshold semantics and correct labels in both directions',async()=>{
  const m=await loadTemplate('MG-022'),p=example('MG-022');
  const descending={...p,before:95,after:70,threshold:90,beforeLabel:'起点已达标',afterLabel:'终点未达标'};
  assert.equal(m.thresholdState(descending,95,0).detail,'起点已达标');
  assert.equal(m.thresholdState(descending,70,1).detail,'终点未达标');
  assert.equal(m.thresholdState(p,p.before,0).detail,p.beforeLabel);
  assert.equal(m.thresholdState(p,p.after,1).detail,p.afterLabel);
  assert.throws(()=>m.validateProps({...p,meaning:'expiry'}),/只表达百分比阈值判断/);
  assert.throws(()=>m.validateProps({...p,passLabel:''}));
  assert(!markup(m,p).includes('STATUS'));
  assert(markup(m,{...p,passLabel:'已通过',failLabel:'待通过',thresholdLabel:'目标线',statusHeading:'任务状态'}).includes('目标线'));
});

test('MG-032 displays the supplied punctuation without adding its own question',async()=>{
  const m=await loadTemplate('MG-032'),p=example('MG-032');
  const items=p.items.map((item,i)=>({...item,label:i===p.items.length-1?'照样买贵':item.label}));
  globalThis[clockKey]=590;
  const original=markup(m,{...p,items});
  assert(original.includes('照样买贵</div>'));
  assert(!original.includes('照样买贵？'));
  items[items.length-1].label='照样买贵？';
  assert(markup(m,{...p,items}).includes('照样买贵？</div>'));
});

test('MG-047 hides default demo copy and accepts explicit, validated labels',async()=>{
  const m=await loadTemplate('MG-047'),p=example('MG-047');
  const clean=markup(m,p);
  for(const label of ['04 / LINKS CARRY MEANING','这一页讲什么？','这段文字没有描述目标内容']){
    assert(!clean.includes(label));
  }
  const custom=markup(m,{...p,eyebrow:'选择依据',targetPrompt:'共同目标',irrelevantLabel:'不适用'});
  for(const label of ['选择依据','共同目标','不适用']) assert(custom.includes(label));
  assert.throws(()=>m.validateProps({...p,eyebrow:'长'.repeat(41)}));
  assert.throws(()=>m.validateProps({...p,targetPrompt:123}));
});
