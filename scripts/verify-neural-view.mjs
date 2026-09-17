import fs from 'node:fs';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const data=JSON.parse(fs.readFileSync('src/data/neuralStructures.json','utf8'));
const bytes=fs.readFileSync('public/brain.glb');
const model=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const ids=new Set();let meshes=0;
model.scene.traverse(o=>{
  if(!o.isMesh)return;
  meshes++;
  if(o.userData.structureId)ids.add(o.userData.structureId);
  assert([...o.geometry.attributes.position.array].every(Number.isFinite));
  assert(o.geometry.attributes.normal,`${o.name} has normals`);
});
for(const entry of [...data.tracts,...data.cranialNerves])assert(ids.has(entry.id),entry.id);
const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const errors=[];
try{
  const page=await browser.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1440,height:1000});
  await page.goto('http://127.0.0.1:5174/neuroatlas/',{waitUntil:'domcontentloaded',timeout:15000}).catch(()=>{});
  await page.waitForSelector('canvas');
  await new Promise(r=>setTimeout(r,2500));
  const clickText=async(text)=>{
    for(const button of await page.$$('button'))if((await button.evaluate(n=>n.textContent)).includes(text)){await button.click();return;}
    throw new Error('Missing button '+text);
  };
  await clickText('الأعصاب القحفية I');
  for(const entry of data.cranialNerves){
    await page.click(`[data-structure-id="${entry.id}"]`);
    await page.waitForFunction(text=>document.querySelector('.neural-explanation')?.textContent.includes(text),{},entry.function);
  }
  await page.click('[data-structure-id="cn-05"]');
  await new Promise(r=>setTimeout(r,800));
  await page.screenshot({path:'artifacts/brain/cranial-desktop.png'});
  console.log('Verified all 12 cranial descriptions');
  await clickText('حزم الألياف · 5');
  for(const entry of data.tracts){
    await page.click(`[data-structure-id="${entry.id}"]`);
    await page.waitForFunction(text=>document.querySelector('.neural-explanation')?.textContent.includes(text),{},entry.function);
  }
  await page.click('[data-structure-id="tract-arcuate"]');
  await new Promise(r=>setTimeout(r,600));
  await page.screenshot({path:'artifacts/brain/fiber-functions.png'});
  console.log('Verified all 5 tract descriptions');
  await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  await page.waitForSelector('canvas');
  await page.click('.mobile-tool-tabs button:nth-child(2)');
  await page.click('.mobile-explorer-controls [data-structure-id="cn-12"]');
  await new Promise(r=>setTimeout(r,600));
  await page.screenshot({path:'artifacts/brain/cranial-mobile.png'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'no horizontal overflow');
  assert.equal(errors.length,0,errors.join('\n'));
  console.log(JSON.stringify({meshes,structureIds:ids.size,nerveDescriptions:12,tractDescriptions:5,errors},null,2));
}finally{await browser.close();}
