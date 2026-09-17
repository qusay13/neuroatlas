import assert from 'node:assert/strict';
import fs from 'node:fs';
import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const errors=[];
const output='artifacts/mobile'; fs.mkdirSync(output,{recursive:true});
try {
 const page=await browser.newPage();
 await page.setRequestInterception(true);
 page.on('request', request => request.url().startsWith('http://127.0.0.1:5174/') || request.url().startsWith('data:') ? request.continue() : request.abort()); page.on('pageerror',e=>errors.push(e.message));
 const click=async(text,scope='button')=>{
  const found=await page.$$(scope);
  for(const b of found) if(await b.evaluate((e,t)=>e.getClientRects().length>0 && e.textContent.trim().includes(t),text)){await b.click();return;}
  throw new Error(`Missing visible button ${text}`);
 };
 const noOverlap=()=>page.evaluate(()=>{
  const canvas=document.querySelector('.brain-viewport').getBoundingClientRect();
  const controls=document.querySelector('.mobile-explorer-controls').getBoundingClientRect();
  return controls.top>=canvas.bottom-1 && document.documentElement.scrollWidth<=innerWidth;
 });
 for(const width of [320,390,768,844]) {
  await page.setViewport({width,height:width===844?390:844,isMobile:true,hasTouch:true});
  await page.goto('http://127.0.0.1:5174/neuroatlas/',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('canvas');
  assert(await noOverlap(),`initial ${width}`);
  await click('الأعصاب','.mobile-tool-tabs button');
  await page.waitForSelector('.mobile-explorer-controls .neural-guide');
  await page.click('.mobile-explorer-controls [data-structure-id="cn-12"]');
  assert(await page.$eval('.mobile-explorer-controls .neural-explanation',e=>e.textContent.includes('تحت اللسان')));
  assert(await noOverlap(),`nerve ${width}`);
  if(width===390) { await page.evaluate(()=>scrollTo(0,0)); await page.screenshot({path:`${output}/390-nerve.png`,fullPage:true}); }
  await click('اقرأ المعلومات');
  assert.equal(await page.$('.mobile-explorer-controls .neural-guide'),null);
  await click('الارتباطات السريرية','.clinical-inline button');
  assert(await noOverlap(),`info ${width}`);
  await click('طي المعلومات');
  await page.select('select[aria-label="اختر منطقة الدماغ"]','frontal');
  assert(await page.$eval('.mobile-selection',e=>e.textContent.includes('الجبهي')));
  await click('العرض','.mobile-tool-tabs button');
  await click('الشفافية','.mobile-view-options button');
  assert.equal(await page.$eval('.mobile-view-options button',e=>e.getAttribute('aria-pressed')),'true');
  await click('إعادة ضبط','.mobile-tool-tabs button');
  assert.equal(await page.$eval('select[aria-label="اختر منطقة الدماغ"]',e=>e.value),'');
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`${output}/${width}.png`,fullPage:true});
  await page.click('[aria-label="القائمة الرئيسية"]');
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  await page.waitForFunction(()=>Math.abs(document.querySelector('aside').getBoundingClientRect().right-innerWidth)<1);
  await click('المصطلحات الطبية','aside button');
  await page.waitForFunction(()=>!document.body.textContent.includes('جارٍ تحميل القسم'));
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log(`Mobile ${width}: layout, nerve selection, details, controls, reset, navigation passed`);
 }
 await page.setViewport({width:1440,height:1000});
 await page.goto('http://127.0.0.1:5174/neuroatlas/',{waitUntil:'domcontentloaded'});
 await click('الأعصاب القحفية I');
 await page.waitForSelector('.neural-guide');
 await page.screenshot({path:`${output}/desktop.png`});
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('Desktop and browser error checks passed');
} finally { await browser.close(); }
