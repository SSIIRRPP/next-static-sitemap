import { withStaticPaths } from "next-static-sitemap";

export const getStaticPaths = withStaticPaths("/product/[sku]", async () => ({
  paths: [{ params: { sku: "abc123" } }, { params: { sku: "def456" } }],
  fallback: false,
}));

export async function getStaticProps({ params }: { params: { sku: string } }) {
  return { props: { params } };
}

export default function ProductPage({ params }: { params: { sku: string } }) {
  return <h1>Product SKU: {params?.sku}</h1>;
}
