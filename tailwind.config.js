/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)', // warm taupe
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // soft champagne
          foreground: 'var(--color-secondary-foreground)', // rich dark brown
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // rose gold
          foreground: 'var(--color-accent-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // muted terracotta
          foreground: 'var(--color-destructive-foreground)', // white
        },
        success: {
          DEFAULT: 'var(--color-success)', // sage green
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // warm amber
          foreground: 'var(--color-warning-foreground)', // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // muted terracotta
          foreground: 'var(--color-error-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // elevated cream
          foreground: 'var(--color-muted-foreground)', // muted brown
        },
        card: {
          DEFAULT: 'var(--color-card)', // elevated cream
          foreground: 'var(--color-card-foreground)', // rich dark brown
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // elevated cream
          foreground: 'var(--color-popover-foreground)', // rich dark brown
        },
        'text-primary': 'var(--color-text-primary)', // rich dark brown
        'text-secondary': 'var(--color-text-secondary)', // muted brown
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Crimson Text', 'serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '144': '36rem',
      },
      maxWidth: {
        '70ch': '70ch',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring': 'cubic-bezier(0.34, 1.26, 0.64, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
      },
      zIndex: {
        '40': '40',
        '45': '45',
        '50': '50',
        '100': '100',
        '200': '200',
        '300': '300',
      },
      keyframes: {
        'pulse-luxury': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-luxury': 'pulse-luxury 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-out': 'slide-out 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-in': 'fade-in 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}