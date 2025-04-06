/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mint': '#3ab795',
        'celadon': '#a0e8af',
        'cambridge-blue': '#86baa1',
        'beige': '#edead0',
        'sunglow': '#ffcf56',
        // Map old colors to new ones
        'eerie-black': '#1a1f16',
        'pakistan-green': '#3ab795', // mint
        'hunter-green': '#86baa1', // cambridge-blue
        'fern-green': '#a0e8af', // celadon
        'emerald': '#3ab795', // mint
        'spring-green': '#86baa1', // cambridge-blue
        'racing-green': '#3ab795', // mint 
        'primary': '#3ab795', // mint
        'primary-dark': '#86baa1', // cambridge-blue
        'secondary': '#a0e8af', // celadon
        'secondary-dark': '#3ab795', // mint
        'accent': '#ffcf56', // sunglow
        'charcoal': '#1a1f16', // eerie-black
        'dark-navy': '#1a1f16', // eerie-black
        'dark-lighter': '#86baa1', // cambridge-blue
      },
      fontFamily: {
        'sans': ['Outfit', 'ui-sans-serif', 'system-ui'],
        'heading': ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 15px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'border-pulse': 'border-pulse 2s infinite',
      },
      keyframes: {
        'border-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(58, 183, 149, 0)' 
          },
          '50%': { 
            boxShadow: '0 0 0 3px rgba(58, 183, 149, 0.5)' 
          },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1a1f16, #3ab795, #86baa1, #a0e8af, #ffcf56)',
      },
    },
  },
  plugins: [],
} 