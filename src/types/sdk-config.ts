export type Env = "development" | "next" | "production";

export type SdkConfig = {
  projectAccessKey: string;
  projectId: string;
  wallet?: {
    walletConnectProjectId?: string;
    embedded?: {
      waasConfigKey?: string;
      walletConnectProjectId?: string;
      googleClientId?: string;
      appleClientId?: string;
      appleRedirectURI?: string;
    };
  };
  _internal?: {
    devAccessKey?: string;
    nextAccessKey?: string;
    builderEnv?: Env;
    marketplaceEnv?: Env;
    metadataEnv?: Env;
    indexerEnv?: Env;
  };
};
