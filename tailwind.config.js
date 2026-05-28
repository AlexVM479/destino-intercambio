/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space+Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        bounce_in: {
          '0%':   { transform: 'scale(1)' },
          '30%':  { transform: 'scale(1.22)' },
          '55%':  { transform: 'scale(0.91)' },
          '75%':  { transform: 'scale(1.10)' },
          '90%':  { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        bill_fly: {
          '0%':   { transform: 'translate(0,0) scale(1) rotate(0deg)',   opacity: '1' },
          '40%':  { transform: 'translate(calc(var(--tx)*0.5), calc(var(--ty)*0.4)) scale(0.8) rotate(20deg)', opacity: '1' },
          '80%':  { transform: 'translate(calc(var(--tx)*0.9), calc(var(--ty)*0.9)) scale(0.4) rotate(40deg)', opacity: '0.7' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0) rotate(60deg)', opacity: '0' },
        },
        pop_in: {
          '0%':   { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '70%':  { transform: 'scale(1.12) rotate(4deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        modal_in: {
          '0%':   { transform: 'scale(0.88) translateY(16px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)',        opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confetti_fall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)',   opacity: '1' },
          '100%': { transform: 'translateY(320px) rotate(720deg)', opacity: '0' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
          '50%':       { boxShadow: '0 0 0 14px rgba(16, 185, 129, 0.13)' },
        },
        slide_up: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        milestone_pop: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.35)' },
          '70%':  { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
        fill_rise: {
          '0%':   { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        bounce_in:     'bounce_in 0.6s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
        bill_fly:      'bill_fly 0.65s cubic-bezier(0.4,0,0.2,1) forwards',
        pop_in:        'pop_in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        modal_in:      'modal_in 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        shimmer:       'shimmer 2s linear infinite',
        confetti_fall: 'confetti_fall 1.3s ease-in forwards',
        pulse_glow:    'pulse_glow 2s ease-in-out infinite',
        slide_up:      'slide_up 0.35s ease-out forwards',
        milestone_pop: 'milestone_pop 0.5s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
      },
    },
  },
  plugins: [],
}
