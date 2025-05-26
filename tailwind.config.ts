import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "form-bg": "#f6fbf9",
        mediumaquamarine: "#84c7ae",
        darkcyan: "#52947a",
        white: "#fff",
        paragraph: "#32403b",
        heading: "#212b27",
        thistle: "#f0d0e2",
      },
      spacing: {},
      fontFamily: {
        karla: "Karla",
      },
      borderRadius: {
        "30xl-1": "49.1px",
        "4xl": "23px",
        "141xl": "160px",
      },
    },
    fontSize: {
      "14xl-7": "33.7px",
      "4xl": "23px",
      lg: "18px",
      "36xl-2": "55.2px",
      "14xl": "33px",
      "25xl": "44px",
      inherit: "inherit",
    },
    screens: {
      mq750: {
        raw: "screen and (max-width: 750px)",
      },
      mq675: {
        raw: "screen and (max-width: 675px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
  plugins: [],
};
export default config;
