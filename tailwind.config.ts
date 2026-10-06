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
        background: "var(--color-bg)",
        "background-elevated": "var(--color-bg-elevated)",
        foreground: "var(--color-text)",
        muted: "var(--color-text-muted)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        status: {
          unassessed: "var(--color-status-unassessed)",
          collecting: "var(--color-status-collecting)",
          review: "var(--color-status-review)",
          conditional: "var(--color-status-conditional)",
          blocked: "var(--color-status-blocked)",
          verified: "var(--color-status-verified)",
          expired: "var(--color-status-expired)",
          failed: "var(--color-status-failed)",
          cancelled: "var(--color-status-cancelled)",
        },
        severity: {
          critical: "var(--color-severity-critical)",
          high: "var(--color-severity-high)",
          medium: "var(--color-severity-medium)",
          low: "var(--color-severity-low)",
          info: "var(--color-severity-info)",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      }
    },
  },
  plugins: [],
};
export default config;
