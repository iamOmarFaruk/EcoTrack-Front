import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
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

