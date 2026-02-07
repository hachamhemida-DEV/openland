import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary - Deep Algerian Forest Green
                primary: {
                    DEFAULT: "#1B4D3E",
                    light: "#2E7D32",
                    dark: "#0F2E25",
                    foreground: "#FFFFFF",
                },
                // Accent - Golden Wheat (CTAs)
                accent: {
                    DEFAULT: "#EDA137",
                    light: "#F5C463",
                    dark: "#D4891F",
                    foreground: "#1a1a1a",
                },
                // Backgrounds
                sand: "#F9F7F2",
                soil: "#8D6E63",
                // Semantic colors
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-almarai)", "system-ui", "sans-serif"],
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem",
                "4xl": "2rem",
            },
            boxShadow: {
                "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                "glass-sm": "0 4px 16px 0 rgba(31, 38, 135, 0.1)",
                "land-card": "0 4px 20px -4px rgba(0, 0, 0, 0.1)",
                "land-card-hover": "0 20px 40px -8px rgba(0, 0, 0, 0.2)",
            },
            backdropBlur: {
                "glass": "16px",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "fade-in-up": "fadeInUp 0.6s ease-out",
                "slide-in-right": "slideInRight 0.5s ease-out",
                "scale-in": "scaleIn 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
