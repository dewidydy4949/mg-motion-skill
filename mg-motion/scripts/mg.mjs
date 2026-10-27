#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {recommend} from './select.mjs';
import {auditPlan} from './plan-audit.mjs';

const skill=path.resolve(import.meta.dirname,'..');
const json=(p)=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const save=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');};
const fail=(m)=>{throw new Error(m);};
const sha=(file)=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function engineSources(engine){
 const files={};
 function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.isFile())files[path.relative(engine,file).split(path.sep).join('/')]=sha(file);}}
 walk(path.join(engine,'src'));files['package-lock.json']=sha(path.join(engine,'package-lock.json'));
 const sorted=Object.fromEntries(Object.keys(files).sort().map(key=>[key,files[key]]));
 return {files:sorted,sha256:crypto.createHash('sha256').update(JSON.stringify(sorted)).digest('hex')};
}
const help=`MG Motion
  node scripts/mg.mjs list [关键词]
  node scripts/mg.mjs match "表达目标" [--intent 意图] [--family 风格族] [--media image|video] [--duration 秒]
  node scripts/mg.mjs story --out story.json
  node scripts/mg.mjs audit --plan story.json
  node scripts/mg.mjs inspect MG-014
  node scripts/mg.mjs params MG-014 --out params.json [--variant usage|reference]
  node scripts/mg.mjs check MG-014 --params params.json
  node scripts/mg.mjs render MG-014 --params params.json --out video.mp4
  node scripts/mg.mjs compose --plan shots.json --out video.mp4
  node scripts/mg.mjs still MG-014 --params params.json --time 5 --out frame.png
  node scripts/mg.mjs still --plan shots.json --time 12 --out frame.png
Options: --duration 秒 --browser Chrome路径 --engine 工程路径 --work-dir 临时目录
         --assets 资源映射JSON --overwrite --concurrency 1
Story plans share one visual system; legacy shots retain their individual designs.
No voice or music is generated. See references/story.md and references/rendering.md.`;

async function loadStorySchema(engine){
 const req=createRequire(path.join(engine,'package.json'));
 let esbuild;
 try {esbuild=req('esbuild');} catch {fail('缺少依赖，请在 '+engine+' 执行 npm ci --ignore-scripts --no-audit --no-fund');}
 // The schema is intentionally standalone: the browser and CLI use the same validator.
 const source=fs.readFileSync(path.join(engine,'src/story/schema.ts'),'utf8');
 const compiled=esbuild.transformSync(source,{loader:'ts',format:'esm',target:'es2020'}).code;
 return import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
}

