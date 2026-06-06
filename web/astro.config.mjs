import { defineConfig } from "astro/config";

const publicAssetOrigin = (process.env.PUBLIC_ASSET_ORIGIN ?? "").replace(/\/$/, "");

export default defineConfig({
  site: process.env.SITE_URL ?? "https://streetcornerfoodie.com",
  output: "static",
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en", "ja"],
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      en: "zh",
      ja: "zh",
    },
  },
  server: { port: 4321, host: true },
  vite: {
    define: {
      "import.meta.env.PUBLIC_ASSET_ORIGIN": JSON.stringify(publicAssetOrigin),
    },
    server: {
      fs: { allow: [".."] },
    },
    optimizeDeps: {
      include: ["aria-query", "echarts"],
      /** Dev: avoid stale 504 on echarts chunks after adding the dependency */
      force: process.env.VITE_FORCE_DEPS === "1",
    },
    ssr: {
      noExternal: ["echarts"],
    },
  },
});
