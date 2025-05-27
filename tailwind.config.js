/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'draugr-red': '#8B0000',
        'draugr-dark-red': '#6c0000',
        'draugr-blood': '#5c0000',
        'draugr-charcoal': '#1a1a1a',
        'draugr-dark-charcoal': '#111111',
        'draugr-light-gray': '#a3a3a3', 
        'draugr-medium-gray': '#555555',
        'draugr-dark-gray': '#333333',
        'draugr-accent-red': '#ff0000',      
        'draugr-glow-red': 'rgba(255, 0, 0, 0.6)',
        'draugr-primary': '#800000',
        'draugr-secondary': '#3a0000', 
        'draugr-text-main': '#ffffff',
        'draugr-text-secondary': '#aaaaaa',
        'horror-primary': '#800000', 
        'horror-secondary': '#3a0000',
        'horror-accent': '#ff0000', 
        'horror-shadow': '#200000',
        'horror-glow': 'rgba(255, 0, 0, 0.6)',
        'draugr-navbar-bg': 'rgba(10, 5, 5, 0.7)',
        'draugr-navbar-border': 'rgba(139, 0, 0, 0.5)',
        'draugr-footer-bg': 'rgba(15, 8, 8, 0.9)',
        'draugr-footer-border': 'rgba(100, 20, 20, 0.6)',
        'draugr-button-primary-bg': '#8B0000',
        'draugr-button-primary-hover-bg': '#6c0000',
        'draugr-button-secondary-bg': '#3a0000',
        'draugr-button-secondary-hover-bg': '#2c0000',
        'draugr-input-bg': 'rgba(20, 10, 10, 0.5)',
        'draugr-input-border': 'rgba(139, 0, 0, 0.4)',
        'draugr-input-focus-border': '#ff0000',
        'draugr-card-bg': 'rgba(26, 13, 13, 0.8)',
        'draugr-card-border': 'rgba(100, 20, 20, 0.5)',
        'midnight': '#121212',
        'charcoal': '#1c1c1c',
        'ash': '#262626',
        'bone': '#e0e0e0',
        'fog': 'rgba(255, 255, 255, 0.05)',
        'draugr': {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000',
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
        'blood': '#8B0000',
        'crimson': '#DC143C',
        'vampire': {
          primary: '#4A0000',
          secondary: '#790000',
          accent: '#B02E0C',
          dark: '#19090B',
          light: '#CAA8A8',
        },
        'witch': {
          primary: '#3B2D40',
          secondary: '#547B73',
          accent: '#AC5C34',
          dark: '#15141A',
          light: '#C4BAD2',
        },
        'werewolf': {
          primary: '#5E4F2B',
          secondary: '#A56336',
          accent: '#B3A338',
          dark: '#1F1A0E',
          light: '#D8CCA3',
        },
      },
      fontFamily: {
        'horror': ['Creepster', 'cursive'],
        'sans': ['Roboto', 'sans-serif'],
        'vazirmatn': ['Vazirmatn', 'sans-serif'],
      },
      animation: {
        'creepy-pulse': 'creepy-pulse 2s infinite',
        'blood-drip': 'blood-drip 3s infinite ease-out',
        'fog-crawl': 'fog-crawl 60s linear infinite',
        'vignette-pulse': 'vignette-pulse 4s infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'rotate': 'rotate 60s linear infinite',
        'rotate-reverse': 'rotate 60s linear reverse infinite',
      },
      keyframes: {
        'creepy-pulse': {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'blood-drip': {
          '0%': { transform: 'translateY(-100%) scaleY(0.3)', opacity: '0' },
          '20%': { opacity: '0.7' },
          '80%': { transform: 'translateY(0) scaleY(1)', opacity: '0.7' },
          '100%': { transform: 'translateY(0) scaleY(1)', opacity: '0' },
        },
        'fog-crawl': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'vignette-pulse': {
          '0%': { boxShadow: 'inset 0 0 80px 20px rgba(0,0,0,0.7)' },
          '100%': { boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.9)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'horror-gradient': 'linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(51, 0, 0, 0.9))',
        'blood-texture': 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'pattern\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' patternUnits=\'userSpaceOnUse\' patternTransform=\'rotate(45)\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23000000\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'2\' fill=\'%23ff0000\' fill-opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23pattern)\'/%3E%3C/svg%3E")',
        'vampire-gradient': 'linear-gradient(to right, rgba(25, 9, 11, 0.95), rgba(74, 0, 0, 0.9))',
        'witch-gradient': 'linear-gradient(to right, rgba(21, 20, 26, 0.95), rgba(59, 45, 64, 0.9))',
        'werewolf-gradient': 'linear-gradient(to right, rgba(31, 26, 14, 0.95), rgba(94, 79, 43, 0.9))',
      },
      boxShadow: {
        'horror': '0 4px 14px 0 rgba(255, 0, 0, 0.3)',
        'vampire': '0 4px 14px 0 rgba(176, 46, 12, 0.4)',
        'witch': '0 4px 14px 0 rgba(84, 123, 115, 0.4)',
        'werewolf': '0 4px 14px 0 rgba(179, 163, 56, 0.4)',
      },
      textDirection: {
        rtl: 'rtl',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-default': {
          /* Firefox */
          'scrollbar-width': 'auto',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'block'
          }
        },
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
        '.text-shadow-horror': {
          'text-shadow': '0 0 8px rgba(255, 0, 0, 0.5), 0 0 12px rgba(255, 0, 0, 0.3)'
        },
        '.text-shadow-vampire': {
          'text-shadow': '0 0 8px rgba(176, 46, 12, 0.5), 0 0 12px rgba(121, 0, 0, 0.4)'
        },
        '.text-shadow-witch': {
          'text-shadow': '0 0 8px rgba(84, 123, 115, 0.5), 0 0 12px rgba(59, 45, 64, 0.4)'
        },
        '.text-shadow-werewolf': {
          'text-shadow': '0 0 8px rgba(179, 163, 56, 0.5), 0 0 12px rgba(94, 79, 43, 0.4)'
        },
        '.blood-drip': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '15px',
            background: 'linear-gradient(to bottom, #ff0000, transparent)',
            borderRadius: '0 0 2px 2px',
          }
        }
      }
      addUtilities(newUtilities);
    }
  ],
  darkMode: 'class',
}
