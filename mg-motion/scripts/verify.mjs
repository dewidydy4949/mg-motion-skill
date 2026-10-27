#!/usr/bin/env node
// Code and parameter checks only. This does not render or visually accept a video.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';

const skill=path.resolve(import.meta.dirname,'..');
const engine=path.join(skill,'assets/engine');
const require=createRequire(path.join(engine,'package.json'));
function run(args){
 const result=spawnSync(process.execPath,args,{cwd:skill,stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
const tsBin=path.join(path.dirname(require.resolve('typescript/package.json')),'bin/tsc');
run([tsBin,'--noEmit','--project',path.join(engine,'tsconfig.json')]);
const dir=path.join(skill,'scripts/tests');
run(['--experimental-strip-types','--test',...fs.readdirSync(dir).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>path.join(dir,name))]);
console.log('代码与参数检查通过；未渲染视频，未做视觉验收。');
