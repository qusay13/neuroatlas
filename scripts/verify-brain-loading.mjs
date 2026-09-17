import fs from 'node:fs';
import assert from 'node:assert/strict';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3 } from 'three';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
import puppeteer from 'puppeteer';

async function inspect(path) {
 const b=fs.readFileSync(path);
 const {scene}=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
 scene.updateMatrixWorld(true);
 const meshes=[]; let triangles=0;
 scene.traverse(o=>{ if(!o.isMesh)return;
  triangles+=(o.geometry.index?.count || o.geometry.attributes.position.count)/3;
  assert([...o.geometry.attributes.position.array].every(Number.isFinite));
  meshes.push({name:o.name,extras:o.userData,box:new Box3().setFromObject(o)});
 });
 return {bytes:b.length,triangles,meshes};
}
const original=await inspect('public/brain.glb');
const optimized=await inspect('public/brain-optimized.glb');
assert.equal(optimized.triangles,original.triangles,'triangle topology retained');
assert.equal(optimized.meshes.length,original.meshes.length);
const bounds=new Map(original.meshes.map(m=>[m.name,m]));
let maxBoundsDelta=0;
for(const mesh of optimized.meshes){
 const source=bounds.get(mesh.name);assert(source,mesh.name);assert.deepEqual(mesh.extras,source.extras);
 for(const end of ['min','max']) for(const axis of ['x','y','z']) maxBoundsDelta=Math.max(maxBoundsDelta,Math.abs(mesh.box[end][axis]-source.box[end][axis]));
}
assert(maxBoundsDelta<1,'quantization bounds delta under one source unit');
assert(optimized.bytes < original.bytes*0.45);
console.log(JSON.stringify({originalBytes:original.bytes,optimizedBytes:optimized.bytes,meshes:optimized.meshes.length,triangles:optimized.triangles,maxBoundsDelta},null,2));
const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
fs.mkdirSync('artifacts/loading',{recursive:true});
try {
 const page=await browser.newPage();
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('Browser:',e.message);});
 await page.setRequestInterception(true);
 let held;let requests=0;let released=false;
 page.on('request',r=>{
  if(r.url().endsWith('brain-optimized.glb')){requests++; if(released)return r.continue(); held=r;return;}
  if(r.url().startsWith('http://127.0.0.1:5174/') || r.url().startsWith('data:'))r.continue();else r.abort();
 });
 const modelRequest=page.waitForRequest(r=>r.url().endsWith('brain-optimized.glb'));
 await page.goto('http://127.0.0.1:5174/neuroatlas/',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.brain-loading');
 assert(await page.$eval('.brain-loading',e=>e.textContent.includes('جارٍ تجهيز')));
 await page.screenshot({path:'artifacts/loading/mobile-loading.png'});
 await modelRequest;
 assert(held,'model request held to simulate slow download');
 released=true;await held.continue();
 await page.waitForSelector('[data-model-ready="true"]',{timeout:30000});
 await page.waitForSelector('.brain-loading',{hidden:true});
 await page.screenshot({path:'artifacts/loading/mobile-ready.png'});
 assert.equal(requests,1,'one model download');
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('Slow download: loading indicator visible, disappears on readiness; one model request; no JS errors.');
 // A separate page forces a failed GLB load, then verifies retry works.
 const retry=await browser.newPage();await retry.setViewport({width:390,height:844,isMobile:true});
 await retry.setRequestInterception(true);let shouldFail=true;
 retry.on('request',r=>{
  if(r.url().endsWith('brain-optimized.glb'))return shouldFail?r.abort('failed'):r.continue();
  return r.url().startsWith('http://127.0.0.1:5174/')||r.url().startsWith('data:')?r.continue():r.abort();
 });
 await retry.goto('http://127.0.0.1:5174/neuroatlas/',{waitUntil:'domcontentloaded'});
 await retry.waitForSelector('.brain-loading-error');shouldFail=false;
 await retry.click('.brain-loading-error button');
 await retry.waitForSelector('[data-model-ready="true"]',{timeout:30000});
 await retry.waitForSelector('.brain-loading',{hidden:true});
 console.log('Failed download: clear error message and retry successfully restores the model.');
} finally {await browser.close();}
