// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        stardew: ['Stardew', 'sans-serif'],
      },
      screens: {
        // Default Tailwind breakpoints are:
        // 'sm': '640px',
        // 'md': '768px',
        // 'lg': '1024px',
        // 'xl': '1280px',
        // '2xl': '1536px',

        '3xl': '1700px', // Example: adding a breakpoint before 2000px if needed
        '4xl': '2000px', // Your new breakpoint at 2000px
        '5xl': '2200px', // Another example for an even larger breakpoint
        // You can name it whatever makes sense, e.g., 'max-screen'
        // 'max-screen': '2000px',
      },
    },
  },
  plugins: [],
}
