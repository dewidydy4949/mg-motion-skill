import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const skill=path.resolve(import.meta.dirname,'../..');
const cli=path.join(skill,'scripts/mg.mjs');
const run=(args)=>spawnSync(process.execPath,[cli,...args],{cwd:skill,encoding:'utf8'});

test('inspect exposes actual family and semantics used by filtering',()=>{
 const r=run(['inspect','MG-022']);assert.equal(r.status,0,r.stderr);
 const item=JSON.parse(r.stdout);assert.equal(item.compatibility.family,'legacy-mg-022');
 assert(item.compatibility.semanticIntents.includes('threshold'));
});
test('single render intent is audited before loading browser or rendering output',()=>{
 const r=run(['check','MG-022','--intent','expiry','--browser','missing-browser.exe']);
 assert.notEqual(r.status,0);assert.match(r.stderr,/不支持 expiry/);assert.doesNotMatch(r.stderr,/Chrome 路径不存在/);
});
test('selection flags cannot silently disappear on unrelated commands',()=>{
 for(const args of [['params','MG-020','--intent','ordinal'],['check','MG-020','--family','legacy-mg-020'],['audit','--plan','assets/examples/story.json','--intent','expiry']]){
  const r=run(args);assert.notEqual(r.status,0);assert.match(r.stderr,/仅用于/);
 }
});
test('story starter can be exported and audited without a browser or video',()=>{
 const work=path.join(skill,'work');fs.mkdirSync(work,{recursive:true});
 const temp=fs.mkdtempSync(path.join(work,'cli-test-'));const file=path.join(temp,'story.json');
 try {
  const created=run(['story','--out',file]);assert.equal(created.status,0,created.stderr);
  const audit=run(['audit','--plan',file]);assert.equal(audit.status,0,audit.stderr);
  const result=JSON.parse(audit.stdout);assert.equal(result.frames,600);assert.equal(result.visualReviewed,false);
  const p=JSON.parse(fs.readFileSync(file,'utf8'));p.beats[1].metric.change='threshold';fs.writeFileSync(file,JSON.stringify(p));
  assert.notEqual(run(['audit','--plan',file]).status,0);
 } finally {if(fs.existsSync(file))fs.unlinkSync(file);fs.rmdirSync(temp);}
});
