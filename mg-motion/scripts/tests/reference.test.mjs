import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {browseReferences, describeReference, validateReferenceLibrary} from '../references.mjs';
import {recommend} from '../select.mjs';

const skill=path.resolve(import.meta.dirname,'../..');
const read=name=>JSON.parse(fs.readFileSync(path.join(skill,'references',name+'.json'),'utf8').replace(/^\uFEFF/,''));
const catalog=read('catalog'),selection=read('selection'),compatibility=read('compatibility');
const ids=catalog.templates.map(row=>row.id).sort();
const library={schemaVersion:1,expressions:{
 emphasis:{label:'强调与引入',description:'建立重点',keywords:['强调','引入','标题']},
 comparison:{label:'比较与选择',description:'相同维度的比较',keywords:['比较','选择','对比']},
 change:{label:'数量与状态变化',description:'明确的前后状态',keywords:['到期','变化','数量']},
},references:ids.map((id,i)=>({
 id,tier:i<30?'core':'extended',expressions:[['emphasis','comparison','change'][i%3]],
 learn:['对象如何进入','重点如何变化'],adapt:'适配到用户内容后检查',reason:i<30?'默认参考':'相近表达的备用参考',related:[ids[(i+1)%ids.length]],evidence:['preview','card'],
}))};
const browse=(query='',options={})=>browseReferences(catalog,selection,compatibility,library,query,options);

test('reference browsing defaults to all curated core entries and retains extended entries on request',()=>{
 const core=browse();assert.equal(core.totalMatches,30);assert.equal(core.candidates.length,30);
 assert(core.candidates.every(row=>row.tier==='core'));
 const all=browse('',{all:true});assert.equal(all.totalMatches,50);assert.equal(all.candidates.length,50);
 assert.equal(all.scope,'all-references');assert.equal(browse('   ').candidates.length,30);
 assert.equal(core.detailLevel,'browse-summary');assert.equal(core.candidates[0].directUse,undefined);
 assert.equal(typeof core.candidates[0].learnSummary,'string');assert(fs.existsSync(path.join(skill,core.candidates[0].preview)));
});

test('expression browsing applies explicit categories and exposes counts before selection',()=>{
 const result=browse('',{expression:'comparison'});
 assert(result.candidates.length>0);assert(result.candidates.every(row=>row.expressions.includes('comparison')));
 const menu=result.expressions.find(row=>row.key==='comparison');assert.equal(menu.coreCount,result.totalMatches);assert(menu.totalCount>menu.coreCount);
 assert.equal(browse('',{expression:'comparison',all:true}).totalMatches,menu.totalCount);
});

test('query search is a limited shortlist and can use expression vocabulary without exact template wording',()=>{
 const result=browse('需要突出强调');assert(result.totalMatches>5);assert.equal(result.candidates.length,5);
 assert(result.candidates.every(row=>row.expressions.includes('emphasis')));
 assert(result.candidates.every(row=>row.matchedExpressionTerms.includes('强调')));
 assert.equal(browse('需要突出强调',{limit:2}).candidates.length,2);
});

test('a reference shorter than a 20 or 30 second brief remains available without implying direct reuse at that length',()=>{
 for(const seconds of [20,30]){
  const result=browse(`${seconds}秒讲解，借鉴 MG-016`);
  assert.equal(result.candidates[0].id,'MG-016');
  assert(result.candidates[0].originDuration.catalogSampleSeconds<seconds);
 }
 const result=browse('30秒讲解，借鉴 MG-016');
 assert(result.candidates[0].directUse.duration.max<30);
 assert.equal(recommend(catalog,selection,'MG-016',{duration:30},compatibility).candidates.length,0);
 assert.throws(()=>browse('强调',{duration:30}),/refs 不支持 --duration/);
});

test('extended references require explicit inclusion even when an exact ID is requested',()=>{
 const id=ids.at(-1);assert.equal(browse(id).totalMatches,0);
 const result=browse(id,{all:true});assert.equal(result.candidates[0].id,id);assert.equal(result.candidates[0].tier,'extended');
 // ID matching does not confuse a longer identifier with a known reference.
 assert.equal(browse(id+'0',{all:true}).totalMatches,0);
});

test('unmatched queries stay empty instead of silently substituting a template',()=>{
 const result=browse('zzquux_unrelated_material_932');assert.equal(result.totalMatches,0);assert.deepEqual(result.candidates,[]);
 assert.equal(result.expressions.length,3);
});

