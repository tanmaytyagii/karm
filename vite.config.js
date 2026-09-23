import { defineConfig } from "vite";

/* Scrapers and search engines only read absolute URLs. The deploy workflow
   passes the Pages URL as SITE_URL; local builds stay relative and carry no
   canonical, rather than guess an address. */
const site = process.env.SITE_URL?.replace(/\/*$/, "/");

const absoluteUrls = {
  name: "karm:absolute-urls",
  apply: "build",
  enforce: "post",
  /* after Vite has resolved asset paths in the emitted HTML */
  generateBundle(_, bundle) {
    const page = bundle["index.html"];
    if (!site || !page) return;
    page.source = String(page.source)
      .replace(
        /(<meta property="og:image" content=")(?:\.\/)?([^"]+)"/,
        (_, head, file) => `${head}${new URL(file, site)}"`
      )
      .replace(
        /(<meta property="og:type"[^>]*>)/,
        `$1\n<meta property="og:url" content="${site}">\n<link rel="canonical" href="${site}">`
      );
  }
};

export default defineConfig({
  /* relative asset URLs, so the build works from any subpath (GitHub Pages) */
  base: "./",
  plugins: [absoluteUrls]
});
