module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Header Design Colors
        'header-bg': '#457B9D',
        'header-hover': '#A8DADC',
        'header-cta': '#F4D35E',
        'header-cta-text': '#1D3557',
        'header-border': '#BBDEFB',
        'header-icon-hover-bg': '#1D3557',
        'header-icon-hover': '#F4D35E',
        
        // Hero Section Colors
        'hero-bg': '#1D3557',
        'hero-headline': '#A8DADC',
        'hero-subtext': '#E0FBFC',
        'hero-cta': '#F4D35E',
        'hero-cta-text': '#1D3557',
        
        // Section Background Colors
        'section-bg': '#bce0fb',
        'tile-bg': '#1D3557',
        'tile-text-primary': '#FFFFFF',
        'tile-text-secondary': '#A8DADC',
        
        primary: {
          DEFAULT: '#1D3557', // Deep Indigo Blue (60%)
          light: '#2d4b76',
          dark: '#142640'
        },
        secondary: {
          DEFAULT: '#457B9D', // Steel Blue (25%)
          light: '#5a8cac',
          dark: '#396785'
        },
        tertiary: {
          DEFAULT: '#A8DADC', // Soft Aqua (10%)
          light: '#bce3e5',
          dark: '#8cc6c9'
        },
        'very-light-aqua': '#E0FBFC',
        highlight: {
          DEFAULT: '#F4D35E', // Warm Lemon Yellow (5%)
          light: '#f6dc7e',
          dark: '#f1c93d'
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      boxShadow: {
        'lg': '0 10px 30px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 15px 35px -3px rgba(0, 0, 0, 0.12)'
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: .85
          }
        }
      }
    }
  },
  plugins: []
}
