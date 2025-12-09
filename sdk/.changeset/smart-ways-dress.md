---
"@0xsequence/marketplace-sdk": patch
---

remove hook callback APIs

Remove all legacy hook-callback parameters and types. 
Breaking change: consumers must stop passing callbacks and instead handle results and errors through queryClient.
