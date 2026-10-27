#!/usr/bin/env node
// A small rendering bridge for project-authored Remotion scenes; no prescribed visual grammar.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const skill=path.resolve(import.meta.dirname,'..');
const engine=path.join(skill,'assets/engine');
const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
const writeJson=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const help=`Project-authored MG scenes
  node scripts/project.mjs init --dir <new-project>
  node scripts/project.mjs check --dir <project> --browser <Chrome>
  node scripts/project.mjs render --dir <project> --out <video.mp4> --browser <Chrome>
  node scripts/project.mjs still --dir <project> --time 3 --out <image.png> --browser <Chrome>
Options: --props <object.json> --work-dir <cache-dir> --concurrency 2 --overwrite
init creates an empty canvas. Design the scene in src/entry.tsx before rendering.
The project uses this skill's locked engine dependencies; audio is supplied by the project.`;

export function parseArgs(argv){
 const [command,...rest]=argv;
 if(!command||command==='help'||command==='--help')return {command:'help',options:{}};
 if(!['init','check','render','still'].includes(command))throw new Error('未知项目命令：'+command);
 const allowed={init:['dir'],check:['dir','browser','props','work-dir'],render:['dir','browser','props','work-dir','out','concurrency','overwrite'],still:['dir','browser','props','work-dir','out','time','overwrite']}[command];
 const options={};
 for(let i=0;i<rest.length;i++){
  const key=rest[i].slice(2);
  if(!rest[i].startsWith('--')||!allowed.includes(key))throw new Error(command+' 不支持参数 '+rest[i]);
  if(Object.hasOwn(options,key))throw new Error('重复参数 --'+key);
  if(key==='overwrite'){options[key]=true;continue;}
  if(!rest[i+1]||rest[i+1].startsWith('--'))throw new Error('--'+key+' 缺少值');
  options[key]=rest[++i];
 }
 if(!options.dir)throw new Error('需要 --dir 项目目录');
 if(['render','still'].includes(command)&&!options.out)throw new Error('需要 --out 输出路径');
 if(command==='still'&&(options.time===undefined||!Number.isFinite(Number(options.time))||Number(options.time)<0))throw new Error('--time 需要非负秒数');
 if(options.concurrency!==undefined&&(!Number.isInteger(Number(options.concurrency))||Number(options.concurrency)<1||Number(options.concurrency)>16))throw new Error('--concurrency 需要 1–16 的整数');
 return {command,options};
}

export function initializeProject(dir){
 const root=path.resolve(dir);
 if(fs.existsSync(root))throw new Error('项目目录已存在，保留现有文件；请选择新目录');
 fs.mkdirSync(path.join(root,'src'),{recursive:true});
 fs.mkdirSync(path.join(root,'public'));
 fs.writeFileSync(path.join(root,'public','.gitkeep'),'');
 const project={schemaVersion:1,entry:'src/entry.tsx',composition:'Supplement',description:'文案补画面项目；在 brief.md 记录文案、参考和适配思路'};
 writeJson(path.join(root,'project.json'),project);
 fs.writeFileSync(path.join(root,'brief.md'),'# 项目记录\n\n写入用户文案与目标时长（估算应注明），选用的参考及借鉴之处、整段如何推进。\n参考片的时长不限定新片时长；项目结构和动作由内容决定。\n\n完成后记录实际检查过的时间点、发现与修改。\n');
 fs.writeFileSync(path.join(root,'src/entry.tsx'),`import React from 'react';
import {AbsoluteFill, Composition, registerRoot} from 'remotion';

// 空白工程，不是成片模板。在这里根据文案与所选参考实现画面和动作。
// 可新增组件、SVG、素材、声音、Sequence 或镜头；没有固定的布局或动作 schema。
const Supplement: React.FC = () => <AbsoluteFill style={{background: '#ffffff'}} />;
const Root = () => <Composition id="Supplement" component={Supplement} width={1920} height={1080} fps={30} durationInFrames={300} />;
registerRoot(Root);
`);
 return {project:root,config:project,note:'已创建空白工程。先写入实际场景，再 check/render；空白画布不是成片。'};
}

export function loadProject(dir){
 const root=path.resolve(dir),file=path.join(root,'project.json');
 if(!fs.existsSync(file))throw new Error('缺少 project.json，请先 init 或指定正确目录');
 const config=readJson(file);
 if(config.schemaVersion!==1||typeof config.entry!=='string'||typeof config.composition!=='string'||!config.composition.trim())throw new Error('project.json 需要 schemaVersion:1、entry 和 composition');
 const entry=path.resolve(root,config.entry),relative=path.relative(root,entry);
 if(path.isAbsolute(relative)||relative==='..'||relative.startsWith('..'+path.sep))throw new Error('entry 必须位于项目目录中');
 if(!fs.existsSync(entry)||!fs.statSync(entry).isFile())throw new Error('项目入口不存在：'+entry);
 const publicDir=path.join(root,'public');
 if(!fs.existsSync(publicDir))throw new Error('缺少项目 public 目录；素材放在该目录并用 staticFile 引用');
 return {root,config,entry,publicDir};
}

