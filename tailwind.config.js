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
      },
      fontFamily: {
        'horror': ['Creepster', 'cursive'],
        'sans': ['Roboto', 'sans-serif'], 
      },
      animation: {
        'creepy-pulse': 'creepy-pulse 2s infinite',
        'blood-drip': 'blood-drip 3s infinite ease-out',
        'fog-crawl': 'fog-crawl 60s linear infinite',
        'vignette-pulse': 'vignette-pulse 4s infinite alternate',
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
      },
    },
  },
  plugins: [
    // require('flowbite/plugin') // Flowbite plugin will be imported in index.css using @plugin rule
  ],
}
