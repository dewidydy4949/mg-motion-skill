import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {initializeProject,loadProject,parseArgs,runProject,projectSources} from '../project.mjs';

const testRoot=path.resolve(import.meta.dirname,'../../work/project-tests');
const temp=()=>{fs.mkdirSync(testRoot,{recursive:true});return fs.mkdtempSync(path.join(testRoot,'case-'));};
const clean=dir=>{const resolved=path.resolve(dir);assert(resolved.startsWith(testRoot+path.sep)&&path.basename(resolved).startsWith('case-'));fs.rmSync(resolved,{recursive:true,force:true});};

test('init creates an isolated editable project and never overwrites user files',()=>{
 const base=temp(),dir=path.join(base,'new');
 try{
  const result=initializeProject(dir);assert.equal(result.config.composition,'Supplement');
  const entry=loadProject(dir).entry;fs.appendFileSync(entry,'\n// user edit\n');
  assert.throws(()=>initializeProject(dir),/已存在/);assert(fs.readFileSync(entry,'utf8').endsWith('// user edit\n'));
  assert(fs.existsSync(path.join(dir,'brief.md')));assert(fs.existsSync(path.join(dir,'public','.gitkeep')));assert(!fs.existsSync(path.join(dir,'node_modules')));
 }finally{clean(base);}
});
test('project selection does not bind custom scenes to a legacy template or beat schema',()=>{
 const base=temp(),dir=path.join(base,'custom');
 try{initializeProject(dir);const file=path.join(dir,'project.json');const config=JSON.parse(fs.readFileSync(file,'utf8'));config.composition='My-30-Second-Scene';fs.writeFileSync(file,JSON.stringify(config));assert.equal(loadProject(dir).config.composition,'My-30-Second-Scene');}finally{clean(base);}
});
test('missing and escaping project entry paths are rejected before bundling',()=>{
 const base=temp(),dir=path.join(base,'new');
 try{initializeProject(dir);const file=path.join(dir,'project.json');for(const entry of ['../outside.tsx','missing.tsx']){fs.writeFileSync(file,JSON.stringify({schemaVersion:1,entry,composition:'X'}));assert.throws(()=>loadProject(dir),/入口不存在|目录中/);}}finally{clean(base);}
});
test('unsupported flags, invalid concurrency and invalid still times cannot be ignored',()=>{
 for(const args of [['render','--dir','x','--out','a','--template','MG-013'],['init','--dir','x','--overwrite'],['still','--dir','x','--out','a','--time','-1'],['render','--dir','x','--out','a','--concurrency','0'],['render','--dir','x','--out','a','--concurrency','1.5']])assert.throws(()=>parseArgs(args));
 assert.equal(parseArgs(['still','--dir','x','--out','a','--time','0']).options.time,'0');
});
test('existing outputs and non-object props are rejected before dependencies and browser work',async()=>{
 const base=temp(),dir=path.join(base,'new');
 try{initializeProject(dir);const output=path.join(base,'keep.mp4');fs.writeFileSync(output,'keep');await assert.rejects(runProject('render',{dir,out:output}),/已存在/);assert.equal(fs.readFileSync(output,'utf8'),'keep');const props=path.join(base,'props.json');fs.writeFileSync(props,'[]');await assert.rejects(runProject('render',{dir,out:path.join(base,'new.mp4'),props}),/JSON 对象/);}finally{clean(base);}
});
test('project fingerprints include helper sources outside src but exclude generated work',()=>{
 const base=temp(),dir=path.join(base,'new');
 try{initializeProject(dir);fs.mkdirSync(path.join(dir,'components'));fs.writeFileSync(path.join(dir,'components/helper.ts'),'export const x=1;');fs.mkdirSync(path.join(dir,'work'));fs.writeFileSync(path.join(dir,'work/bundle.js'),'cache');const p=loadProject(dir),before=projectSources(p);assert(before['components/helper.ts']);assert(!before['work/bundle.js']);fs.writeFileSync(path.join(dir,'components/helper.ts'),'export const x=2;');assert.notEqual(projectSources(p)['components/helper.ts'],before['components/helper.ts']);}finally{clean(base);}
});
test('wrong media suffixes and existing sidecar records fail without overwriting',async()=>{
 const base=temp(),dir=path.join(base,'new');
 try{initializeProject(dir);await assert.rejects(runProject('still',{dir,out:path.join(base,'x.jpg'),time:'0'}),/png/);await assert.rejects(runProject('render',{dir,out:path.join(base,'x.mov')}),/mp4/);const out=path.join(base,'x.mp4');fs.writeFileSync(out+'.manifest.json','keep');await assert.rejects(runProject('render',{dir,out}),/已存在/);assert.equal(fs.readFileSync(out+'.manifest.json','utf8'),'keep');}finally{clean(base);}
});
