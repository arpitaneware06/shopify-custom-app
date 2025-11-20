import { useState } from "react";
import {
  Page,
  Button,
  Card,
  TextField,
  Checkbox,
  InlineStack,
} from "@shopify/polaris";

export default function CustomPage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState({});
  const [loaded, setLoaded] = useState(false);

  async function loadProducts() {
    const response = await fetch("/app/products");
    const data = await response.json();
    setProducts(data.products);

    // reset selection
    const defaultChecked = {};
    data.products.forEach((p) => (defaultChecked[p.id] = false));
    setSelected(defaultChecked);

    setLoaded(true);
  }

  function toggleCheckbox(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function saveSelectedProducts() {
    const selectedIds = products.filter((p) => selected[p.id]);

    for (const prod of selectedIds) {
      await fetch("/app/update-product", {
        method: "POST",
        body: JSON.stringify({ id: prod.id, title: prod.title }),
      });
    }

    alert("Selected products updated!");
  }

  async function deleteSelectedProducts() {
    const selectedIds = products.filter((p) => selected[p.id]);

    for (const prod of selectedIds) {
      await fetch("/app/delete-product", {
        method: "POST",
        body: JSON.stringify({ id: prod.id }),
      });
    }

    alert("Selected products deleted!");

    setProducts(products.filter((p) => !selected[p.id]));
  }

  return (
    <Page title="Manage Products
    ">
      <Button primary onClick={loadProducts}>
        Products
      </Button>

      {/* Show group buttons when products are selected */}
      {loaded && (
        <InlineStack gap="400" align="start" blockAlign="center" style={{marginTop: "16px"}}>
          <Button primary onClick={saveSelectedProducts}>
            Save Selected
          </Button>

          <Button tone="critical" onClick={deleteSelectedProducts}>
            Delete Selected
          </Button>

          <Button tone="critical">
            Cancle Any time you want 
          </Button>
          
        </InlineStack>
      )}

      {/* Product list */}
      {loaded &&
        products.map((product) => (
          <Card key={product.id} sectioned>
            <InlineStack gap="300" align="start" blockAlign="center">
              <Checkbox
                checked={selected[product.id]}
                onChange={() => toggleCheckbox(product.id)}
              />

              <TextField
                label={product.title}
                labelHidden
                value={product.title}
                onChange={(value) => {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === product.id ? { ...p, title: value } : p
                    )
                  );
                }}
              />
            </InlineStack>
          </Card>
        ))}
    </Page>
  );
}
