import typography from '@tailwindcss/typography'

// Helper function for CSS variable-based colors with alpha support
const withOpacity = (variableName) => {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}) / ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

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
        primary: {
          DEFAULT: withOpacity('--color-primary'),
          darker: withOpacity('--color-primary-darker'),
        },
        secondary: {
          DEFAULT: withOpacity('--color-secondary'),
        },
        danger: {
          DEFAULT: withOpacity('--color-danger'),
        },
        text: {
          DEFAULT: withOpacity('--color-text'),
        },
        heading: {
          DEFAULT: withOpacity('--color-heading'),
        },
        surface: {
          DEFAULT: withOpacity('--color-surface'),
        },
        light: {
          DEFAULT: withOpacity('--color-bg-light'),
        },
        muted: {
          DEFAULT: withOpacity('--color-bg-muted'),
        },
        dark: {
          DEFAULT: withOpacity('--color-bg-dark'),
        },
        border: {
          DEFAULT: withOpacity('--color-border'),
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
