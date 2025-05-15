/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        container: {
          center: true,
          padding: {
            DEFAULT: '1rem',
            sm: '2rem',
            lg: '4rem',
            xl: '5rem',
          },
        },
        fontFamily: {
          vazirmatn: ['Vazirmatn', 'sans-serif'],
        },
        textDirection: {
          rtl: 'rtl',
        },
        colors: {
          'draugr': {
            50: '#ffe6e6',
            100: '#ffcccc',
            200: '#ff9999',
            300: '#ff6666',
            400: '#ff3333',
            500: '#ff0000', // Primary red
            600: '#cc0000',
            700: '#990000',
            800: '#660000',
            900: '#330000',
          },
          'blood': '#8B0000', // Dark red
          'crimson': '#DC143C', // Brighter red
          'midnight': '#121212', // Very dark grey, almost black
          'charcoal': '#1c1c1c', // Dark grey
          'ash': '#262626', // Slightly lighter dark grey
          'bone': '#e0e0e0', // Off-white
          'fog': 'rgba(255, 255, 255, 0.05)', // Very subtle white
          
          // New color themes
          'vampire': {
            primary: '#4A0000', // Deep blood red
            secondary: '#790000', // Lighter blood red
            accent: '#B02E0C', // Burnt orange accent
            dark: '#19090B', // Extremely dark purple
            light: '#CAA8A8', // Pale skin tone
          },
          'witch': {
            primary: '#3B2D40', // Dark purple
            secondary: '#547B73', // Teal/green
            accent: '#AC5C34', // Orange-brown
            dark: '#15141A', // Almost black with purple hint
            light: '#C4BAD2', // Pale lavender
          },
          'werewolf': {
            primary: '#5E4F2B', // Golden brown
            secondary: '#A56336', // Amber/rust
            accent: '#B3A338', // Yellow-gold
            dark: '#1F1A0E', // Dark brown
            light: '#D8CCA3', // Tan/sand
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
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'flicker': 'flicker 8s linear infinite',
          'float': 'float 6s ease-in-out infinite',
        },
        keyframes: {
          flicker: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.8' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          }
        },
      },
    },
    plugins: [
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
  