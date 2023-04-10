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
          accent: "#9C6353",
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
      scale: {
        200: "2",
      },
      fontSize: {
        "subtitle-1": "22px",
      },
      backgroundImage: {
        "sg-gradient": "linear-gradient(90deg, #FFE0DB 26.25%, #FFE1A7 100%)",
      },
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
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
          accent: "#9C6353",
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
