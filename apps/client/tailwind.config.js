const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  darkMode: 'selector',
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        breathe1: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.1)', opacity: '0.25' },
        },
        breathe2: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.15' },
          '50%': { transform: 'scale(1.05)', opacity: '0.2' },
        },
        breathe3: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.15' },
          '50%': { transform: 'scale(1.08)', opacity: '0.22' },
        },
        breathe4: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.12)', opacity: '0.3' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        breathe1: 'breathe1 6s ease-in-out infinite',
        breathe2: 'breathe2 7s ease-in-out infinite',
        breathe3: 'breathe3 5s ease-in-out infinite',
        breathe4: 'breathe4 8s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out forwards', // Durée ajustée à 0.3 secondes
        slideOut: 'slideOut 0.3s ease-out forwards',
      },
      colors: {
        primaryV2: 'rgb(var(--color-primary))',
        backgroundV2: 'rgb(var(--color-background))',
        whiteV2: 'rgb(var(--color-white))',
        grayV2: 'rgb(var(--color-gray))',
        'text-grayV2': 'rgb(var(--color-text))',
        labelV2: 'rgb(var(--color-label))',
        'label-hoverV2': 'rgb(var(--color-label-hover))',
        'input-borderV2': 'rgb(var(--color-input-border))',
        'input-placeholderV2': 'rgb(var(--color-input-placeholder))',
        'input-backgroundV2': 'rgb(var(--color-input-background))',
        errorV2: 'rgb(var(--color-error))',
      },
      boxShadow: {
        'custom-black': '0px 11px 12px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
