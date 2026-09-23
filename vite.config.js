import { defineConfig } from "vite";

/* Scrapers only read absolute og:image URLs. The deploy workflow passes the
   Pages URL as SITE_URL; local builds keep the relative path. */
const site = process.env.SITE_URL?.replace(/\/*$/, "/");

const absoluteOgImage = {
  name: "karm:absolute-og-image",
  apply: "build",
  enforce: "post",
  /* after Vite has resolved asset paths in the emitted HTML */
  generateBundle(_, bundle) {
    const page = bundle["index.html"];
    if (!site || !page) return;
    page.source = String(page.source).replace(
      /(<meta property="og:image" content=")(?:\.\/)?([^"]+)"/,
      (_, head, file) => `${head}${new URL(file, site)}"`
    );
  }
};

export default defineConfig({
  /* relative asset URLs, so the build works from any subpath (GitHub Pages) */
  base: "./",
  plugins: [absoluteOgImage]
});
