import { ACCESSIBILITY_STORAGE_KEY } from './preferences';

export const accessibilityBootstrapScript = `
  try {
    const defaults = { theme: 'system', fontSize: 19, lineHeight: 1.65, textWidth: 68, reduceMotion: false };
    const raw = localStorage.getItem('${ACCESSIBILITY_STORAGE_KEY}');
    const saved = raw ? JSON.parse(raw) : {};
    const root = document.documentElement;
    const theme = ['system', 'light', 'dark'].includes(saved.theme) ? saved.theme : defaults.theme;
    const fontSize = Number.isFinite(Number(saved.fontSize)) ? Math.min(24, Math.max(16, Math.round(Number(saved.fontSize)))) : defaults.fontSize;
    const lineHeight = [1.5, 1.65, 1.8].includes(Number(saved.lineHeight)) ? Number(saved.lineHeight) : defaults.lineHeight;
    const textWidth = [60, 68, 75].includes(Number(saved.textWidth)) ? Number(saved.textWidth) : defaults.textWidth;

    if (theme === 'system') root.removeAttribute('data-theme');
    else root.dataset.theme = theme;

    if (saved.reduceMotion === true) root.dataset.reduceMotion = 'true';
    else root.removeAttribute('data-reduce-motion');

    root.style.setProperty('--editor-font-size', (fontSize / 16) + 'rem');
    root.style.setProperty('--editor-line-height', String(lineHeight));
    root.style.setProperty('--manuscript-width', textWidth + 'ch');
  } catch {}
`;
