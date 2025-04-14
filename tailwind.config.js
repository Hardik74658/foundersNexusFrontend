module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--brand-color) / <alpha-value>)', // Tailwind v4 supports this syntax
        },
      },
      animation: {
        'bounce-once': 'bounce 0.6s ease-in-out'
      }
    },
  },
  plugins: [require('tailwind-scrollbar')],
}