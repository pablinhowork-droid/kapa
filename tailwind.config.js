/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f3', 100: '#c8ece2', 200: '#93d9c6', 300: '#5cc0a5',
          400: '#2fa887', 500: '#15906e', 600: '#0e7358', 700: '#0c5c47',
          800: '#0c4a3a', 900: '#0b3d30',
        },
        accent: {
          50: '#fff8eb', 100: '#ffedc6', 200: '#ffd888', 300: '#ffc14a',
          400: '#ffab1a', 500: '#f99008', 600: '#dd6f02', 700: '#b75306',
          800: '#94410c', 900: '#7a360e',
        },
        neutral: {
          50: '#f8f9fa', 100: '#f1f3f5', 200: '#e3e6e8', 300: '#ced3d7',
          400: '#adb5bd', 500: '#868e96', 600: '#6c757d', 700: '#495057',
          800: '#343a40', 900: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
