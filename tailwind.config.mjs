/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // User's custom 4-color palette
        cream: {
          50: '#fefbf6',
          100: '#FCF0DA', // Palette Color 1: #FCF0DA
          200: '#f8e4bf',
          300: '#f3d59e',
          400: '#eec57e',
          500: '#e5b259',
        },
        sage: {
          50: '#f7f8f2',
          100: '#eceee1',
          200: '#dadfc6',
          300: '#c5cfa8',
          400: '#AEAC78', // Palette Color 2: #AEAC78
          500: '#95935f',
          600: '#777549',
          700: '#5a5836',
          800: '#424127',
          900: '#2c2b1a',
        },
        gold: {
          50: '#fef9ed',
          100: '#fcf0d3',
          200: '#fae0a4',
          300: '#f6cb71',
          400: '#F2C46A', // Palette Color 3: #F2C46A
          500: '#e5ab3f',
          600: '#c68a25',
          700: '#9d671b',
          800: '#794c1a',
          900: '#5c3716',
        },
        charcoal: {
          50: '#f6f5f5',
          100: '#eceae9',
          200: '#d9d6d4',
          300: '#bbb5b2',
          400: '#8e8682',
          500: '#6d6561',
          600: '#58514d',
          700: '#4C4541', // Palette Color 4: #4C4541
          800: '#3c3633',
          900: '#2c2725',
          950: '#1d1918',
        },
        brand: {
          50: '#fef9ed',
          100: '#fcf0d3',
          200: '#fae0a4',
          300: '#f6cb71',
          400: '#F2C46A',
          500: '#e5ab3f',
          600: '#c68a25',
          700: '#9d671b',
          800: '#794c1a',
          900: '#5c3716',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
