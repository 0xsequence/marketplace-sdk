---
"@0xsequence/marketplace-sdk": patch
---

feat(payment): show loading modal while fetching payment params

Previously, null was returned while waiting for payment parameters to load between quantity selection and the checkout modal. 
Now, a LoadingModal is displayed, giving users visual feedback and preventing actions outside the checkout flow during this state.