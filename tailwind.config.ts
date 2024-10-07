import { url } from "inspector";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'main': ['Righteous', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'garden-image': "url('./src/app/assets/gardenimg.png')",
      },
      colors: {
      },
    },
  },
  plugins: [],
};
export default config;
