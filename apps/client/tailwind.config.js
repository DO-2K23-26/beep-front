const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')
const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
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
        breathe1: 'breathe1 6s ease-in-out infinite',
        breathe2: 'breathe2 7s ease-in-out infinite',
        breathe3: 'breathe3 5s ease-in-out infinite',
        breathe4: 'breathe4 8s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out forwards', // Durée ajustée à 0.3 secondes
        slideOut: 'slideOut 0.3s ease-out forwards',
      },
      colors: {
        primaryV2: '#FC3B8C',
        backgroundV2: '#0F1013',
        whiteV2: '#E2E5ED',
        grayV2: '#65687A',
        'text-grayV2': '#65687A',
        'label-V2': '#65687A',
        'label-hoverV2': '#A7ACBB',
        'input-borderV2': '#191D29',
        'input-border-hoverV2': '#FC3B8C',
        'input-placeholderV2': '#3D4153',
        'input-backgroundV2': '#111319',
      },
      boxShadow: {
        'custom-black': '0px 11px 12px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
