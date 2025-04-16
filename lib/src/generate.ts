import { getRegisteredUrls } from "./registry";
import { loadConfig } from "./config";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { DEFAULT_OUT_PATH } from "./constants";

export async function generateSitemap() {
  const config = await loadConfig();

  if (!config?.siteUrl) {
    throw new Error("[next-static-sitemap] siteUrl is required");
  }

  const urls = getRegisteredUrls();

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (url) =>
        `  <url><loc>${config.siteUrl!.replace(/\/+$/, "")}/${url.replace(
          /^\/+/,
          ""
        )}</loc></url>`
    ),
    "</urlset>",
  ].join("\n");

  const outPath = config.output ?? DEFAULT_OUT_PATH;

  const outputPath = path.resolve(outPath);
  const dir = path.dirname(outputPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  writeFileSync(outputPath, sitemap, "utf8");

  const isNotDefaultOutPath = outPath !== DEFAULT_OUT_PATH;

  console.log(
    `[next-static-sitemap] ✅ Sitemap generated${
      isNotDefaultOutPath ? ` at ${outputPath}` : ""
    }`
  );
}
