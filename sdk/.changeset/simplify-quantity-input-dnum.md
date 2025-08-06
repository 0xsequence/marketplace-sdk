---
"@0xsequence/marketplace-sdk": patch
---

refactor: simplify QuantityInput component by removing redundant decimals prop

- Created QuantityInputV3 that automatically extracts decimal information from Dnum values
- Removed the redundant `decimals` prop since Dnum already contains this information
- Updated all consumers (BuyModal, TransferModal, MakeOfferModal, CreateListingModal) to use the simplified API
- The component now works directly with Dnum's internal decimal representation, making it less error-prone