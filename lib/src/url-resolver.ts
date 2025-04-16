import { registerUrls } from "./registry";

type Params = Record<string, any> | string;

export function generateUrlsFromParamsAndRegister(
  route: string,
  params: Params[]
) {
  const urls = generateResolvedUrls(route, params);
  registerUrls(urls);
}

export function generateResolvedUrls(
  route: string,
  params: Params[]
): string[] {
  const paramNames = Array.from(route.matchAll(/\[(\w+)\]/g)).map((m) => m[1]);

  return params.map((param) => {
    if (typeof param === "string") {
      return param.startsWith("/") ? param : `/${param}`;
    }

    for (const name of paramNames) {
      if (!(name in param)) {
        throw new Error(
          `🚨 Error en next-static-sitemap: El parámetro '${name}' no está presente en: ${JSON.stringify(
            param
          )}`
        );
      }
    }

    const resolvedPath = route.replace(/\[(\w+)\]/g, (_, key) => param[key]);
    return `/${resolvedPath}`;
  });
}
