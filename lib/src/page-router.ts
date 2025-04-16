import { generateUrlsFromParamsAndRegister } from "./url-resolver";
import type {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from "next";

/**
 * Wraps a `getStaticPaths`-like function to register dynamic routes for the sitemap.
 *
 * This utility should be used in the **Page Router** with `getStaticPaths()` to automatically
 * collect and store resolved route parameters for sitemap generation.
 *
 * @param route - The route pattern (e.g., `/blog/[slug]`)
 * @param getPaths - A function that receives the same arguments as `getStaticPaths()`
 * and returns `GetStaticPathsResult` or `Promise<GetStaticPathsResult>`
 *
 * @returns A `getStaticPaths`-compatible function that registers URLs before returning the result
 *
 * @example
 * ```ts
 * export const getStaticPaths = withStaticPaths('/blog/[slug]', async () => ({
 *   paths: [
 *     { params: { slug: 'hello' } },
 *     { params: { slug: 'world' } }
 *   ],
 *   fallback: 'blocking'
 * }));
 * ```
 */
export function withStaticPaths(
  route: string,
  getPaths: (
    ctx: GetStaticPathsContext
  ) => Promise<GetStaticPathsResult> | GetStaticPathsResult
): GetStaticPaths {
  return async (ctx: GetStaticPathsContext) => {
    const result = await getPaths(ctx);
    const allParams = result.paths.map((p) =>
      typeof p === "string" ? p : p.params
    );

    generateUrlsFromParamsAndRegister(route, allParams);

    return result;
  };
}
