---
"@0xsequence/marketplace-sdk": patch
---

Remove the need to setup embedded wallet in the SDK config and retrieve wallet config from builder

```diff
type SdkConfig = {
  projectAccessKey: string;
  projectId: string;
-  wallet?: {
-    walletConnectProjectId?: string;
-    embedded?: {
-      waasConfigKey: string;
-      googleClientId?: string;
-      appleClientId?: string;
-      appleRedirectURI?: string;
-    };
-  };
+  walletConnectProjectId?: string;
};
```
