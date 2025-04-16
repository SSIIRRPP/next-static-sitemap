import fs from "fs";
import path from "path";
import crypto from "crypto";
import { GENERATION_FILE_NAME, GENERATION_FOLDER_NAME } from "./constants";

const REGISTRY_PATH = path.resolve(
  `${GENERATION_FOLDER_NAME}/${GENERATION_FILE_NAME}`
);
const REGISTRY_PATH_DIR = path.dirname(REGISTRY_PATH);

/**
 * Registers one or more static (non-dynamic) routes to be included in the sitemap.
 *
 * Use this for pages that do not have dynamic parameters and are not tracked by
 * `generateStaticParams` or `getStaticPaths`, such as `/`, `/about`, `/contact`, etc.
 *
 * This function is typically called at the top of a static page file (e.g., `app/page.tsx` or `pages/index.tsx`).
 * In future versions this may be automated.
 *
 * @param routes - A single route string or an array of route strings. Each route must start with `/`.
 *
 * @example
 * ```ts
 * // pages/index.tsx
 * import { registerStaticRoutes } from 'next-static-sitemap';
 *
 * registerStaticRoutes(['/']);
 * ```
 */
export function registerStaticRoutes(routes: string | string[]) {
  if (Array.isArray(routes)) {
    registerUrls(routes);
  } else {
    registerUrls([routes]);
  }
}

function readRegistry(): string[] {
  if (!fs.existsSync(REGISTRY_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
    return Array.isArray(data.urls) ? data.urls : [];
  } catch {
    return [];
  }
}

function registerUrls(newUrls: string[]) {
  const current = new Set(readRegistry());
  let updated = false;

  for (const url of newUrls) {
    if (!current.has(url)) {
      current.add(url);
      updated = true;
    }
  }

  if (updated) {
    persistUrlsToDisk(Array.from(current));
  }
}

function getRegisteredUrls(): string[] {
  return readRegistry();
}

function persistUrlsToDisk(urls: string[]) {
  const dir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify({ urls: Array.from(new Set(urls)).sort() }, null, 2),
    "utf-8"
  );
}

function getRegistryHash(): string {
  const urls = readRegistry().sort();
  return crypto.createHash("md5").update(JSON.stringify(urls)).digest("hex");
}

function clearRegistry(): void {
  try {
    if (fs.existsSync(REGISTRY_PATH_DIR)) {
      fs.rmSync(REGISTRY_PATH_DIR, { recursive: true, force: true });
    }
  } catch {}
}

export {
  registerUrls,
  getRegisteredUrls,
  getRegistryHash,
  clearRegistry,
  REGISTRY_PATH,
  REGISTRY_PATH_DIR,
};
