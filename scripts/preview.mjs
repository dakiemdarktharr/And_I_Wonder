import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('test-results', {recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
page.on('pageerror',e=>errors.push(e.message));
for(const [name,path] of [['home','/'],['calendar','/daily'],['projects','/projects'],['library','/resources'],['reader','/daily/2026-10-08']]){
 await page.goto(base+path);
 await page.locator('main, article.note-reader').first().waitFor();
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`test-results/${name}.png`,fullPage:true});
 console.log(name,await page.title(),'overflow:',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
}
await page.setViewportSize({width:390,height:844});
for(const [name,path] of [['home-mobile','/'],['calendar-mobile','/daily'],['reader-mobile','/daily/2026-10-08']]){
 await page.goto(base+path);
 await page.locator('main, article.note-reader').first().waitFor();
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`test-results/${name}.png`,fullPage:true});
 console.log(name,'overflow:',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
}
console.log('Runtime errors:',errors);
await browser.close();
