/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0d0f14', soft: '#1c2030', muted: '#3a3f52' },
        slate: '#6b7280',
        mist: '#9ca3af',
        border: { DEFAULT: '#e5e7eb', strong: '#d1d5db' },
        surface: '#f9fafb',
        gold: { DEFAULT: '#c9a84c', light: '#f5e9c8' },
        teal: { DEFAULT: '#0f766e', light: '#ccfbf1' },
        red: { DEFAULT: '#dc2626', light: '#fee2e2' },
        green: '#16a34a',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px', md: '12px', lg: '20px', xl: '28px', pill: '999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(13,15,20,0.06)',
        sm: '0 2px 8px rgba(13,15,20,0.08)',
        md: '0 6px 24px rgba(13,15,20,0.1)',
        lg: '0 12px 40px rgba(13,15,20,0.14)',
        xl: '0 24px 64px rgba(13,15,20,0.16)',
      },
      maxWidth: { content: '1320px', wide: '1480px' },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'pulse-star': 'pulse-star 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.22,1,0.36,1)',
        'toast-out': 'toast-out 0.3s cubic-bezier(0.22,1,0.36,1) 2.5s forwards',
        'spin-slow': 'spin 30s linear infinite',
        'spin-slower': 'spin 20s linear infinite reverse',
        'ring-in': 'rotate-ring 2s ease-out forwards',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-star': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.9)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(48px) scale(0.9)' },
          to: { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'toast-out': {
          to: { opacity: '0', transform: 'translateX(48px) scale(0.9)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
        'rotate-ring': {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
