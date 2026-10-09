import {test,expect} from '@playwright/test';
import notes from '../../data/notes.json';

test('portals navigate, locale persists, and pages fit the viewport',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await expect(page.locator('.portal')).toHaveCount(3);
  await page.locator('.portal-daily').click();
  await expect(page).toHaveURL(/\/daily$/);
  await expect(page.getByRole('heading',{name:/one day. one step./i})).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button',{name:'EN',exact:true})).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('month navigation opens a day with a complete lesson and hidden answers',async({page})=>{
  await page.clock.setFixedTime(new Date('2026-10-09T05:00:00Z'));
  await page.goto('/daily');
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await page.getByRole('button',{name:'Next month',exact:true}).click();
  await expect(page.locator('.calendar-toolbar h2')).toContainText('November');
  await page.getByRole('button',{name:'Previous month',exact:true}).click();
  await page.locator('a.day-cell[href="/daily/2026-10-08"]').click();
  await expect(page.locator('.daily-lesson')).toBeVisible();
  await expect(page.locator('.daily-lesson input[type=checkbox]')).toHaveCount(4);
  for(const box of await page.locator('.daily-lesson input[type=checkbox]').all())await expect(box).toBeDisabled();
  await expect(page.locator('.answer-workbench__solution')).toHaveCount(0);
  await page.getByRole('button',{name:'Open this worked stage',exact:true}).click();
  await expect(page.locator('.answer-workbench__solution')).toBeVisible();
  await page.getByRole('button',{name:'VI',exact:true}).click();
  await expect(page.locator('.daily-lesson')).toContainText(/lý thuyết/i);
  expect(await page.locator('.daily-lesson__task .daily-lesson__markdown').first().evaluate(e=>e.getBoundingClientRect().width)).toBeGreaterThan(180);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('five quests and resource filters keep destinations usable',async({page})=>{
  await page.goto('/projects');
  await expect(page.locator('.quest-row')).toHaveCount(5);
  await page.locator('.quest-row').first().click();
  await expect(page.locator('.note-reader')).toBeVisible();
  await page.goto('/resources');
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await page.getByRole('button',{name:'Lectures',exact:true}).click();
  expect(await page.locator('.library-item').count()).toBeGreaterThan(0);
  for(const link of await page.locator('.library-item').all()){
    await expect(link).toHaveClass(/object-tape/);
    await expect(link).toHaveAttribute('target','_blank');
    await expect(link).toHaveAttribute('href',/^https:\/\//);
  }
  await page.getByRole('textbox',{name:'Search resources'}).fill('zzzz-no-such-book');
  await expect(page.getByRole('heading',{name:'No matching resources'})).toBeVisible();
});

test('search resolves imported Obsidian notes',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await page.getByRole('button',{name:'Search notes',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill('Mathematics Diagnostic');
  await dialog.locator('a').first().click();
  await expect(page.locator('.note-reader')).toBeVisible();
});

test('failed owner saves visibly roll back lesson checkbox',async({page})=>{
  const note=notes.find(n=>n.id==='Daily/2026-10/2026-10-08')!;
  await page.route('**/api/auth/session',r=>r.fulfill({json:{authenticated:true,owner:{login:'dakiemdarktharr',avatarUrl:''}}}));
  await page.route('**/api/notes/**',r=>r.fulfill({json:{note,revision:'a'.repeat(64),progress:{checked:{}}}}));
  await page.route('**/api/progress',r=>r.request().method()==='PATCH'?r.fulfill({status:503,json:{error:'Test database unavailable'}}):r.fulfill({json:{notes:{}}}));
  await page.goto('/daily/2026-10-08');
  const task=page.locator('.daily-lesson input[type=checkbox]').first();
  // A rejected write may roll back before Playwright's check() postcondition.
  await expect(task).toBeEnabled();await task.click();
  await expect(page.locator('.reader-error[role=alert]')).toContainText('Test database unavailable');
  await expect(task).not.toBeChecked();
});

test('public API refuses unauthorized writes',async({request,baseURL})=>{
  const response=await request.patch('/api/progress',{headers:{Origin:baseURL!},data:{noteId:'Daily/2026-10/2026-10-08',taskId:'Daily/2026-10/2026-10-08::lesson0',checked:true}});
  expect([401,403]).toContain(response.status());
});
