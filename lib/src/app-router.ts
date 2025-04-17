import { generateUrlsFromParamsAndRegister } from "./url-resolver";

/**
 * Wraps a `generateStaticParams`-like function to register dynamic routes for the sitemap.
 *
 * This utility should be used in **App Router** with `generateStaticParams()` to automatically
 * collect and store resolved route parameters for sitemap generation.
 *
 * @template T The shape of each route parameter object (e.g., `{ slug: string }`)
 * @template P The parameters passed to the wrapped `getParams` function
 *
 * @param route - The route pattern (e.g., `/blog/[slug]`)
 * @param getParams - A function that receives the same parameters as `generateStaticParams()` and returns an array of parameter objects
 *
 * @returns An async function that resolves the route parameters and registers the corresponding URLs
 *
 * @example
 * ```ts
 * export const generateStaticParams = defineRouteParams(
 *   '/blog/[slug]',
 *   async () => [{ slug: 'one' }, { slug: 'two' }]
 * );
 * ```
 */
export function defineRouteParams<
  T extends Record<string, any>,
  P extends unknown[]
>(route: string, getParams: (...params: P) => Promise<T[]>) {
  return async (...params: P) => {
    const allParams = await getParams(...params);
    generateUrlsFromParamsAndRegister(route, allParams);
    return allParams;
  };
}