test('references expose real preview, source and replay paths while separating design use from semantic reuse constraints',()=>{
 const row=describeReference(catalog,selection,compatibility,library,'MG-022');
 for(const key of ['preview','card','modelSource'])assert(fs.existsSync(path.join(skill,row[key])),row[key]);
 assert.equal(row.previewKind,'rendered-template-still');assert.equal(row.source.originalVideoIncluded,false);
 assert.match(row.referenceRender.command,/render MG-022 --variant reference/);
 assert.equal(row.directUse.status,'requires-content-and-render-check');
 assert(row.directUse.semanticIntents.includes('threshold'));assert(row.directUse.forbiddenIntents.includes('expiry'));
 assert.equal(row.directUse.family,'legacy-mg-022');assert.deepEqual(row.learn,['对象如何进入','重点如何变化']);
 assert.equal(describeReference(catalog,selection,compatibility,{...library,references:[]},'MG-022'),null);
});

test('invalid discovery options and damaged reference relationships fail explicitly',()=>{
 for(const options of [{expression:'typo'},{expression:''},{limit:0},{limit:51},{limit:2.5},{all:'yes'},{media:'video'}])assert.throws(()=>browse('',options));
 const duplicate=structuredClone(library);duplicate.references.push(duplicate.references[0]);assert.throws(()=>validateReferenceLibrary(duplicate,catalog),/重复/);
 const broken=structuredClone(library);broken.references[0].related=['MG-999'];assert.throws(()=>validateReferenceLibrary(broken,catalog),/related/);
 const category=structuredClone(library);category.references[0].expressions=['not-defined'];assert.throws(()=>validateReferenceLibrary(category,catalog),/分类/);
});

// Isolate CLI tests from the library currently being curated in the checkout.
const work=path.join(skill,'work');fs.mkdirSync(work,{recursive:true});
const temp=fs.mkdtempSync(path.join(work,'reference-cli-'));
const tracked=[];
const write=(relative,content)=>{const file=path.join(temp,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);tracked.push(file);};
for(const name of ['mg.mjs','references.mjs','select.mjs','plan-audit.mjs'])write('scripts/'+name,fs.readFileSync(path.join(skill,'scripts',name)));
for(const [name,value] of Object.entries({catalog,selection,compatibility,'reference-library':library}))write('references/'+name+'.json',JSON.stringify(value));
write('assets/params/MG-022-usage.json',fs.readFileSync(path.join(skill,'assets/params/MG-022-usage.json')));
const run=args=>spawnSync(process.execPath,[path.join(temp,'scripts/mg.mjs'),...args],{cwd:temp,encoding:'utf8'});
after(()=>{
 for(const file of tracked)if(fs.existsSync(file))fs.unlinkSync(file);
 for(const directory of ['assets/params','assets','references','scripts',''])fs.rmdirSync(path.join(temp,directory));
});

test('refs CLI can browse and inspect with no renderer dependencies',()=>{
 const result=run(['refs']);assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).candidates.length,30);
 const filtered=run(['refs','--expression','comparison','--all','--limit','2']);assert.equal(filtered.status,0,filtered.stderr);assert.equal(JSON.parse(filtered.stdout).candidates.length,2);
 const inspect=run(['inspect','MG-022']);assert.equal(inspect.status,0,inspect.stderr);const row=JSON.parse(inspect.stdout);assert.equal(row.reference.id,'MG-022');assert.equal(row.compatibility.family,'legacy-mg-022');
 assert(row.reference.directUse.forbiddenIntents.includes('expiry'));assert(fs.existsSync(path.join(skill,row.reference.modelSource)));
});

test('reference-only flags cannot silently alter unrelated CLI commands and refs rejects duration filtering',()=>{
 for(const args of [['match','测试','--expression','comparison'],['list','--all'],['params','MG-022','--all'],['inspect','MG-022','--expression','change']]){
  const result=run(args);assert.notEqual(result.status,0);assert.match(result.stderr,/仅用于 refs/);
 }
 const duration=run(['refs','强调','--duration','30']);assert.notEqual(duration.status,0);assert.match(duration.stderr,/refs 不支持 --duration/);
 const unknown=run(['refs','--expression','missing']);assert.notEqual(unknown.status,0);assert.match(unknown.stderr,/未知 --expression/);
});

test('a missing reference library produces a specific error while legacy inspection stays usable',()=>{
 const file=path.join(temp,'references/reference-library.json'),saved=fs.readFileSync(file);fs.unlinkSync(file);
 try{
  const result=run(['refs']);assert.notEqual(result.status,0);assert.match(result.stderr,/缺少 references\/reference-library.json/);
  const inspect=run(['inspect','MG-022']);assert.equal(inspect.status,0,inspect.stderr);assert.equal(JSON.parse(inspect.stdout).reference,null);
 }finally{fs.writeFileSync(file,saved);}
});
