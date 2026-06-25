/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // ── Cinema colour palette ──────────────────────────────
      colors: {
        cinema: {
          black:   '#0a0a0f',   // near-black background
          navy:    '#0f0f1a',   // card / section background
          slate:   '#1a1a2e',   // elevated surfaces
          border:  '#2a2a4a',   // subtle borders
          muted:   '#6b7280',   // secondary text
          text:    '#e2e8f0',   // primary text
          gold:    '#f5c518',   // IMDb-style rating gold  ← accent
          amber:   '#f59e0b',   // hover / glow variant
          red:     '#ef4444',   // error states
        },
      },

      // ── Typography ─────────────────────────────────────────
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],   // cinematic headings
        body:    ['"Inter"', 'sans-serif'],     // readable body copy
      },

      // ── Animations ────────────────────────────────────────
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        shimmer:     'shimmer 2s infinite linear',
        'fade-in':   'fadeIn 0.4s ease-out forwards',
        pulse_soft:  'pulse_soft 2s ease-in-out infinite',
      },

      // ── Backdrop blur helpers ──────────────────────────────
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
