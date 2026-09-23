/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser verification. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const base = process.env.PUBLIC_TEST_URL || 'http://localhost:3000';
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Só essenciais', exact: true }).click();
    await page.screenshot({ path: path.join(os.tmpdir(), 'editorial-hero.png') });
    for (const [index, name] of ['Produto', 'Recursos', 'Empresa'].entries()) {
      await page.getByRole('button', { name, exact: true }).click();
      await page.locator(`#public-menu-${index}`).waitFor();
      await page.screenshot({ path: path.join(os.tmpdir(), `editorial-menu-${index}.png`) });
      await page.keyboard.press('Escape');
    }
    await page.locator('#manifesto').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    assert.notEqual(await page.locator('[data-word]').first().evaluate((node) => node.style.getPropertyValue('--word-progress')), '');
    await page.goto(`${base}/demo?view=enciclopedia`, { waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('tab', { name: 'Enciclopédia' }).getAttribute('aria-selected'), 'true');
    await page.getByRole('button', { name: 'Criar ficha', exact: true }).click();
    await page.getByLabel('Nome', { exact: true }).fill('Jardim secreto');
    await page.getByLabel('Tipo', { exact: true }).selectOption('Lugar');
    await page.getByLabel('O que torna esta ficha importante?').fill('Um jardim escondido atrás do farol.');
    await page.getByRole('button', { name: /Adicionar ao universo/ }).click();
    await page.getByLabel('Buscar fichas da demonstração').fill('Jardim');
    assert.equal(await page.locator('.ac-atlas-entry').count(), 1);
    await page.getByRole('tab', { name: 'Universo', exact: true }).click();
    await page.locator('.ac-graph-map').getByRole('button', { name: /Jardim secreto/ }).click();
    await page.getByRole('button', { name: 'Conectar à obra', exact: true }).click();
    await page.getByRole('button', { name: 'Remover vínculo', exact: true }).waitFor();
    await page.screenshot({ path: path.join(os.tmpdir(), 'editorial-graph.png') });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.documentElement.dataset.theme = 'dark');
    await page.screenshot({ path: path.join(os.tmpdir(), 'editorial-dark.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => document.documentElement.dataset.theme = 'light');
    await page.screenshot({ path: path.join(os.tmpdir(), 'editorial-mobile.png') });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#manifesto').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('[data-word]').first().evaluate((node) => getComputedStyle(node).opacity), '1');
    assert.equal(await page.locator('[data-parallax]').first().evaluate((node) => getComputedStyle(node).transform), 'none');
    assert.deepEqual(errors, []);
    console.log('Passed: three distinct menus, scroll text, deep links, create/search entry, connect graph, mobile overflow, dark theme and reduced motion.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
