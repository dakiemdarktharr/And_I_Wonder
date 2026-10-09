import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import curriculum from '../../data/math-v2/curriculum.json';
const day=(week:number,index=0)=>curriculum.sessions.find(s=>s.week===week&&s.dayIndex===index)!;
test.beforeEach(async({page})=>{
 await page.route('**/api/auth/session',r=>r.fulfill({json:{authenticated:false}}));
 await page.route('**/api/math-progress',r=>r.fulfill({json:{version:'math-v2.0',notes:{}}}));
});
test('daily practice is minimal, has four problems, and leaves all old drafts untouched',async({page})=>{
 const s=day(97);const oldId='Daily/'+s.date.slice(0,7)+'/'+s.date;
 await page.route('**/api/math-progress',r=>r.fulfill({json:{notes:{[oldId]:{status:'done',checked:{[oldId+'::lesson0']:true}}}}}));
 await page.addInitScript(()=>{localStorage.setItem('road-to-qr:answer-workbench:v1:97-0-old','OLD ANSWER');localStorage.setItem('road-to-qr:answer-workbench:math-v2.0:old','V2 OLD DRAFT');localStorage.setItem('wonder-language','en');});
 await page.goto('/daily/'+s.date);await expect(page.locator('.math-reader')).toBeVisible();
 for(const input of await page.locator('.math-agenda input').all()){await expect(input).toBeDisabled();await expect(input).not.toBeChecked();}
 await expect(page.locator('.math-exercise')).toHaveCount(4);await expect(page.locator('.math-method')).toHaveCount(1);
 await expect(page.locator('.math-exercise textarea,.answer-workbench')).toHaveCount(0);await expect(page.getByText('Reasoning checklist',{exact:true})).toHaveCount(0);
 await expect(page.locator('.math-solution')).toHaveCount(0);const toggle=page.locator('.math-answer-toggle').first();await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');await expect(page.locator('.math-solution')).toBeVisible();
 await page.getByRole('button',{name:'VI',exact:true}).click();await expect(toggle).toHaveText('Ẩn lời giải');await toggle.click();await expect(page.locator('.math-solution')).toHaveCount(0);
 await page.reload();await expect(page.locator('.math-solution')).toHaveCount(0);expect(await page.evaluate(()=>localStorage.getItem('road-to-qr:answer-workbench:v1:97-0-old'))).toBe('OLD ANSWER');expect(await page.evaluate(()=>localStorage.getItem('road-to-qr:answer-workbench:math-v2.0:old'))).toBe('V2 OLD DRAFT');
 expect(await page.locator('.math-theorem .katex').count()).toBeGreaterThan(0);await expect(page.locator('.katex-error')).toHaveCount(0);
});
test('Markdown export contains applications, formulas and hidden solutions; focus retains version',async({page})=>{
 const s=day(98);await page.goto('/daily/'+s.date+'?curriculum=v2');await page.getByRole('button',{name:'EN',exact:true}).click();
 await page.getByRole('button',{name:'Focus mode',exact:true}).click();await expect(page.locator('.math-sidebar')).toBeHidden();
 const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Export Markdown',exact:true}).click();const download=await downloaded;const path=await download.path();const text=fs.readFileSync(path!,'utf8');
 expect(text).toContain('math-v2.0');expect(text).toContain('General formula');expect(text).toContain('Application');expect(text).toContain('<summary>Show solution</summary>');expect(text).not.toContain('Stepped hints');expect(text).not.toContain('::lesson0');
 await page.getByRole('link',{name:/Next day/}).click();await expect(page).toHaveURL(/curriculum=v2/);
});
test('consecutive late days have separate primary lessons and four tasks without form controls',async({page})=>{
 const a=day(100),b=day(100,1);await page.goto('/daily/'+a.date+'?curriculum=v2');
 await expect(page.locator('#math-theory')).toHaveAttribute('data-concept',a.lesson.conceptKey);
 await expect(page.locator('#math-reading a')).toHaveAttribute('href','https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf');await expect(page.locator('#math-reading a')).toHaveText('The Matrix Cookbook');
 await expect(page.locator('.math-exercise')).toHaveCount(4);await expect(page.locator('.math-method')).toHaveCount(1);await expect(page.locator('.math-form')).toHaveCount(0);
 await page.locator('.math-answer-toggle').first().click();await expect(page.locator('.math-solution')).toBeVisible();
 await page.getByRole('button',{name:'EN',exact:true}).click();await page.getByRole('link',{name:/Next day/}).click();
 await expect(page.locator('#math-theory')).toHaveAttribute('data-concept',b.lesson.conceptKey);expect(a.lesson.conceptKey).not.toBe(b.lesson.conceptKey);
 await expect(page.locator('.math-solution')).toHaveCount(0);await expect(page.locator('.math-exercise')).toHaveCount(4);
});
test('foundation replacement retains route across navigation and cannot use main-route completion',async({page})=>{
 const s=day(17);await page.route('**/api/math-progress',r=>r.fulfill({json:{notes:{[`${s.id}@${s.revision}`]:{status:'done',checked:Object.fromEntries(s.taskIds.map(k=>[k,true]))}}}}));
 await page.goto(`/daily/${s.date}?curriculum=v2&route=foundation`);await page.getByRole('button',{name:'EN',exact:true}).click();
 await expect(page.locator('.math-heading')).toContainText('source W5');for(const input of await page.locator('.math-agenda input').all())await expect(input).not.toBeChecked();
 await page.getByRole('link',{name:/Next day/}).click();await expect(page).toHaveURL(/route=foundation/);
 await page.getByRole('link',{name:/Math v2 calendar/}).click();await expect(page).toHaveURL(/route=foundation/);
});
test('failed v2 owner write preserves saved state and exposes retryable error',async({page})=>{
 await page.route('**/api/auth/session',r=>r.fulfill({json:{authenticated:true,owner:{login:'dakiemdarktharr'}}}));
 await page.route('**/api/math-progress',r=>r.request().method()==='PATCH'?r.fulfill({status:503,json:{error:'test failure'}}):r.fulfill({json:{notes:{}}}));
 await page.goto(`/daily/${day(36).date}?curriculum=v2`);await page.getByRole('button',{name:'EN',exact:true}).click();
 const input=page.locator('.math-agenda input').first();await expect(input).toBeEnabled();await input.click();await expect(page.locator('.math-status')).toContainText('Save failed');await expect(input).not.toBeChecked();
});
test('search and projects expose current mathematical content with legacy access',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'EN',exact:true}).click();await page.getByRole('button',{name:'Search notes',exact:true}).click();
 const dialog=page.getByRole('dialog');await dialog.locator('input').fill('uniform integrability');await expect(dialog.locator('a').first()).toHaveAttribute('href',/curriculum=v2/);await dialog.locator('a').first().click();await expect(page.locator('.math-reader')).toBeVisible();
 await page.goto('/projects/P05');await expect(page.locator('.math-syllabus')).toContainText('Sequential-inference mathematical capstone');await expect(page.locator('.math-syllabus')).toContainText('Joseph');
 await page.getByRole('link',{name:'Legacy v1 projects',exact:true}).click();await expect(page).toHaveURL(/curriculum=v1/);await expect(page.locator('.project-guide-shell')).toBeVisible();
});
test('new progress API denies guest writes without touching storage',async({request,baseURL})=>{
 const s=day(36);const response=await request.patch('/api/math-progress',{headers:{Origin:baseURL!},data:{version:'math-v2.0',noteId:`${s.id}@${s.revision}`,taskId:s.taskIds[0],checked:true}});expect([401,403]).toContain(response.status());
});
for(const week of [15,31,50,71,99])test(`W${week} mathematical text stays readable in both languages`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(`/daily/${day(week).date}?curriculum=v2`);
 for(const language of ['EN','VI']){
  await page.getByRole('button',{name:language,exact:true}).click();
  const theory=page.locator('#math-theory>details').first();
  if(await theory.getAttribute('open')===null)await theory.locator(':scope>summary').click();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 // Native disclosure controls remain keyboard operable.
 const toggle=page.locator('.math-answer-toggle').first();await toggle.focus();await page.keyboard.press('Enter');
 await expect(toggle).toHaveAttribute('aria-expanded','true');
});

test('projects are five illustrated quests and resources open directly on the shelves',async({page})=>{
 await page.goto('/projects');await expect(page.locator('.project-quest')).toHaveCount(5);await expect(page.locator('.project-quest img')).toHaveCount(5);
 const assets=await page.locator('.project-quest img').evaluateAll(imgs=>imgs.map(img=>(img as HTMLImageElement).src));expect(new Set(assets).size).toBe(5);
 for(const lang of ['VI','EN']){await page.getByRole('button',{name:lang,exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
 await page.locator('.project-quest').first().click();await expect(page).toHaveURL(/projects\/P01/);await expect(page.locator('.project-detail')).toContainText('least-squares');
 await page.goto('/resources');await expect(page.locator('h1')).toHaveText('Library');await expect(page.locator('.library-item').first()).toBeVisible();await expect(page.locator('.math-syllabus')).toHaveCount(0);
 await page.getByRole('button',{name:'Books & courses',exact:true}).click();expect(await page.locator('.library-item').count()).toBeGreaterThan(20);
});
