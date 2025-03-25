module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: 'rgb(var(--brand-color) / <alpha-value>)', // Tailwind v4 supports this syntax
          },
        },
      },
    },
    plugins: [require('tailwind-scrollbar')],
  }
