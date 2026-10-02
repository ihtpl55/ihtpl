/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: "#111315",       // Deep graphite / primary dark
          slate: "#1A1D20",      // Secondary dark surface
          steel: "#282C31",      // Border dark / tertiary surface
          orange: "#E85D24",     // Primary accent orange
          "orange-hover": "#D44C15",
          "orange-light": "rgba(232, 93, 36, 0.08)",
          light: "#F5F5F2",      // Off white surface
          muted: "#6E7378",      // Body muted text
          border: "#DFE2E4",     // Light border
          navy: "#18222D",       // Corporate navy accent
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'industrial': '0 4px 20px -2px rgba(17, 19, 21, 0.08), 0 2px 6px -1px rgba(17, 19, 21, 0.04)',
        'elevated': '0 12px 32px -4px rgba(17, 19, 21, 0.12), 0 4px 12px -2px rgba(17, 19, 21, 0.06)',
      }
    },
  },
  plugins: [],
}
