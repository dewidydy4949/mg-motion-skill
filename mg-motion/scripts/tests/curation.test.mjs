import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {validateReferenceLibrary,browseReferences,describeReference} from '../references.mjs';

const root=path.resolve(import.meta.dirname,'../..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'references',name+'.json'),'utf8').replace(/^\uFEFF/,''));
const catalog=read('catalog'),selection=read('selection'),compatibility=read('compatibility'),library=read('reference-library');
test('published reference index retains every registered template and covers each expression with a core example',()=>{
 validateReferenceLibrary(library,catalog);
 assert.deepEqual(library.references.map(r=>r.id).sort(),catalog.templates.map(t=>t.id).sort());
 assert.equal(library.references.filter(r=>r.tier==='core').length,library.curation.coreCount);
 assert.equal(library.references.filter(r=>r.tier==='extended').length,library.curation.extendedCount);
 for(const key of Object.keys(library.expressions))assert(library.references.some(r=>r.tier==='core'&&r.expressions.includes(key)),key);
 const defaultList=browseReferences(catalog,selection,compatibility,library);assert.equal(defaultList.candidates.length,library.curation.coreCount);assert.equal(defaultList.detailLevel,'browse-summary');
 assert.equal(browseReferences(catalog,selection,compatibility,library,'',{all:true}).candidates.length,catalog.templates.length);
});
test('all published references point to existing previews, cards and source and retain direct-use semantics',()=>{
 for(const item of library.references){const row=describeReference(catalog,selection,compatibility,library,item.id);for(const key of ['preview','card','modelSource'])assert(fs.statSync(path.join(root,row[key])).isFile(),item.id+' '+key);const rule=compatibility.templates.find(r=>r.id===item.id);assert.deepEqual(row.directUse.forbiddenIntents,rule.forbiddenIntents??[]);assert(item.evidence.length>0);}
});
