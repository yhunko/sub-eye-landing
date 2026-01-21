// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://subeye.cc",
  i18n: {
    locales: ["en", "ua"],
    defaultLocale: "en",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    remotePatterns: [{ protocol: "https", hostname: "flagcdn.com" }],
  },
});
