import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const body = await request.json();
  const { id } = body;

  const response = await admin.graphql(`
    mutation {
      productDelete(input: {id: "${id}"}) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
  `);

  const result = await response.json();
  const success = result.data?.productDelete?.userErrors?.length === 0;

  return new Response(JSON.stringify({ success }), {
    headers: { "Content-Type": "application/json" },
  });
}
