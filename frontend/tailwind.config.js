/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: '#1e1e1e',           // VS Code main editor canvas
          sidebar: '#252526',      // VS Code sidebar & title
          panel: '#252526',        // VS Code panels & cards
          header: '#2d2d2d',       // VS Code tab bar / table headers
          border: '#2d2d2d',       // VS Code border
          borderLight: '#3e3e42',  // VS Code input & secondary border
          hover: '#2a2d2e',        // VS Code row hover
          active: '#37373d',       // VS Code active item
          input: '#3c3c3c',        // VS Code input box
          blue: '#007acc',         // VS Code accent blue
          blueHover: '#1177bb',
          blueActive: '#0e639c',
          text: '#cccccc',         // VS Code text
          textMuted: '#858585',    // VS Code muted text
          textBright: '#ffffff',   // VS Code bright text
          statusbar: '#007acc',
        },
        aicte: {
          blue: '#002B49',
          orange: '#FF6F00',
          navy: '#0F172A',
          gold: '#C59B27',
        },
        // Direct mapping of Tailwind slate tokens to VS Code theme in dark mode
        slate: {
          700: '#3e3e42',
          750: '#333333',
          800: '#2d2d2d',
          850: '#282828',
          900: '#252526',
          950: '#1e1e1e',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Consolas', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
        'none': 'none',
      }
    },
  },
  plugins: [],
}
