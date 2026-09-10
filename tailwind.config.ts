import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official GSM Color Palette
        sirkula: {
          forest: '#1B4935',    // Primary Deep Forest Green
          mint: '#66C699',      // Secondary Mint / Sage Green
          gold: '#D4A359',      // Warm Mustard / Gold Accent
          coral: '#E07A5F',     // Terracotta / Coral Orange
          cream: '#F6F4EE',     // Soft Cream / Off-White
          charcoal: '#262525',  // Dark Background / Slate Charcoal
        },
        darkbg: '#1E1D1D',
        cardbg: '#262525',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
