// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://www.subeye.cc",

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

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          ua: "uk-UA",
        },
      },
    }),
  ],

  adapter: vercel({
    imageService: true,
    devImageService: "sharp",
  }),
});
