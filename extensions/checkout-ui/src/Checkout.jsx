import '@shopify/ui-extensions/preact';
import {render} from "preact";
import {useState} from "preact/hooks";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [giftAdded, setGiftAdded] = useState(false);

  // if checkout does not allow attribute change
  if (!shopify.instructions.value.attributes.canUpdateAttributes) {
    return (
      <s-banner heading="checkout-ui" tone="warning">
        Attribute changes are not supported on this checkout.
      </s-banner>
    );
  }

  async function handleClick() {
    const result = await shopify.applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: "yes",
    });

    console.log("applyAttributeChange result", result);

    if (result.type === "success") {
      setGiftAdded(true);
    }
  }

  return (
    <s-banner heading="checkout-ui">
      <s-stack gap="base">
        <s-text>
          Add your free gift for this order 🎁
        </s-text>

        {!giftAdded && (
          <s-button onClick={handleClick}>
            Add free gift to my order
          </s-button>
        )}

        {giftAdded && (
          <s-text tone="success">
            🎉 Free gift request submitted!  
            It will be added automatically before the order is fulfilled.
          </s-text>
        )}
      </s-stack>
    </s-banner>
  );
}
