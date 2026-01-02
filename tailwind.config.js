import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0px',
      sm: 'calc(var(--radius) - 4px)',
      DEFAULT: 'var(--radius)',
      md: 'calc(var(--radius) + 2px)',
      lg: 'calc(var(--radius) + 4px)',
      xl: 'calc(var(--radius) + 8px)',
      '2xl': 'calc(var(--radius) + 12px)',
      '3xl': 'calc(var(--radius) + 16px)',
      full: '9999px',
    },
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        heading: 'rgb(var(--color-heading) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        light: 'rgb(var(--color-bg-light) / <alpha-value>)',
        muted: 'rgb(var(--color-bg-muted) / <alpha-value>)',
        dark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Merriweather"', 'ui-serif', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          lg: '1rem',
          xl: '1rem',
          '2xl': '1rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1280px',
        },
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin-reverse 6s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slower': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delay-1': 'float 3s ease-in-out 1s infinite',
        'float-delay-2': 'float 3s ease-in-out 2s infinite',
        'float-particle': 'float-particle 4s ease-in-out infinite',
        'float-particle-delay-1': 'float-particle 4s ease-in-out 1s infinite',
        'float-particle-delay-2': 'float-particle 4s ease-in-out 2s infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-particle': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0' },
          '50%': { transform: 'translate(10px, -30px) scale(1.5)', opacity: '1' },
          '100%': { transform: 'translate(0, -60px) scale(0.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [typography],
}
