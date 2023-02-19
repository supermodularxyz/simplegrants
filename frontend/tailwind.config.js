/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "IBM Plex Sans",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    extend: {
      colors: {
        sg: {
          primary: "#BBE3FC",
          secondary: "#413A34",
          accent: "#FEC89A",
          neutral: "#BBE3FC",
          info: "#8BCFFA",
          success: "#87CC66",
          warning: "#FFAC66",
          error: "#FF9985",
          900: "#413A34",
          700: "#7D7772",
          500: "#C0B9B3",
          200: "#E3DDD7",
          50: "#F5F2F0",
        },
      },
      boxShadow: {
        card: "0px 4px 8px rgba(227, 221, 215, 0.5)",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
  daisyui: {
    themes: [
      {
        simplegrants: {
          primary: "#BBE3FC",
          secondary: "#413A34",
          accent: "#FEC89A",
          neutral: "#BBE3FC",
          "base-100": "#ffffff",
          info: "#8BCFFA",
          success: "#87CC66",
          warning: "#FFAC66",
          error: "#FF9985",
        },
      },
    ],
  },
};
