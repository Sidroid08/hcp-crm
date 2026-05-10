export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          500: "#1587d4",
          600: "#0c6fb7",
          700: "#0a5a95"
        },
        ink: "#172033",
        line: "#d9e2ef"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};
