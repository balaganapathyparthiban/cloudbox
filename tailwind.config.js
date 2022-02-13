module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: { min: "320px", max: "767px" },
        tablet: { min: "768px", max: "1023px" },
        laptop: { min: "1024px", max: "1439px" },
        desktop: { min: "1440px", max: "2559px" },
        fourK: { min: "2560px" },
      },
    },
  },
  plugins: [],
};
