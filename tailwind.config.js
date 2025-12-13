/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "grand-hotel": ["var(--font-grand-hotel)"],
        sora: ["var(--font-sora)"],
      },
      colors: {
        "brand-black": "#211E1E",
        "brand-white": "#ffffff",
        lavender: "#F4F3FF",
        primary: "#6155F5",
        grey: "#808080",
        "purple-light": "#CDC9FF",
        "brand-normal": "#6155F5",
        "brand-normal-dark": "#564ae0",
      },
    },
  },
  plugins: [],
};
