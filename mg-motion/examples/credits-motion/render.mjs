import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';

const dir=import.meta.dirname;
const engine=path.resolve(dir,'../../assets/engine');
const req=createRequire(path.join(engine,'package.json'));
const args={};
for(let i=2;i<process.argv.length;i++){
  const flag=process.argv[i];
  if(!['--out','--browser','--work-dir','--still'].includes(flag)||!process.argv[i+1])throw new Error('Usage: node examples/credits-motion/render.mjs --out video.mp4 --browser ChromePath [--work-dir folder] [--still seconds]');
  args[flag.slice(2)]=process.argv[++i];
}
if(!args.out)throw new Error('--out is required');
const output=path.resolve(args.out);
if(fs.existsSync(output))throw new Error('Output exists; use a new filename.');
const work=path.resolve(args['work-dir']??path.join(dir,'work'));
fs.mkdirSync(work,{recursive:true});fs.mkdirSync(path.dirname(output),{recursive:true});
const {bundle}=req('@remotion/bundler');
const {selectComposition,renderMedia,renderStill}=req('@remotion/renderer');
const serveUrl=await bundle({entryPoint:path.join(dir,'entry.tsx'),outDir:path.join(work,'bundle'),webpackOverride:config=>({...config,resolve:{...config.resolve,modules:[path.join(engine,'node_modules'),...(config.resolve?.modules??['node_modules'])]}})});
const browserExecutable=args.browser??process.env.MG_BROWSER_EXECUTABLE;
const composition=await selectComposition({serveUrl,id:'Credits-Motion-Study',browserExecutable});
if(args.still!==undefined){
  const time=Number(args.still);if(!Number.isFinite(time)||time<0||time>=20)throw new Error('--still must be 0 <= seconds < 20');
  await renderStill({serveUrl,composition,output,browserExecutable,frame:Math.round(time*30),imageFormat:'png'});
}else{
  let last=-1;
  await renderMedia({serveUrl,composition,outputLocation:output,browserExecutable,codec:'h264',crf:18,concurrency:2,onProgress:({progress})=>{const p=Math.floor(progress*10);if(p!==last){last=p;console.log(`render ${p*10}%`);}}});
}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync(output+'.manifest.json',JSON.stringify({kind:'directed-motion-study',composition:composition.id,width:composition.width,height:composition.height,fps:composition.fps,frames:composition.durationInFrames,sourceSha256:hash(path.join(dir,'entry.tsx')),outputSha256:hash(output),audio:false,visualReviewed:false,notes:'Project-specific motion study. This is not a universal motion grammar or automatic script planner.'},null,2)+'\n');
console.log(output);
