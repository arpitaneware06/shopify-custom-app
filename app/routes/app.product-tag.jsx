// app/routes/app.product-tag.jsx
import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import { authenticate } from "../shopify.server";

// ---------------------- LOADER -----------------------------------
export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      products(first: 50) {
        nodes {
          id
          title
          tags
        }
      }
    }
  `);

  const json = await response.json();
  return json.data.products.nodes;
}

// ---------------------- ACTION -----------------------------------
export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const form = await request.formData();

  const selectedProducts = JSON.parse(form.get("selectedProducts"));
  const updatedTags = JSON.parse(form.get("updatedTags")); // new tag array

  for (const product of selectedProducts) {
    await admin.graphql(
      `
      mutation updateProduct($id: ID!, $tags: [String!]) {
        productUpdate(input: { id: $id, tags: $tags }) {
          product { id }
          userErrors { message }
        }
      }
    `,
      {
        variables: {
          id: product.id,
          tags: updatedTags[product.id], // tags for this product only
        },
      }
    );
  }

  return { success: true };
}

// ---------------------- COMPONENT -----------------------------------
export default function ProductTagPage() {
  const products = useLoaderData();
  const fetcher = useFetcher();
  const [tagState, setTagState] = useState(
    Object.fromEntries(products.map((p) => [p.id, [...p.tags]]))
  );

  const handleDeleteTag = (productId, tag) => {
    setTagState((prev) => ({
      ...prev,
      [productId]: prev[productId].filter((t) => t !== tag),
    }));
  };

  const handleAddTag = (productId, tag) => {
    if (!tag.trim()) return;
    setTagState((prev) => ({
      ...prev,
      [productId]: [...prev[productId], tag.trim()],
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontWeight: "bold", marginBottom: 20 }}>
        Bulk Product Tag Manager (Add + Delete)
      </h1>

      <fetcher.Form method="post">
        <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Select</th>
              <th>Product</th>
              <th>Tags</th>
              <th>Add Tag</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                {/* Select Checkbox */}
                <td>
                  <input
                    type="checkbox"
                    name="productSelect"
                    value={JSON.stringify(p)}
                  />
                </td>

                {/* Title */}
                <td>{p.title}</td>

                {/* TAG LIST WITH DELETE BUTTONS */}
                <td>
                  {tagState[p.id].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 8px",
                        background: "#eee",
                        borderRadius: "6px",
                        marginRight: "6px",
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleDeleteTag(p.id, tag)}
                        style={{
                          marginLeft: 6,
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </td>

                {/* ADD TAG INPUT */}
                <td>
                  <input
                    type="text"
                    placeholder="New tag"
                    id={`tag-input-${p.id}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(`tag-input-${p.id}`);
                      handleAddTag(p.id, input.value);
                      input.value = "";
                    }}
                    style={{
                      marginLeft: 8,
                      padding: "4px 10px",
                      background: "#000",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <br /><br />

        {/* UPDATE BUTTON */}
        <button
          type="button"
          onClick={() => {
            const selected = [
              ...document.querySelectorAll("input[name='productSelect']:checked"),
            ].map((el) => JSON.parse(el.value));

            fetcher.submit(
              {
                selectedProducts: JSON.stringify(selected),
                updatedTags: JSON.stringify(tagState),
              },
              { method: "post" }
            );
          }}
          style={{
            padding: "12px 24px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Update Tags For Selected Products
        </button>
      </fetcher.Form>

      {/* SUCCESS MESSAGE */}
      {fetcher.data?.success && (
        <p style={{ marginTop: 20, color: "green", fontSize: "18px" }}>
          ✔ Tags updated successfully!
        </p>
      )}
    </div>
  );
}
