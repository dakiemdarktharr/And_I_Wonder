import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
 await page.route('**/api/auth/session',r=>r.fulfill({json:{authenticated:false}}));
 await page.route('**/api/math-progress',r=>r.fulfill({json:{version:'math-v2.0',notes:{}}}));
});
for(const width of [1280,1920])test(`desktop lesson uses both rails and readable Vietnamese fonts at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1080});
 await page.goto('/daily/2026-10-23?curriculum=v2');
 for(const language of ['VI','EN']){
  await page.getByRole('button',{name:language,exact:true}).click();
  const nav=await page.locator('.math-sidebar').boundingBox();
  const article=await page.locator('.math-article').boundingBox();
  const desk=await page.locator('.lesson-desk').boundingBox();
  expect(nav!.x).toBeLessThan(width*.05);expect(desk!.x+desk!.width).toBeGreaterThan(width*.94);
  expect(article!.x).toBeGreaterThan(nav!.x+nav!.width);expect(desk!.x).toBeGreaterThan(article!.x+article!.width);
  expect(article!.y).toBeLessThan(450);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.locator('.math-general-formula .katex').count()).toBeGreaterThan(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(await page.locator('.math-method .math-prose').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(19);
 }
 await page.evaluate(()=>Promise.all(['Be Vietnam Pro','Source Serif 4','JetBrains Mono'].map(f=>document.fonts.load(`16px \"${f}\"`,'Đường chéo, xác suất, nghiệm'))));
 expect(await page.evaluate(()=>['Be Vietnam Pro','Source Serif 4','JetBrains Mono'].every(f=>document.fonts.check(`16px "${f}"`,'Đường chéo, xác suất, nghiệm')))).toBe(true);
 await page.screenshot({path:`artifacts/studio-lesson-${width}.png`});
});
test('problem disclosure, section tracking and the null-space demonstration work with keyboard',async({page})=>{
 await page.goto('/daily/2026-10-23?curriculum=v2');
 await page.getByRole('button',{name:'EN',exact:true}).click();
 await page.locator('.math-sidebar a[href="#math-practice"]').click();
 await expect(page.locator('.math-sidebar a[href="#math-practice"]')).toHaveAttribute('aria-current','location');
 const toggle=page.locator('.math-answer-toggle').first();await toggle.focus();await page.keyboard.press('Enter');
 await expect(toggle).toHaveAttribute('aria-expanded','true');await expect(page.locator('.math-solution')).toHaveCount(1);
 await page.keyboard.press('Enter');await expect(page.locator('.math-solution')).toHaveCount(0);
 const slider=page.locator('.nullspace-explorer input');await slider.focus();await page.keyboard.press('ArrowRight');
 await expect(slider).toHaveValue('1.1');await expect(page.locator('.nullspace-explorer svg')).toHaveAttribute('aria-label','h = (-2.2, 1.1); A h = (0, 0)');
 await expect(page.locator('.katex-error')).toHaveCount(0);
});
test('client navigation keeps header, uses view transitions and respects reduced motion',async({page})=>{
 await page.addInitScript(()=>{
  const native=document.startViewTransition?.bind(document);(window as any).transitionCount=0;
  if(native)document.startViewTransition=(...args:Parameters<typeof native>)=>{(window as any).transitionCount++;return native(...args);};
 });
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/projects');await page.getByRole('button',{name:'EN',exact:true}).click();
 await page.locator('.nav-links a[href="/resources"]').click();
 await expect(page).toHaveURL(/\/resources$/);await expect(page.locator('.library-item').first()).toBeVisible();
 expect(await page.evaluate(()=>(window as any).transitionCount)).toBeGreaterThan(0);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.nav-links a[href="/daily"]').click();await expect(page).toHaveURL(/\/daily$/);
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement,'::view-transition-new(root)').animationName)).toBe('none');
 expect(errors).toEqual([]);
});
test('resource captions, assessment notation and derivatives answers remain readable',async({page})=>{
 await page.goto('/resources');
 expect(await page.locator('.shelf-caption').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(13);
 await page.goto('/assessment');
 expect(await page.locator('.research-field .katex').count()).toBeGreaterThan(0);await expect(page.locator('.katex-error')).toHaveCount(0);
 await page.goto('/derivatives');await page.locator('#unit-1 details').first().locator('summary').click();
 expect(await page.locator('#unit-1 article .katex').count()).toBeGreaterThan(0);await expect(page.locator('.katex-error')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
