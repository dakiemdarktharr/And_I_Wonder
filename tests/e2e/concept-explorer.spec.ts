import {test,expect} from '@playwright/test';
import curriculum from '../../data/math-v2/curriculum.json';
import {conceptFigures} from '../../content/math-v2/concept-figures';
import {sceneControls} from '../../lib/concept-scenes';

test.beforeEach(async({page})=>{
 await page.route('**/api/auth/session',r=>r.fulfill({json:{authenticated:false}}));
 await page.route('**/api/math-progress',r=>r.fulfill({json:{version:'math-v2.0',notes:{}}}));
});

for(const [id,figure] of Object.entries(conceptFigures)){
 const session=curriculum.sessions.find(s=>s.lesson.conceptKey===id)!;
 test(figure.kind+' is correctly wired to its lesson and hidden solution in both languages',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/daily/'+session.date+'?curriculum=v2');
  const graph=page.locator('#math-theory .concept-explorer');
  await expect(graph).toHaveAttribute('data-scene',figure.kind);
  for(const lang of ['VI','EN'] as const){
   await page.getByRole('button',{name:lang,exact:true}).click();
   await expect(graph.locator('figcaption')).toHaveText(figure.title[lang==='VI'?'vi':'en']);
   const slider=graph.locator('input[type=range]');
   await slider.focus();await page.keyboard.press('End');await expect(slider).toHaveValue(String(sceneControls[figure.kind].max));
   await page.keyboard.press('Home');await expect(slider).toHaveValue(String(sceneControls[figure.kind].min));
   await graph.getByRole('button').click();await expect(slider).toHaveValue(String(sceneControls[figure.kind].initial));
   await expect(page.locator('.katex-error')).toHaveCount(0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
  // The third task is the canonical application, not a shared-scaffold copy.
  const toggle=page.locator('.math-answer-toggle').nth(2);
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('.math-solution .concept-explorer')).toHaveCount(0);
  await toggle.click();await expect(page.locator('.math-solution .concept-explorer')).toHaveCount(1);
  expect(await page.locator('.math-solution li').count()).toBeGreaterThan(0);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await toggle.click();await expect(page.locator('.math-solution')).toHaveCount(0);
  expect(errors).toEqual([]);
 });
}

test('zero secant increment has no fabricated quotient; keyboard and reset restore the model',async({page})=>{
 await page.goto('/daily/2026-10-07?curriculum=v2');
 await page.getByRole('button',{name:'EN',exact:true}).click();
 const graph=page.locator('#math-theory .concept-explorer');
 const input=graph.locator('input');
 await input.focus();await page.keyboard.press('Home');
 for(let i=0;i<50;i++)await page.keyboard.press('ArrowRight');
 await expect(input).toHaveValue('0');
 await expect(graph.locator('.concept-boundary')).toContainText('undefined');
 await expect(graph.locator('[data-value=slope]')).toHaveCount(0);
 await graph.getByRole('button').click();
 await expect(input).toHaveValue('0.1');
 await expect(graph.locator('[data-value=slope]')).toHaveText('3.45');
});
