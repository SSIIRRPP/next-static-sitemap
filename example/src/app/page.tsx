import { registerStaticRoutes } from "next-static-sitemap";

registerStaticRoutes("/");

export default function Home() {
  return <h1>App Router Home</h1>;
}
