import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 金色系列
        gold: {
          50: '#FFF9E5',
          100: '#FFEDB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        // 品牌金色
        brand: {
          gold: '#D4AF37',
          goldLight: '#FFD700',
          goldDark: '#B8860B',
        },
        // 深色背景
        dark: {
          900: '#0A0F1C',
          800: '#0F1629',
          700: '#151D32',
          600: '#1A2440',
          500: '#222D4D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serifSC: ['var(--font-noto-serif-sc)', 'Source Han Serif SC', 'Noto Serif SC', 'Georgia', 'serif'],
        monoDisp: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0F1C 0%, #0F1629 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
