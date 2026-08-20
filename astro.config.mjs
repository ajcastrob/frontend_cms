// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import supersvgPlugin from "vite-plugin-supersvg";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), supersvgPlugin()],
  },
});
