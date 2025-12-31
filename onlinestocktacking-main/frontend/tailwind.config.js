/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Space Grotesk'", "sans-serif"]
      },
      colors: {
        ink: "#13131a",
        paper: "#f7f2eb",
        accent: "#ff6b35",
        accentDark: "#e85118",
        ocean: "#0f766e",
        night: "#101320"
      },
      boxShadow: {
        glow: "0 10px 30px rgba(255, 107, 53, 0.2)"
      }
    }
  },
  plugins: []
};
