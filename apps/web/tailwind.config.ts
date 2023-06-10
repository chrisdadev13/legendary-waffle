import baseConfig from "@calypso/tailwind-config";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx", "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"],
  presets: [baseConfig],
} satisfies Config;
