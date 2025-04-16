import path from "path";
import fs from "fs";
import { CONFIG_FILE_NAME, DEFAULT_OUT_PATH } from "./constants";

/**
 * Configuration options for `next-static-sitemap`.
 *
 * This object can be defined in a configuration file (`next-static-sitemap.config.json|.js|.mjs`)
 * or passed programmatically to the sitemap generator (in CLI or future APIs).
 *
 * @property siteUrl - The base URL of your site. Must start with `http://` or `https://`.
 *                     This value is required and is used to generate the `<loc>` values in the sitemap.
 *
 * @property output - The path where the sitemap file should be written.
 *                    Defaults to `'public/sitemap.xml'` if not provided.
 *
 * @example
 * ```json
 * {
 *   "siteUrl": "https://www.example.com",
 *   "output": "public/custom-sitemap.xml"
 * }
 * ```
 */
export type NextStaticSitemapConfig = {
  output?: string;
  siteUrl: string;
};

export function loadConfig(): Required<NextStaticSitemapConfig> | null {
  const configFilenames = [
    `${CONFIG_FILE_NAME}.js`,
    `${CONFIG_FILE_NAME}.mjs`,
    `${CONFIG_FILE_NAME}.json`,
  ];

  for (const filename of configFilenames) {
    const configPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(configPath)) {
      let config;

      if (configPath.endsWith(".json")) {
        const raw = fs.readFileSync(configPath, "utf-8");
        config = JSON.parse(raw);
      } else {
        config = require(configPath).default ?? require(configPath);
      }
      if (!config) {
        throw new Error(`Config file ${filename} is empty or invalid.`);
      }
      return {
        output: config.output || DEFAULT_OUT_PATH,
        siteUrl: config.siteUrl,
      };
    }
  }

  return null;
}
