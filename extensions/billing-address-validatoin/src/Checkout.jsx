import React, { useState } from 'react';
import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useBillingAddress,
  useAttributes
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const getAttribute = useAttributes();
  const [selectedBranch, setSelectedBranch] = useState(getAttribute?.[0]?.value);
  const getBillingAddress = useBillingAddress();
  const getBillingAddressCity = getBillingAddress?.city;

  function isBillingAddressSetToPickUpLocation() {
    // console.log("get billing address")
    return getBillingAddressCity === selectedBranch;
  }

  // console.log("getBillingAddress", getBillingAddress);
  // console.log("getAttribute", getAttribute)
  // console.log("isBillingAddressSetToPickUpLocation()", isBillingAddressSetToPickUpLocation())
  // console.log("is this true:", getAttribute && isBillingAddressSetToPickUpLocation())

  return (
    <>
      <Banner title="billing-address-validation">
        Your billing address is currently set to the pickup location.
      </Banner>
      {getAttribute && isBillingAddressSetToPickUpLocation() && (
        <Banner title="billing-address-validation">
          Your billing address is currently set to the pickup location.
        </Banner>
      )}
    </>
  );
}