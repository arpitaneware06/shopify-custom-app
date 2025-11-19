// app/routes/api/products.js

import { authenticate } from "../../shopify.server.js";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      products(first: 10) {
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

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
