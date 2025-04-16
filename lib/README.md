# 🗘️ next-static-sitemap

Automatic `sitemap.xml` generator for **Next.js** applications, with native support for **App Router** and **Page Router**. Fully functional and plugin-free. Simple, flexible, and zero-route-modification required.

---

## 🚀 Installation

```bash
npm install next-static-sitemap
# or
yarn add next-static-sitemap
```

---

## ⚖️ Requirements

- ✅ Next.js `>=13.3.0`
- ✅ Compatible with both Webpack and Turbopack builds

---

## ❓ Why use this?

- ✨ **Zero-config**: Just register your params and you're done.
- ✅ **App Router & Page Router support**
- ⚡ **Fast and lightweight** – no need for a plugin or custom server
- 🚫 **No route rewriting** or folder restructuring needed
- ✏️ **Type-safe** and developer-friendly
- 🚀 **Supports Turbopack via CLI wrapper**

---

## ⚖️ Configuration

You must provide a config file named `next-static-sitemap.config` in the root of your project.

### Config options

```ts
interface NextStaticSitemapConfig {
  siteUrl: string; // required
  output?: string; // optional (defaults to public/sitemap.xml)
}
```

### Supported config file formats:

- `next-static-sitemap.config.json`
- `next-static-sitemap.config.mjs`
- `next-static-sitemap.config.js`

### Example (ES)

```js
/** @type {import('next-static-sitemap').NextStaticSitemapConfig} */
const config = {
  siteUrl: "https://example.com",
};

export default config;
```

---

## 🥮 Usage

Use the CLI wrapper to run `next` and generate your sitemap automatically:

### Replace `next build` and `next dev`

```json
{
  "scripts": {
    "build": "next-static-sitemap build",
    "dev": "next-static-sitemap dev"
  }
}
```

This ensures that:

- The sitemap is generated after build.
- In dev mode, the sitemap is regenerated automatically whenever routes change.

---

## 🚤 Example route definitions

### App Router

```ts
import { defineRouteParams } from "next-static-sitemap";

// The second argument receives the same arguments as generateStaticParams
// e.g. (params, segment, ...) in App Router

export const generateStaticParams = defineRouteParams(
  "/blog/[slug]",
  async () => [{ slug: "hello-world" }, { slug: "another-post" }]
);
```

### Page Router

```ts
import { withStaticPaths } from "next-static-sitemap";

// The second argument receives the same arguments as getStaticPaths
// and should return an object with `paths` and `fallback`
// e.g. (context) with { locales, defaultLocale, ... } in Page Router

export const getStaticPaths = withStaticPaths("/blog/[slug]", async () => ({
  paths: [
    { params: { slug: "hello-world" } },
    { params: { slug: "another-post" } },
  ],
  fallback: false,
}));
```

### Static Routes (no dynamic params)

> ⚠️ **Temporary workaround**: Static routes (like `/`, `/about`, etc.) must be registered manually. This limitation will be addressed in a future version.

For now, you can do this at the top of the page file:

```ts
// app/page.tsx or pages/index.tsx
import { registerStaticRoutes } from "next-static-sitemap";

// Accepts a string or an array of strings
registerStaticRoutes(["/"]);

export default function HomePage() {
  return <h1>Welcome to my site</h1>;
}
```

---

## 💜 Recommended `.gitignore` setup

To avoid committing the generated `sitemap.xml`, add this to your `.gitignore`:

```
/public/sitemap.xml
```

---

## 📄 License

MIT © SSIIRRPP
