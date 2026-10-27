import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';

const skill=path.resolve(import.meta.dirname,'../..');
const engine=path.join(skill,'assets/engine');
const require=createRequire(path.join(engine,'package.json'));
const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const catalog=json(path.join(skill,'references/catalog.json'));

test('all 100 legacy default parameter sets still validate and match their exported examples',async()=>{
 const result=await require('esbuild').build({entryPoints:[path.join(engine,'src/skill/registry.ts')],bundle:true,write:false,format:'cjs',platform:'node',packages:'external',logLevel:'silent'});
 const module={exports:{}};
 new Function('require','module','exports',result.outputFiles[0].text)(require,module,module.exports);
 const {registry}=module.exports;
 assert.equal(Object.keys(registry).length,catalog.templates.length);
 for(const template of catalog.templates){
  for(const variant of ['reference','usage']){
   const exported=json(path.join(skill,'assets/params',`${template.id}-${variant}.json`));
   assert.deepEqual(registry[template.id][variant],exported,`${template.id} ${variant}: defaults drifted`);
   assert.doesNotThrow(()=>registry[template.id].validate(exported),`${template.id} ${variant}`);
  }
 }
});

test('catalog source fingerprints describe the exact published engine',()=>{
 const files={};
 function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.isFile())files[path.relative(engine,p).split(path.sep).join('/')]=hash(p);}}
 walk(path.join(engine,'src'));files['package-lock.json']=hash(path.join(engine,'package-lock.json'));
 const sorted=Object.fromEntries(Object.keys(files).sort().map(k=>[k,files[k]]));
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(sorted)).digest('hex'),catalog.engineSha256);
 for(const item of catalog.templates)assert.equal(hash(path.join(engine,item.modelSource)),item.modelSha256,item.id);
});