export function projectSources(project,{work,output}={}){
 const files={};
 const generated=new Set(['node_modules','.git','.cache','work','out','outputs','dist']);
 const excluded=new Set([work,output,output&&output+'.input.json',output&&output+'.manifest.json'].filter(Boolean).map(p=>path.resolve(p)));
 const walk=(dir,all=false)=>{if(!fs.existsSync(dir))return;for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(excluded.has(path.resolve(file)))continue;if(entry.isDirectory()){if(!generated.has(entry.name))walk(file,all||file===project.publicDir||file===path.join(project.root,'src'));}else if(entry.isFile()&&(all||/\.(?:[cm]?[jt]sx?|json|css|scss|svg)$/.test(entry.name))&&!/\.(?:input|manifest)\.json$/.test(entry.name))files[path.relative(project.root,file).split(path.sep).join('/')]=hash(file);}};
 walk(project.root);
 files['project.json']=hash(path.join(project.root,'project.json'));
 files[path.relative(project.root,project.entry).split(path.sep).join('/')]=hash(project.entry);
 if(fs.existsSync(path.join(project.root,'brief.md')))files['brief.md']=hash(path.join(project.root,'brief.md'));
 return Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)));
}

export async function runProject(command,options){
 const project=loadProject(options.dir);
 const output=options.out?path.resolve(options.out):null;
 if(output&&path.extname(output).toLowerCase()!==(command==='still'?'.png':'.mp4'))throw new Error(command==='still'?'still 输出需要 .png 后缀':'render 输出需要 .mp4 后缀');
 if(output&&[output,output+'.input.json',output+'.manifest.json'].some(file=>fs.existsSync(file))&&!options.overwrite)throw new Error('输出或运行记录已存在；选择新文件或传 --overwrite');
 const props=options.props?readJson(path.resolve(options.props)):{};
 if(!props||typeof props!=='object'||Array.isArray(props))throw new Error('--props 文件必须是 JSON 对象');
 const browserExecutable=options.browser??process.env.MG_BROWSER_EXECUTABLE;
 if(browserExecutable&&!fs.existsSync(browserExecutable))throw new Error('Chrome 路径不存在：'+browserExecutable);
 const req=createRequire(path.join(engine,'package.json'));
 let bundle,renderer;
 try{({bundle}=req('@remotion/bundler'));renderer=req('@remotion/renderer');}catch{throw new Error('缺少依赖；请在 '+engine+' 执行 npm ci --ignore-scripts --no-audit --no-fund');}
 const work=path.resolve(options['work-dir']??path.join(project.root,'work'));
 fs.mkdirSync(work,{recursive:true});
 const serveUrl=await bundle({entryPoint:project.entry,rootDir:project.root,enableCaching:false,publicDir:project.publicDir,outDir:path.join(work,'bundle-'+crypto.randomUUID()),webpackOverride:config=>({...config,resolve:{...config.resolve,modules:[path.join(engine,'node_modules'),...(config.resolve?.modules??['node_modules'])]}})});
 const composition=await renderer.selectComposition({serveUrl,id:project.config.composition,inputProps:props,browserExecutable});
 const seconds=composition.durationInFrames/composition.fps;
 const summary={composition:composition.id,width:composition.width,height:composition.height,fps:composition.fps,frames:composition.durationInFrames,seconds};
 if(command==='check'){
  await renderer.renderStill({serveUrl,composition,inputProps:props,browserExecutable,frame:0,output:path.join(work,'check-frame.png'),imageFormat:'png'});
  return {...summary,valid:true,visualReviewed:false,note:'已加载实际合成并渲染第0帧；不代表动作、文字与美感已通过检查。'};
 }
 fs.mkdirSync(path.dirname(output),{recursive:true});
 const temporary=path.join(path.dirname(output),'.'+path.basename(output)+'.'+crypto.randomUUID()+'.partial'+path.extname(output));
 const operation={command};
 try {
 if(command==='still'){
  const frame=Math.round(Number(options.time)*composition.fps);
  if(frame>=composition.durationInFrames)throw new Error('--time 超出合成；最后可用帧时间为 '+(composition.durationInFrames-1)/composition.fps);
  Object.assign(operation,{requestedTimeSeconds:Number(options.time),frame,sampleTimeSeconds:frame/composition.fps});
  await renderer.renderStill({serveUrl,composition,inputProps:props,browserExecutable,frame,output:temporary,imageFormat:'png'});
 }else{
  let last=-1;
  await renderer.renderMedia({serveUrl,composition,inputProps:props,browserExecutable,outputLocation:temporary,codec:'h264',crf:18,concurrency:Number(options.concurrency??2),onProgress:({progress})=>{const n=Math.floor(progress*10);if(n!==last){last=n;process.stderr.write('渲染 '+n*10+'%\n');}}});
 }
 const sources=projectSources(project,{work,output});
 const sourceSha256=crypto.createHash('sha256').update(JSON.stringify(sources)).digest('hex');
 writeJson(temporary+'.input.json',{project:project.config,props,operation});
 writeJson(temporary+'.manifest.json',{schemaVersion:1,mode:'project',operation,...summary,sourceSha256,sources,engineLockSha256:hash(path.join(engine,'package-lock.json')),outputSha256:hash(temporary),audio:'由项目源码决定，本工具不自动配音或配乐',visualReviewed:false,createdAt:new Date().toISOString()});
 fs.renameSync(temporary,output);
 fs.renameSync(temporary+'.input.json',output+'.input.json');
 fs.renameSync(temporary+'.manifest.json',output+'.manifest.json');
 return {...summary,output,manifest:output+'.manifest.json',visualReviewed:false};
 } finally {for(const file of [temporary,temporary+'.input.json',temporary+'.manifest.json'])if(fs.existsSync(file))fs.unlinkSync(file);}
}

export async function main(argv=process.argv.slice(2)){
 const {command,options}=parseArgs(argv);
 if(command==='help'){console.log(help);return;}
 const result=command==='init'?initializeProject(options.dir):await runProject(command,options);
 console.log(JSON.stringify(result,null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(error=>{console.error(error.message);process.exitCode=1;});
