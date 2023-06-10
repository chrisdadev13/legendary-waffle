import baseConfig from "@calypso/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  ...baseConfig,
  content: ["./**/*.{js,ts,jsx,tsx,mdx}"],
} satisfies Config;
