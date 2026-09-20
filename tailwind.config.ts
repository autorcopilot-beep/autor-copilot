import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: '600px',
      md: '768px',
      lg: '960px',
      xl: '1280px',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        canvas: 'var(--color-canvas)',
        editor: 'var(--color-editor)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        ink: 'var(--color-text)',
        muted: 'var(--color-text-secondary)',
        line: 'var(--color-border)',
        'line-strong': 'var(--color-border-strong)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-active': 'var(--color-accent-active)',
        'accent-subtle': 'var(--color-accent-subtle)',
        'on-accent': 'var(--color-on-accent)',
        danger: 'var(--color-danger)',
        'danger-hover': 'var(--color-danger-hover)',
        'danger-subtle': 'var(--color-danger-subtle)',
        'on-danger': 'var(--color-on-danger)',
        success: 'var(--color-success)',
        'success-subtle': 'var(--color-success-subtle)',
        warning: 'var(--color-warning)',
        'warning-subtle': 'var(--color-warning-subtle)',
        focus: 'var(--color-focus)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-literata)', 'Georgia', 'serif'],
      },
      fontSize: {
        interface: ['0.9375rem', { lineHeight: '1.5' }],
        meta: ['0.8125rem', { lineHeight: '1.45' }],
        editor: [
          'var(--editor-font-size)',
          { lineHeight: 'var(--editor-line-height)' },
        ],
        'document-title': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'section-title': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      maxWidth: {
        manuscript: 'var(--manuscript-width)',
      },
      borderRadius: {
        control: '0.5rem',
        card: '0.75rem',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        floating: 'var(--shadow-floating)',
      },
      transitionDuration: {
        150: '150ms',
      },
    },
  },
  plugins: [animate],
};
export default config;