async function main(){
 const [cmd,...argv]=process.argv.slice(2); if(!cmd||cmd==='help'||cmd==='--help'){console.log(help);return;}
 const options={},pos=[];
 const allowed=new Set(['out','variant','params','plan','duration','browser','engine','work-dir','assets','overwrite','time','concurrency','media','limit','intent','family']);
 for(let i=0;i<argv.length;i++){
  const a=argv[i]; if(!a.startsWith('--')){pos.push(a);continue;}
  const key=a.slice(2);if(!allowed.has(key))fail('未知参数 '+a);
  if(key==='overwrite'){options[key]=true;continue;}
  if(!argv[i+1]||argv[i+1].startsWith('--'))fail(a+' 缺少值');options[key]=argv[++i];
 }
 if(options.family&&cmd!=='match')fail('--family 仅用于 match；计划的风格声明写在 JSON 中');
 if(options.intent&&cmd!=='match'&&(!['check','render','still'].includes(cmd)||options.plan))fail('--intent 仅用于 match 或单条 check/render/still；计划请逐镜头填写 semanticIntent');
 const catalog=json(path.join(skill,'references/catalog.json'));
 const compatibility=json(path.join(skill,'references/compatibility.json'));
 if(cmd==='story'){
  if(!options.out)fail('story 需要 --out');
  const out=path.resolve(options.out);
  if(fs.existsSync(out)&&!options.overwrite)fail('输出已存在，请换名称或使用 --overwrite');
  save(out,json(path.join(skill,'assets/examples/story.json')));console.log(out);return;
 }
 if(cmd==='match'){
  const selection=json(path.join(skill,'references/selection.json'));
  console.log(JSON.stringify(recommend(catalog,selection,pos.join(' '),options,compatibility),null,2));return;
 }
 const lookup=(id)=>catalog.templates.find(t=>t.id===id)||fail('未知模板 '+id);
 const variant=options.variant||'usage';if(!['usage','reference'].includes(variant))fail('variant 仅支持 usage 或 reference');
 if(cmd==='list'){
  const terms=pos.join(' ').toLowerCase().split(/\s+/).filter(Boolean);
  console.log(JSON.stringify(catalog.templates.filter(t=>terms.every(q=>JSON.stringify(t).toLowerCase().includes(q))).map(({id,title,style,category,usageSeconds,status})=>({id,title,style,category,usageSeconds,status})),null,2));return;
 }
 if(['inspect','params'].includes(cmd)){
  const item=lookup(pos[0]);const props=json(path.join(skill,`assets/params/${item.id}-${variant}.json`));
  if(cmd==='inspect'){const selection=json(path.join(skill,'references/selection.json')).templates.find(t=>t.id===item.id);const rules=compatibility.templates.find(t=>t.id===item.id);console.log(JSON.stringify({...item,selection,compatibility:rules,defaultProps:props},null,2));return;}
  if(!options.out)fail('params 需要 --out');const out=path.resolve(options.out);
  if(fs.existsSync(out)&&!options.overwrite)fail('输出已存在，请换名称或使用 --overwrite');save(out,props);console.log(out);return;
 }
 if(!['audit','check','render','compose','still'].includes(cmd))fail('未知命令 '+cmd+'\n'+help);
 if(['audit','compose'].includes(cmd)&&!options.plan)fail(cmd+' 需要 --plan');
 if(options.plan&&options.params)fail('--plan 与 --params 不能同时使用');
 if(options.plan&&options.duration)fail('计划中的时长请逐镜头设置 durationSeconds');
 const engine=path.resolve(options.engine||path.join(skill,'assets/engine'));
 let input,baseDir,assets={};
 if(options.plan){
  const p=path.resolve(options.plan),plan=json(p);const {assets:planAssets,...body}=plan;
  input=body;assets=planAssets||{};baseDir=path.dirname(p);
  if(input.mode!=='story'){
   if(!Array.isArray(input.shots))fail('计划缺少 shots 数组');input.shots.forEach(s=>lookup(s.templateId));
  }
 } else {
  lookup(pos[0]);input={templateId:pos[0],variant,props:options.params?json(path.resolve(options.params)):{}};
  if(options.intent)input.semanticIntent=options.intent;
  if(options.duration!==undefined){input.durationSeconds=Number(options.duration);if(!Number.isFinite(input.durationSeconds)||input.durationSeconds<=0)fail('--duration 必须为正数');}
  baseDir=options.params?path.dirname(path.resolve(options.params)):process.cwd();
 }
 if(options.assets){const p=path.resolve(options.assets);assets=json(p);baseDir=path.dirname(p);}
 if(!assets||typeof assets!=='object'||Array.isArray(assets))fail('assets 必须为名称到本地路径的对象');
 const isStory=input.mode==='story';
 const projectEngine=Boolean(options.engine)&&engine!==path.join(skill,'assets/engine')&&engineSources(engine).sha256!==catalog.engineSha256;
 const audit=auditPlan(options.plan?input:{shots:[input]},compatibility,{projectEngine});
 if(!audit.valid)fail(audit.errors.map(e=>e.message).join('\n'));
 let storySummary;
 if(isStory){
  const schema=await loadStorySchema(engine);schema.validateStory(input);
  storySummary={frames:schema.storyFrames(input,30),seconds:schema.storyFrames(input,30)/30};
 }
 for(const warning of audit.warnings)console.error('编排提示：'+warning.message);
 if(cmd==='audit'){
  console.log(JSON.stringify({...audit,...storySummary,scope:isStory?'story-parameters-and-timing':'declared-template-compatibility',visualReviewed:false},null,2));return;
 }
 const req=createRequire(path.join(engine,'package.json'));
 let bundle,selectComposition,renderMedia,renderStill;
 try {({bundle}=req('@remotion/bundler'));({selectComposition,renderMedia,renderStill}=req('@remotion/renderer'));}
 catch {fail('缺少渲染依赖。请在 '+engine+' 执行 npm ci --ignore-scripts --no-audit --no-fund');}
 const originalInput=structuredClone(input),jobId=crypto.randomUUID();
 const assetRecords=[];
 function stage(value){
  if(typeof value==='string'&&value.startsWith('asset:')){
   const name=value.slice(6),file=assets[name];if(typeof file!=='string')fail('找不到资源 '+name);
   const src=path.resolve(baseDir,file);if(!fs.existsSync(src)||!fs.statSync(src).isFile())fail('资源不存在 '+src);
   let record=assetRecords.find(a=>a.name===name);
   if(!record){
    const ext=path.extname(src).toLowerCase();if(!['.png','.jpg','.jpeg','.webp','.gif','.svg','.mp4','.webm','.mov'].includes(ext))fail('不支持的素材格式 '+ext);
    const relative=`mg-jobs/${jobId}/${assetRecords.length}${ext}`,target=path.join(engine,'public',relative);
    fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(src,target);
    record={name,source:src,staged:relative,sha256:crypto.createHash('sha256').update(fs.readFileSync(src)).digest('hex')};assetRecords.push(record);
   }
   return 'mg-static:'+record.staged;
  }
  if(Array.isArray(value))return value.map(stage);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,stage(v)]));
  return value;
 }
 input=stage(input);
 let out;
 if(cmd!=='check'){
  if(!options.out)fail(cmd+' 需要 --out');out=path.resolve(options.out);
  const ext=path.extname(out).toLowerCase();
  if(cmd==='still'?!['.png','.jpg','.jpeg'].includes(ext):ext!=='.mp4')fail('视频输出需为 .mp4；静帧输出需为 .png 或 .jpg');
  for(const candidate of [out,out+'.manifest.json',out+'.input.json'])if(fs.existsSync(candidate)&&!options.overwrite)fail('输出已存在：'+candidate+'；换名称或使用 --overwrite');
  fs.mkdirSync(path.dirname(out),{recursive:true});
 }
 const scratch=path.resolve(options['work-dir']||path.join(out?path.dirname(out):process.cwd(),'work','mg-render'));
 const bundleDir=path.join(scratch,'bundle-'+jobId);
 const engineState=engineSources(engine);
 const browser=options.browser||process.env.MG_BROWSER_EXECUTABLE;
 if(browser&&!fs.existsSync(browser))fail('Chrome 路径不存在 '+browser);
 const concurrency=Number(options.concurrency||1);if(!Number.isInteger(concurrency)||concurrency<1||concurrency>8)fail('concurrency 需为 1–8 的整数');
 console.error('准备渲染工程与参数校验…');
 const serveUrl=await bundle({entryPoint:path.join(engine,'src/skill/entry.tsx'),outDir:bundleDir,rootDir:engine,publicDir:path.join(engine,'public'),enableCaching:true});
 const composition=await selectComposition({serveUrl,id:isStory?'MG-Story':options.plan?'MG-Timeline':'MG-Single',inputProps:input,browserExecutable:browser,logLevel:'error'});
 const summary={composition:composition.id,width:composition.width,height:composition.height,fps:composition.fps,frames:composition.durationInFrames,seconds:composition.durationInFrames/composition.fps};
 if(cmd==='check'){console.log(JSON.stringify({valid:true,...summary,planAudit:audit,visualReviewed:false},null,2));return;}
 const tmp=path.join(path.dirname(out),'.'+path.basename(out,path.extname(out))+'-'+jobId+path.extname(out));
 const common={serveUrl,composition,inputProps:input,browserExecutable:browser,logLevel:'error'};
 if(cmd==='still'){
  const seconds=Number(options.time??0),frame=Math.round(seconds*composition.fps);
  if(!Number.isFinite(seconds)||frame<0||frame>=composition.durationInFrames)fail('--time 超出镜头范围');
  await renderStill({...common,output:tmp,frame,imageFormat:path.extname(out).toLowerCase()==='.png'?'png':'jpeg'});
  summary.stillFrame=frame;
 } else {
  let last=-1;
  await renderMedia({...common,outputLocation:tmp,codec:'h264',pixelFormat:'yuv420p',concurrency,offthreadVideoThreads:1,onProgress:({progress})=>{const tick=Math.floor(progress*10);if(tick>last){last=tick;console.error('渲染 '+Math.min(100,tick*10)+'%');}}});
 }
 if(!fs.statSync(tmp).size)fail('渲染输出为空');
 fs.copyFileSync(tmp,out);fs.unlinkSync(tmp);
 const ids=isStory?[]:options.plan?input.shots.map(s=>s.templateId):[input.templateId];
 const inputRecord=assetRecords.length?{...originalInput,assets:Object.fromEntries(assetRecords.map(a=>[a.name,a.source]))}:originalInput;
 save(out+'.input.json',inputRecord);
 save(out+'.manifest.json',{schemaVersion:2,skillVersion:catalog.version,mode:input.mode||(options.plan?'sequence':'single'),planAudit:audit,engineSha256:engineState.sha256,catalogEngineSha256:catalog.engineSha256,engineMatchesCatalog:engineState.sha256===catalog.engineSha256,createdAt:new Date().toISOString(),...summary,output:out,sha256:sha(out),templates:[...new Set(ids)].map(id=>{const t=lookup(id);return {id,version:t.version,modelSha256:engineState.files[t.modelSource]??null,catalogModelSha256:t.modelSha256};}),assets:assetRecords,visualReviewed:false,audio:'本命令不生成旁白或音乐',notes:'渲染成功与视觉验收是两个步骤；修改参数后需检查关键帧与收尾。'});
 console.log(JSON.stringify({output:out,...summary,manifest:out+'.manifest.json'},null,2));
}
main().catch(error=>{console.error('MG 错误：'+error.message);process.exitCode=1;});
