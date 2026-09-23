/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS test runner. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const code = ts.transpileModule(fs.readFileSync('src/features/public-site/consent.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {} };
vm.runInNewContext(code, sandbox);
const { parseConsent, makeConsent, CONSENT_MAX_AGE } = sandbox.exports;
const now = 1790200000000;
const encode = (value) => encodeURIComponent(JSON.stringify(value));
test('missing, malformed or outdated consent never authorizes optional categories', () => {
  for (const value of [undefined, '', '%bad', '{}', 'null', encode({ version: 0 }), encode({ version: 1, necessary: true, preferences: 'true', analytics: true, marketing: true, updatedAt: now })]) assert.equal(parseConsent(value, now), null);
});
test('choices round trip independently and keep necessary storage enabled', () => {
  const consent = makeConsent({ preferences: true, analytics: false, marketing: false }, now);
  const parsed = parseConsent(encode(consent), now);
  assert.equal(parsed.preferences, true);
  assert.equal(parsed.analytics, false);
  assert.equal(parsed.marketing, false);
  assert.equal(parsed.necessary, true);
});
test('consent expires at 180 days and rejects future timestamps', () => {
  const consent = makeConsent({ preferences: true, analytics: true, marketing: true }, now);
  assert.equal(parseConsent(encode(consent), now + CONSENT_MAX_AGE * 1000), null);
  assert.equal(parseConsent(encode(consent), now - 1), null);
  assert.ok(parseConsent(encode(consent), now + CONSENT_MAX_AGE * 1000 - 1));
});
test('revocation turns every optional category off', () => {
  const value = parseConsent(encode(makeConsent({ preferences: false, analytics: false, marketing: false }, now)), now);
  for (const key of ['preferences', 'analytics', 'marketing']) assert.equal(value[key], false);
});
