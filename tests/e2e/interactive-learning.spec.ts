import {test,expect} from '@playwright/test';

test('a numeric answer gives feedback and a private draft survives reload and language changes',async({page})=>{
 await page.goto('/daily/2026-10-08');
 await page.getByRole('button',{name:'EN',exact:true}).click();
 const work=page.locator('.answer-workbench');
 await work.locator('textarea').fill('The columns are independent before duplication.');
 const check=work.locator('.answer-workbench__check').first();
 await check.locator('input').fill('2');await check.getByRole('button').click();
 await expect(check.getByRole('status')).toContainText('Outside the allowed tolerance');
 await check.locator('input').fill('1/1');await check.getByRole('button').click();
 await expect(check.getByRole('status')).toContainText('Within the allowed tolerance');
 await page.reload();
 await expect(work.locator('textarea')).toHaveValue('The columns are independent before duplication.');
 await page.getByRole('button',{name:'VI',exact:true}).click();
 await expect(work.locator('textarea')).toHaveValue('The columns are independent before duplication.');
 await expect(check.getByRole('status')).toContainText('Khớp trong sai số');
 await expect(work.locator('.answer-workbench__solution')).toHaveCount(0);
});

test('convexity controls recompute eigenvalues and reset to the actual problem',async({page})=>{
 await page.goto('/daily/2026-10-30');
 await page.getByRole('button',{name:'EN',exact:true}).click();
 const lab=page.locator('#lesson-explore [data-lab-kind=convex]');
 await expect(lab.locator('.interactive-explanation')).toContainText('strictly convex');
 const input=lab.getByRole('spinbutton',{name:'Coefficient c (type value)',exact:true});
 await input.fill('-2');
 await expect(lab.locator('.interactive-explanation')).toContainText('not convex');
 await expect(lab.locator('.interactive-variant')).toContainText('Exploring a variant');
 await lab.getByRole('button',{name:'Reset given values'}).click();
 await expect(input).toHaveValue('2');
 await expect(lab.locator('.interactive-explanation')).toContainText('strictly convex');
 const explorer=lab.locator('.figure-explorer');
 const slider=explorer.getByRole('slider');
 await slider.focus();await slider.press('ArrowRight');
 await expect(slider).toHaveValue('1');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('daily objects fall and the flight overlay survives route replacement',async({page,isMobile})=>{
 test.skip(isMobile,'Hover is desktop-only; mobile navigation is covered separately.');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 await page.locator('.portal-daily').hover();
 await expect(page.locator('.flying-cutout')).toHaveCount(4);
 await page.locator('.portal-daily').click();
 await expect(page.locator('.portal-flight')).toBeVisible();
 await expect(page).toHaveURL(/\/daily$/);
 await expect(page.locator('.portal-flight')).toHaveCount(0);
 await expect(page.locator('.calendar-board')).toBeVisible();
});

test('reduced motion removes flying objects and preserves navigation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await page.locator('.portal-daily').focus();
 await expect(page.locator('.flying-cutout')).toHaveCount(0);
 await page.locator('.portal-daily').press('Enter');
 await expect(page).toHaveURL(/\/daily$/);
 await expect(page.locator('.portal-flight')).toHaveCount(0);
});

test('project briefs supply inputs, acceptance criteria and repository structure',async({page})=>{
 await page.goto('/projects/P01');await page.getByRole('button',{name:'EN',exact:true}).click();
 const guide=page.locator('.project-guide-shell');
 await expect(guide).toBeVisible();
 await expect(guide.getByRole('heading',{name:'Numerical acceptance checks'})).toBeVisible();
 await expect(guide.locator('.project-guide-tree')).toContainText('tests/');
 expect(await guide.locator('.project-guide-milestone').count()).toBeGreaterThan(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('real local cover images load and rolled scrolls remain accessible links',async({page})=>{
 await page.goto('/resources');
 const covers=page.locator('.book-cover-image');
 await expect(covers).toHaveCount(12);
 for(const cover of await covers.all())await expect.poll(()=>cover.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('search text survives the asynchronous session response',async({page})=>{
 let releaseSession:()=>void=()=>{};
 const gate=new Promise<void>(resolve=>{releaseSession=resolve;});
 await page.route('**/api/auth/session',async route=>{await gate;await route.fulfill({json:{authenticated:false}});});
 await page.goto('/');
 await page.getByRole('button',{name:'EN',exact:true}).click();
 await page.getByRole('button',{name:'Search notes',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await dialog.locator('input').fill('Mathematics Diagnostic');
 const sessionResponse=page.waitForResponse('**/api/auth/session');
 releaseSession();await sessionResponse;
 await expect(dialog.locator('input')).toHaveValue('Mathematics Diagnostic');
 await expect(dialog.locator('a').first()).toBeVisible();
});
