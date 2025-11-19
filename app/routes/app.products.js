import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `);

  const data = await response.json();
  const products = data?.data?.products?.edges?.map((e) => e.node) || [];

  return new Response(JSON.stringify({ products }), {
    headers: { "Content-Type": "application/json" },
  });
}
