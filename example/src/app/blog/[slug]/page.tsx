import { defineRouteParams } from "next-static-sitemap";

export const generateStaticParams = defineRouteParams(
  "/blog/[slug]",
  async () => [{ slug: "uno" }, { slug: "dos" }, { slug: "tres" }]
);

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>Mixed Router - Blog Home {slug}</h1>;
}
