/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS browser runner. */
/* Run with PLAYWRIGHT_MODULE pointing to a Playwright installation if not installed locally. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(`${page.url()}: ${error.stack || error.message}`));
    const base = process.env.PUBLIC_TEST_URL || 'http://localhost:3000';
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.getByRole('button', { name: 'Só essenciais', exact: true }).click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('button', { name: 'Só essenciais', exact: true }).count(), 0);
    let consent = JSON.parse(decodeURIComponent((await context.cookies()).find((cookie) => cookie.name === 'ac_cookie_consent').value));
    assert.equal(consent.analytics, false);
    await page.getByRole('button', { name: /preferências de cookies/i }).click();
    await page.getByRole('checkbox', { name: /Análise de uso/ }).check();
    await page.getByRole('button', { name: 'Salvar escolhas', exact: true }).click();
    consent = JSON.parse(decodeURIComponent((await context.cookies()).find((cookie) => cookie.name === 'ac_cookie_consent').value));
    assert.equal(consent.analytics, true);
    assert.equal(consent.marketing, false);
    await page.getByRole('button', { name: /preferências de cookies/i }).click();
    await page.getByRole('button', { name: 'Recusar opcionais', exact: true }).click();
    await page.getByRole('button', { name: 'Produto', exact: true }).click();
    await page.getByRole('link', { name: /Todas as funcionalidades/ }).waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#public-menu-0').count(), 0);
    await page.getByLabel('Renomear personagem').fill('Beatriz');
    assert.equal(await page.getByRole('button', { name: 'Beatriz' }).count(), 1);
    await page.getByLabel('Renomear personagem').blur();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(os.tmpdir(), 'autor-public-desktop.png'), fullPage: true });
    await page.screenshot({ path: path.join(os.tmpdir(), 'autor-public-desktop-viewport.png') });
    const routes = ['funcionalidades', 'como-funciona', 'guias', 'documentacao', 'sobre', 'contato', 'comunidade', 'carreiras', 'imprensa', 'roadmap', 'precos', 'demo', 'cookies', 'faq', 'legal', 'blog', 'ajuda', 'status', 'updates', 'publicacoes', 'comunicados', 'newsletters'];
    for (const route of routes) {
      const response = await page.goto(`${base}/${route}`, { waitUntil: 'domcontentloaded' });
      assert.equal(response.status(), 200, route);
      await page.getByRole('navigation', { name: 'Navegação principal' }).waitFor();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'mobile horizontal overflow');
    await page.getByRole('button', { name: 'Abrir navegação' }).click();
    await page.getByRole('button', { name: 'Recursos', exact: true }).click();
    await page.locator('.ac-menu-resource-list').getByRole('link', { name: /Guias/ }).click();
    await page.waitForURL('**/guias');
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(os.tmpdir(), 'autor-public-mobile.png'), fullPage: true });
    await page.screenshot({ path: path.join(os.tmpdir(), 'autor-public-mobile-viewport.png') });
    assert.deepEqual(errors, [], 'browser errors');
    console.log('Passed: 22 public routes, desktop/mobile navigation, interactive demo, consent persistence and revocation.');
    console.log('Screenshots:', path.join(os.tmpdir(), 'autor-public-desktop.png'), path.join(os.tmpdir(), 'autor-public-mobile.png'));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
