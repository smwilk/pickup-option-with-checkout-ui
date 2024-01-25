import React, { useState } from 'react';

import {
  reactExtension,
  BlockStack,
  Choice,
  ChoiceList,
  Banner,
  Icon,
  InlineStack,
  useAttributes,
  useShippingAddress,
  useApplyShippingAddressChange
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const shippingAddress = useShippingAddress();
  const applyShippingAddressChange = useApplyShippingAddressChange();
  const getAttribute = useAttributes();
  const [selectedBranch, setSelectedBranch] = useState(getAttribute?.[0]?.value);
  console.log("selectedBranch:", selectedBranch);
  const [selectedValue, setSelectedValue] = useState("ship");
  console.log({ shippingAddress })
  console.log("updateAddress", applyShippingAddressChange)

  async function updateAddress() {
    // Define addresses for branches
    const yokohama = {
      address1: "Miyagaya, Nishi",
      city: "Yokohama",
      countryCode: "JP",
      provinceCode: "Kanagawa",
      postalCode: "2200000"
    }

    const akasaka = {
      address1: "Akasaka",
      city: "Minato",
      countryCode: "JP",
      provinceCode: "Tokyo",
      postalCode: "1078332"
    }

    const shinagawa = {
      address1: "Kitashinagawa",
      city: "Shinagawa",
      countryCode: "JP",
      provinceCode: "Tokyo",
      postalCode: "1098792"
    }

    // Default to Akasaka
    let address = akasaka
    if (selectedBranch === "Yokohama") {
      address = yokohama
    } else if (selectedBranch === "Shinagawa") {
      address = shinagawa
    }
    const result = await applyShippingAddressChange({
      type: "updateShippingAddress",
      address: address
    });


    console.log("updated address result:", result);
  }

  return (
    <InlineStack>
      <ChoiceList
        name="group-single"
        variant="group"
        value={selectedValue}
        onChange={(value) => {
          setSelectedValue(value);
          if (value === "pick-up") {
            setSelectedBranch(getAttribute?.[0]?.value);
            updateAddress();
          }
        }}
      >
        <Choice
          secondaryContent={<Icon source="truck" />}
          id="ship"
        >
          Ship
        </Choice>
        <Choice
          secondaryContent={<Icon source="store" />}
          id="pick-up"
        >
          Pick up in store at {selectedBranch} branch
        </Choice>
      </ChoiceList>
      {selectedValue === "pick-up" && (
        <Banner status="warning">
          Your shipping address is prefilled with the {selectedBranch} location address. Please do not change the shipping address.
        </Banner>
      )}
    </InlineStack>
  );
}