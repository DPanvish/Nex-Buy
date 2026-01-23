/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff9300", 
          light: "#ffa645",        
          dark: "#cf7200", 
        },
        background: {
          DEFAULT: "#1b1816", 
          light: "#0b0908",
          lighter: "#000000",
        },
        surface: {
          DEFAULT: "#2f1b05", 
          light: "#0b0908",       
        },
        text: {
          primary: "#cdcdcd", 
          secondary: "#d2ccc7", 
          tertiary: "#131616",
        },
        accent: {
          DEFAULT: "#43a900",
          red: "#f35248",     
          yellow: "#d97708", 
        },
      },
    },
    plugins: [],
  }
}