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
  useApplyShippingAddressChange,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  Button
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const [isErrorMessageDisplayed, setIsErrorMessageDisplayed] = useState(false);
  const [validationError, setValidationError] = useState("");
  const canBlockProgress = useExtensionCapability("block_progress");
  const shippingAddress = useShippingAddress();
  const applyShippingAddressChange = useApplyShippingAddressChange();
  const getAttribute = useAttributes();
  const [selectedBranch, setSelectedBranch] = useState(getAttribute?.[0]?.value);
  const [selectedValue, setSelectedValue] = useState("ship");

  function doesShippingAddressMatchSelectedBranch() {
    return shippingAddress.city === selectedBranch;
  }

  useBuyerJourneyIntercept(() => {
    if (selectedBranch && canBlockProgress && !doesShippingAddressMatchSelectedBranch()) {
      setIsErrorMessageDisplayed(true);
      return {
        behavior: "block",
        reason: "You selected a pickup option but updated the address",
        errors: [
          {
            message: `You have selected ${selectedBranch} for the pickup location. Please do not update the shipping address.`,
          },
        ],
        perform: (result) => {
          if (result.behavior === "block") {
            setValidationError("Do not update address");
          }
        },
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        setValidationError("");
      },
    };
  });

  async function updateAddress() {
    const addresses = {
      Yokohama: {
        address1: "Miyagaya, Nishi",
        city: "Yokohama",
        countryCode: "JP",
        provinceCode: "Kanagawa",
        postalCode: "2200000"
      },
      Akasaka: {
        address1: "Akasaka",
        city: "Minato",
        countryCode: "JP",
        provinceCode: "Tokyo",
        postalCode: "1078332"
      },
      Shinagawa: {
        address1: "Kitashinagawa",
        city: "Shinagawa",
        countryCode: "JP",
        provinceCode: "Tokyo",
        postalCode: "1098792"
      }
    };

    const address = addresses[selectedBranch] || addresses.Akasaka;
    const result = await applyShippingAddressChange({
      type: "updateShippingAddress",
      address: address
    });
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
      {isErrorMessageDisplayed && (
        <Button onPress={updateAddress}>
          Apply branch address
        </Button>
      )}
    </InlineStack>
  );
}