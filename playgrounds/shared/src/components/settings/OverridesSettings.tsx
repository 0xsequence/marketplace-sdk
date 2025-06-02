"use client";

import { useOpenConnectModal } from "@0xsequence/connect";
import {
  Badge,
  Button,
  Collapsible,
  Divider,
  Select,
  Switch,
  Text,
  TextInput,
} from "@0xsequence/design-system";
import type {
  ApiConfig,
  ContractType,
  Env,
  MarketplaceConfig,
  OrderbookKind,
} from "@0xsequence/marketplace-sdk";
import { OrderbookKind as OrderbookKindEnum } from "@0xsequence/marketplace-sdk";
import { useMemo, useState } from "react";
import type { Address } from "viem";
import { isAddress } from "viem";
import { useAccount, useDisconnect } from "wagmi";
import { useMarketplace } from "../../store";
import type { ApiOverrides } from "../../store/store";

const API_SERVICES: Array<{ key: keyof ApiOverrides; label: string }> = [
  { key: "builder", label: "Builder API" },
  { key: "marketplace", label: "Marketplace API" },
  { key: "indexer", label: "Indexer" },
  { key: "metadata", label: "Metadata" },
  { key: "nodeGateway", label: "Node Gateway" },
  { key: "sequenceApi", label: "Sequence API" },
  { key: "sequenceWallet", label: "Sequence Wallet" },
] as const;

const ENV_OPTIONS = [
  { label: "Production", value: "production" },
  { label: "Development", value: "development" },
  { label: "Next", value: "next" },
];

const CONTRACT_TYPE_OPTIONS = [
  { label: "ERC721", value: "ERC721" },
  { label: "ERC1155", value: "ERC1155" },
];

export function OverridesSettings() {
  const { setOpenConnectModal } = useOpenConnectModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const {
    collectionAddress,
    sdkConfig,
    walletType,
    setOrderbookKind,
    orderbookKind,
    paginationMode,
    setPaginationMode,
    resetSettings,
    setApiOverride,
    setMarketplaceConfigOverride,
    setCollectionOverride,
    setWalletOverride,
    clearAllOverrides,
  } = useMarketplace();

  const [pendingProjectId, setPendingProjectId] = useState(sdkConfig.projectId);

  function toggleConnect() {
    if (address) {
      disconnect();
    } else {
      setOpenConnectModal(true);
    }
  }

  const handleReset = () => {
    resetSettings();
    clearAllOverrides();
    // Reset local state as well
    setPendingProjectId(sdkConfig.projectId);
  };

  const orderbookOptions = [
    { label: "Collection default", value: "default" },
    ...Object.keys(OrderbookKindEnum).map((key) => ({
      label: key,
      value: key,
    })),
  ];

  // Count active overrides
  const activeOverridesCount = useMemo(() => {
    let count = 0;
    const overrides = sdkConfig._internal?.overrides;
    if (overrides?.marketplaceConfig) count++;
    if (overrides?.collection) count++;
    if (overrides?.wallet) count++;
    if (overrides?.api) {
      count += Object.keys(overrides.api).length;
    }
    return count;
  }, [sdkConfig]);

  return (
    <Collapsible
      className="!bg-background-raised mb-2"
      defaultOpen={true}
      label={
        <div className="flex items-center gap-2">
          <Text>Configuration & Overrides</Text>
          {activeOverridesCount > 0 && (
            <Badge value={activeOverridesCount} variant="success" />
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {/* Basic Settings */}
        <div className="flex flex-col gap-3">
          <Text variant="medium" color="text80">
            Basic Settings
          </Text>
          <div className="flex w-full gap-3">
            <TextInput
              labelLocation="top"
              label="Project ID"
              value={pendingProjectId}
              onChange={(ev) => setPendingProjectId(ev.target.value)}
              name="projectId"
            />
            <Button
              label="Apply Configuration"
              shape="square"
              onClick={() => setProjectId(pendingProjectId)}
            />
          </div>
          <TextInput
            placeholder="No wallet connected"
            value={address || ""}
            disabled={true}
            name="wallet"
            controls={
              <div>
                <Button
                  label={address ? "Disconnect" : "Connect"}
                  size="xs"
                  shape="square"
                  onClick={toggleConnect}
                />
              </div>
            }
          />

          <div className="flex items-center gap-3">
            <Select
              label="Orderbook"
              labelLocation="top"
              name="orderbook"
              defaultValue="default"
              value={orderbookKind ? orderbookKind : "default"}
              options={orderbookOptions}
              onValueChange={(value) =>
                setOrderbookKind(
                  value === "default" ? undefined : (value as OrderbookKind)
                )
              }
            />
            <div className="flex flex-col">
              <Text variant="small" color="text80">
                Pagination Mode
              </Text>
              <div className="flex items-center gap-2">
                <Switch
                  checked={paginationMode === "paginated"}
                  onCheckedChange={(checked) =>
                    setPaginationMode(checked ? "paginated" : "infinite")
                  }
                />
                <Text variant="small" color="text80">
                  {paginationMode === "paginated"
                    ? "Paginated"
                    : "Infinite Scroll"}
                </Text>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <Collapsible
          label={
            <div className="flex items-center gap-2">
              <Text variant="medium" color="text80">
                API Overrides
              </Text>
              {Object.keys(sdkConfig._internal?.overrides?.api || {}).length >
                0 && (
                <Badge
                  value={
                    Object.keys(sdkConfig._internal?.overrides?.api || {})
                      .length
                  }
                  variant="info"
                />
              )}
            </div>
          }
          defaultOpen={false}
        >
          <div className="flex flex-col gap-3">
            <Text variant="small" color="text50">
              Override API endpoints and access keys for different services
            </Text>

            <div className="mb-4 rounded bg-background-secondary p-3">
              <Text variant="small" color="text80" className="mb-3">
                Bulk Override Settings
              </Text>
              <BulkApiOverride
                currentConfigs={sdkConfig._internal?.overrides?.api || {}}
                onUpdate={setApiOverride}
              />
            </div>

            {API_SERVICES.map(({ key, label }) => (
              <ApiServiceOverride
                key={key}
                service={key}
                label={label}
                currentConfig={sdkConfig._internal?.overrides?.api?.[key]}
                onUpdate={(config) => setApiOverride(key, config)}
              />
            ))}
          </div>
        </Collapsible>

        <Divider />

        {/* Marketplace Config Overrides */}
        <Collapsible
          label={
            <div className="flex items-center gap-2">
              <Text variant="medium" color="text80">
                Marketplace Settings Overrides
              </Text>
              {sdkConfig._internal?.overrides?.marketplaceConfig && (
                <Badge value="Active" variant="info" />
              )}
            </div>
          }
          defaultOpen={false}
        >
          <MarketplaceConfigOverrides
            currentConfig={sdkConfig._internal?.overrides?.marketplaceConfig}
            onUpdate={setMarketplaceConfigOverride}
          />
        </Collapsible>

        <Divider />

        {/* Collection Overrides */}
        <Collapsible
          label={
            <div className="flex items-center gap-2">
              <Text variant="medium" color="text80">
                Collection Overrides
              </Text>
              {sdkConfig._internal?.overrides? && (
                <Badge value="Active" variant="info" />
              )}
            </div>
          }
          defaultOpen={false}
        >
          <CollectionOverrideSettings
            currentConfig={sdkConfig._internal?.overrides?.collection}
            currentChainId={chainId}
            currentCollectionAddress={collectionAddress}
            onUpdate={setCollectionOverride}
          />
        </Collapsible>

        <Divider />

        {/* Wallet Overrides */}
        <Collapsible
          label={
            <div className="flex items-center gap-2">
              <Text variant="medium" color="text80">
                Wallet Overrides
              </Text>
              {sdkConfig._internal?.overrides?.wallet && (
                <Badge value="Active" variant="info" />
              )}
            </div>
          }
          defaultOpen={false}
        >
          <WalletOverrideSettings
            currentConfig={sdkConfig._internal?.overrides?.wallet}
            onUpdate={setWalletOverride}
          />
        </Collapsible>

        <div className="flex gap-3 pt-3">
          <Button
            label="Reset All Settings"
            variant="ghost"
            shape="square"
            onClick={handleReset}
          />
          <Button
            label="Clear Overrides Only"
            variant="ghost"
            shape="square"
            onClick={clearAllOverrides}
          />
        </div>
      </div>
    </Collapsible>
  );
}

interface ApiServiceOverrideProps {
  service: keyof ApiOverrides;
  label: string;
  currentConfig: ApiConfig | undefined;
  onUpdate: (config: ApiConfig | undefined) => void;
}

function ApiServiceOverride({
  service,
  label,
  currentConfig,
  onUpdate,
}: ApiServiceOverrideProps) {
  const [isOverridden, setIsOverridden] = useState(!!currentConfig);
  const [env, setEnv] = useState<Env>(currentConfig?.env || "production");
  const [accessKey, setAccessKey] = useState(currentConfig?.accessKey || "");

  const handleToggle = (checked: boolean) => {
    setIsOverridden(checked);
    if (checked) {
      onUpdate({ env, accessKey: accessKey || undefined } satisfies ApiConfig);
    } else {
      onUpdate(undefined);
    }
  };

  const handleEnvChange = (newEnv: string) => {
    setEnv(newEnv as Env);
    if (isOverridden) {
      onUpdate({
        env: newEnv as Env,
        accessKey: accessKey || undefined,
      } satisfies ApiConfig);
    }
  };

  const handleAccessKeyChange = (newKey: string) => {
    setAccessKey(newKey);
    if (isOverridden) {
      onUpdate({ env, accessKey: newKey || undefined } satisfies ApiConfig);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded bg-background-secondary p-3">
      <div className="flex items-center justify-between">
        <Text variant="small" color="text80">
          {label}
        </Text>
        <Switch checked={isOverridden} onCheckedChange={handleToggle} />
      </div>
      {isOverridden && (
        <div className="mt-2 flex gap-2">
          <Select
            name={`${service}-env`}
            value={env}
            options={ENV_OPTIONS}
            onValueChange={handleEnvChange}
            placeholder="Environment"
          />
          <TextInput
            name={`${service}-key`}
            value={accessKey}
            onChange={(e) => handleAccessKeyChange(e.target.value)}
            placeholder="Access Key (optional)"
          />
        </div>
      )}
    </div>
  );
}

interface MarketplaceConfigOverridesProps {
  currentConfig: Partial<MarketplaceConfig> | undefined;
  onUpdate: (config: Partial<MarketplaceConfig> | undefined) => void;
}

function MarketplaceConfigOverrides({
  currentConfig,
  onUpdate,
}: MarketplaceConfigOverridesProps) {
  const [isOverridden, setIsOverridden] = useState(!!currentConfig);
  const [title, setTitle] = useState(currentConfig?.settings?.title || "");
  const [logoUrl, setLogoUrl] = useState(
    currentConfig?.settings?.logoUrl || ""
  );
  const [bannerUrl, setBannerUrl] = useState(
    currentConfig?.settings?.style?.bannerUrl || ""
  );
  const [publisherId, setPublisherId] = useState(
    currentConfig?.settings?.publisherId || ""
  );

  const handleToggle = (checked: boolean) => {
    setIsOverridden(checked);
    if (!checked) {
      onUpdate(undefined);
    } else {
      updateConfig();
    }
  };

  const updateConfig = () => {
    if (!isOverridden) return;

    const hasSettings = title || logoUrl || publisherId || bannerUrl;
    if (!hasSettings) {
      onUpdate(undefined);
      return;
    }

    const config: Partial<MarketplaceConfig> = {};

    if (title || logoUrl || publisherId || bannerUrl) {
      const settings: Partial<MarketplaceConfig["settings"]> = {};
      if (title) settings.title = title;
      if (logoUrl) settings.logoUrl = logoUrl;
      if (publisherId) settings.publisherId = publisherId;
      if (bannerUrl) {
        settings.style = { bannerUrl };
      }
      config.settings = settings as MarketplaceConfig["settings"];
    }

    onUpdate(config);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Text variant="small" color="text50">
          Override marketplace branding and appearance
        </Text>
        <Switch checked={isOverridden} onCheckedChange={handleToggle} />
      </div>
      {isOverridden && (
        <>
          <TextInput
            name="override-title"
            label="Title"
            labelLocation="top"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              updateConfig();
            }}
            placeholder="Marketplace title"
          />
          <TextInput
            name="override-publisherId"
            label="Publisher ID"
            labelLocation="top"
            value={publisherId}
            onChange={(e) => {
              setPublisherId(e.target.value);
              updateConfig();
            }}
            placeholder="Publisher ID"
          />
          <TextInput
            name="override-logoUrl"
            label="Logo URL"
            labelLocation="top"
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value);
              updateConfig();
            }}
            placeholder="https://..."
          />
          <TextInput
            name="override-bannerUrl"
            label="Banner URL"
            labelLocation="top"
            value={bannerUrl}
            onChange={(e) => {
              setBannerUrl(e.target.value);
              updateConfig();
            }}
            placeholder="https://..."
          />
        </>
      )}
    </div>
  );
}

interface BulkApiOverrideProps {
  currentConfigs: ApiOverrides;
  onUpdate: (
    service: keyof ApiOverrides,
    config: ApiConfig | undefined
  ) => void;
}

function BulkApiOverride({ currentConfigs, onUpdate }: BulkApiOverrideProps) {
  const [env, setEnv] = useState<Env>("production");
  const [accessKey, setAccessKey] = useState("");

  const applyToAll = () => {
    const config = {
      env,
      accessKey: accessKey || undefined,
    } satisfies ApiConfig;
    for (const { key } of API_SERVICES) {
      onUpdate(key, config);
    }
  };

  const clearAll = () => {
    for (const { key } of API_SERVICES) {
      onUpdate(key, undefined);
    }
  };

  const activeOverridesCount = Object.keys(currentConfigs).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Text variant="small" color="text50">
          Apply environment and access key to all services
        </Text>
        {activeOverridesCount > 0 && (
          <Badge value={activeOverridesCount} variant="info" />
        )}
      </div>

      <div className="flex gap-2">
        <Select
          name="bulk-env"
          value={env}
          options={ENV_OPTIONS}
          onValueChange={(value) => setEnv(value as Env)}
          placeholder="Environment"
        />
        <TextInput
          name="bulk-key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          placeholder="Access Key (optional)"
        />
      </div>

      <div className="flex gap-2">
        <Button
          label="Apply to All"
          size="xs"
          shape="square"
          onClick={applyToAll}
        />
        <Button
          label="Clear All"
          size="xs"
          shape="square"
          variant="ghost"
          onClick={clearAll}
        />
      </div>
    </div>
  );
}

interface CollectionOverrideSettingsProps {
  currentConfig: CollectionOverride | undefined;
  currentChainId?: number;
  currentCollectionAddress?: string;
  onUpdate: (config: CollectionOverride | undefined) => void;
}

function CollectionOverrideSettings({
  currentConfig,
  currentChainId,
  currentCollectionAddress,
  onUpdate,
}: CollectionOverrideSettingsProps) {
  const [isOverridden, setIsOverridden] = useState(!!currentConfig);

  // Basic identifiers - auto-populate from current context
  const [chainId, setChainId] = useState(
    currentConfig?.chainId || currentChainId || 1
  );
  const [contractAddress, setContractAddress] = useState(
    currentConfig?.contractAddress || currentCollectionAddress || ""
  );

  // Display metadata overrides
  const [name, setName] = useState(currentConfig?.name || "");
  const [symbol, setSymbol] = useState(currentConfig?.symbol || "");
  const [description, setDescription] = useState(
    currentConfig?.description || ""
  );
  const [bannerUrl, setBannerUrl] = useState(currentConfig?.bannerUrl || "");
  const [ogImage, setOgImage] = useState(currentConfig?.ogImage || "");

  // Marketplace settings - collapsed by default
  const [contractType, setContractType] = useState<ContractType | undefined>(
    currentConfig?.contractType
  );
  const [feePercentage, setFeePercentage] = useState(
    currentConfig?.feePercentage || 2.5
  );
  const [currencyOptions, setCurrencyOptions] = useState(
    currentConfig?.currencyOptions?.join(", ") || "ETH, USDC"
  );

  // Shop settings - collapsed by default
  const [saleAddress, setSaleAddress] = useState(
    currentConfig?.saleAddress || ""
  );

  const handleToggle = (checked: boolean) => {
    setIsOverridden(checked);
    if (!checked) {
      onUpdate(undefined);
    } else {
      updateConfig();
    }
  };

  const updateConfig = () => {
    if (!isOverridden || !contractAddress) return;

    const config: CollectionOverride = {
      chainId,
      contractAddress,
    };

    // Only include non-empty optional fields
    if (name) config.name = name;
    if (symbol) config.symbol = symbol;
    if (description) config.description = description;
    if (bannerUrl) config.bannerUrl = bannerUrl;
    if (ogImage) config.ogImage = ogImage;
    if (contractType) config.contractType = contractType;
    if (feePercentage !== 2.5) config.feePercentage = feePercentage;
    if (currencyOptions.trim()) {
      config.currencyOptions = currencyOptions
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);
    }
    if (saleAddress) config.saleAddress = saleAddress;

    onUpdate(config);
  };

  // Validation
  const isValidAddress =
    contractAddress === "" || isAddress(contractAddress as Address);
  const isValidSaleAddress =
    saleAddress === "" || isAddress(saleAddress as Address);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Text variant="small" color="text50">
          Override collection metadata and marketplace settings
        </Text>
        <Switch checked={isOverridden} onCheckedChange={handleToggle} />
      </div>

      {isOverridden && (
        <>
          {/* Required Identifiers */}
          <div className="flex flex-col gap-3 rounded bg-background-secondary p-3">
            <Text variant="small" color="text80" className="mb-2">
              Collection Identifiers
            </Text>
            <div className="flex gap-2">
              <TextInput
                name="override-chainId"
                label="Chain ID"
                labelLocation="top"
                value={chainId}
                onChange={(e) => {
                  setChainId(Number(e.target.value));
                  updateConfig();
                }}
                error={Number.isNaN(chainId) ? "Invalid chain ID" : undefined}
              />
              <TextInput
                name="override-contractAddress"
                label="Contract Address"
                labelLocation="top"
                value={contractAddress}
                onChange={(e) => {
                  setContractAddress(e.target.value);
                  updateConfig();
                }}
                error={!isValidAddress ? "Invalid contract address" : undefined}
                className="flex-1"
              />
            </div>
          </div>

          {/* Display Metadata */}
          <div className="flex flex-col gap-3">
            <Text variant="small" color="text80">
              Display Overrides
            </Text>
            <div className="flex gap-2">
              <TextInput
                name="override-name"
                label="Name"
                labelLocation="top"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  updateConfig();
                }}
                placeholder="Collection name"
              />
              <TextInput
                name="override-symbol"
                label="Symbol"
                labelLocation="top"
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  updateConfig();
                }}
                placeholder="Symbol"
              />
            </div>
            <TextInput
              name="override-description"
              label="Description"
              labelLocation="top"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                updateConfig();
              }}
              placeholder="Collection description"
            />
            <div className="flex gap-2">
              <TextInput
                name="override-bannerUrl"
                label="Banner URL"
                labelLocation="top"
                value={bannerUrl}
                onChange={(e) => {
                  setBannerUrl(e.target.value);
                  updateConfig();
                }}
                placeholder="https://..."
                className="flex-1"
              />
              <TextInput
                name="override-ogImage"
                label="OG Image URL"
                labelLocation="top"
                value={ogImage}
                onChange={(e) => {
                  setOgImage(e.target.value);
                  updateConfig();
                }}
                placeholder="https://..."
                className="flex-1"
              />
            </div>
          </div>

          {/* Advanced Marketplace Settings */}
          <Collapsible
            label={
              <Text variant="small" color="text80">
                Advanced Marketplace Settings
              </Text>
            }
            defaultOpen={false}
          >
            <div className="mt-2 flex flex-col gap-3">
              <div className="flex gap-2">
                <Select
                  name="override-contractType"
                  label="Contract Type"
                  labelLocation="top"
                  value={contractType || ""}
                  options={[
                    { label: "Not set", value: "" },
                    ...CONTRACT_TYPE_OPTIONS,
                  ]}
                  onValueChange={(value) => {
                    setContractType((value as ContractType) || undefined);
                    updateConfig();
                  }}
                />
                <TextInput
                  name="override-feePercentage"
                  label="Fee Percentage"
                  labelLocation="top"
                  value={feePercentage}
                  onChange={(e) => {
                    setFeePercentage(Number(e.target.value));
                    updateConfig();
                  }}
                  placeholder="2.5"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              <TextInput
                name="override-currencies"
                label="Currency Options (comma-separated)"
                labelLocation="top"
                value={currencyOptions}
                onChange={(e) => {
                  setCurrencyOptions(e.target.value);
                  updateConfig();
                }}
                placeholder="ETH, USDC, WETH"
              />
            </div>
          </Collapsible>

          {/* Shop Settings */}
          <Collapsible
            label={
              <Text variant="small" color="text80">
                Shop Settings
              </Text>
            }
            defaultOpen={false}
          >
            <div className="mt-2">
              <TextInput
                name="override-saleAddress"
                label="Sale Contract Address"
                labelLocation="top"
                value={saleAddress}
                onChange={(e) => {
                  setSaleAddress(e.target.value);
                  updateConfig();
                }}
                placeholder="0x..."
                error={
                  !isValidSaleAddress
                    ? "Invalid sale contract address"
                    : undefined
                }
              />
            </div>
          </Collapsible>
        </>
      )}
    </div>
  );
}

interface WalletOverrideSettingsProps {
  currentConfig: WalletOverride | undefined;
  onUpdate: (config: WalletOverride | undefined) => void;
}

function WalletOverrideSettings({
  currentConfig,
  onUpdate,
}: WalletOverrideSettingsProps) {
  const [isOverridden, setIsOverridden] = useState(!!currentConfig);

  // Wallet type selection
  const [walletType, setWalletType] = useState<
    "UNIVERSAL" | "EMBEDDED" | "ECOSYSTEM" | undefined
  >(currentConfig?.walletType);

  // Universal wallet settings
  const [sequenceEnv, setSequenceEnv] = useState<Env>(
    currentConfig?.sequenceWallet?.env || "production"
  );
  const [sequenceAccessKey, setSequenceAccessKey] = useState(
    currentConfig?.sequenceWallet?.accessKey || ""
  );
  const [sequenceBannerUrl, setSequenceBannerUrl] = useState(
    currentConfig?.sequenceWallet?.bannerUrl || ""
  );

  // Embedded wallet settings
  const [waasConfigKey, setWaasConfigKey] = useState(
    currentConfig?.embedded?.waasConfigKey || ""
  );
  const [emailEnabled, setEmailEnabled] = useState(
    currentConfig?.embedded?.emailEnabled ?? true
  );
  const [googleClientId, setGoogleClientId] = useState(
    currentConfig?.embedded?.oidcIssuers?.google || ""
  );
  const [appleClientId, setAppleClientId] = useState(
    currentConfig?.embedded?.oidcIssuers?.apple || ""
  );

  // Ecosystem wallet settings
  const [ecosystemWalletUrl, setEcosystemWalletUrl] = useState(
    currentConfig?.ecosystem?.walletUrl || ""
  );
  const [ecosystemAppName, setEcosystemAppName] = useState(
    currentConfig?.ecosystem?.walletAppName || ""
  );
  const [ecosystemLogoLight, setEcosystemLogoLight] = useState(
    currentConfig?.ecosystem?.logoLightUrl || ""
  );
  const [ecosystemLogoDark, setEcosystemLogoDark] = useState(
    currentConfig?.ecosystem?.logoDarkUrl || ""
  );

  // Common connector settings
  const [enableCoinbase, setEnableCoinbase] = useState(
    currentConfig?.connectors?.includes("coinbase") ?? false
  );
  const [enableWalletConnect, setEnableWalletConnect] = useState(
    currentConfig?.connectors?.includes("walletconnect") ?? false
  );
  const [walletConnectProjectId, setWalletConnectProjectId] = useState(
    currentConfig?.walletConnectProjectId || ""
  );
  const [includeEIP6963Wallets, setIncludeEIP6963Wallets] = useState(
    currentConfig?.includeEIP6963Wallets ?? true
  );

  const handleToggle = (checked: boolean) => {
    setIsOverridden(checked);
    if (!checked) {
      onUpdate(undefined);
    } else {
      updateConfig();
    }
  };

  const updateConfig = () => {
    if (!isOverridden) return;

    const config: WalletOverride = {};

    // Only include non-default values
    if (walletType) config.walletType = walletType;

    // Universal wallet settings
    if (
      walletType === "UNIVERSAL" &&
      (sequenceEnv !== "production" || sequenceAccessKey || sequenceBannerUrl)
    ) {
      config.sequenceWallet = {};
      if (sequenceEnv !== "production") config.sequenceWallet.env = sequenceEnv;
      if (sequenceAccessKey)
        config.sequenceWallet.accessKey = sequenceAccessKey;
      if (sequenceBannerUrl)
        config.sequenceWallet.bannerUrl = sequenceBannerUrl;
    }

    // Embedded wallet settings
    if (
      walletType === "EMBEDDED" &&
      (waasConfigKey || !emailEnabled || googleClientId || appleClientId)
    ) {
      config.embedded = {};
      if (waasConfigKey) config.embedded.waasConfigKey = waasConfigKey;
      if (!emailEnabled) config.embedded.emailEnabled = emailEnabled;
      if (googleClientId || appleClientId) {
        config.embedded.oidcIssuers = {};
        if (googleClientId) config.embedded.oidcIssuers.google = googleClientId;
        if (appleClientId) config.embedded.oidcIssuers.apple = appleClientId;
      }
    }

    // Ecosystem wallet settings
    if (
      walletType === "ECOSYSTEM" &&
      (ecosystemWalletUrl ||
        ecosystemAppName ||
        ecosystemLogoLight ||
        ecosystemLogoDark)
    ) {
      config.ecosystem = {};
      if (ecosystemWalletUrl) config.ecosystem.walletUrl = ecosystemWalletUrl;
      if (ecosystemAppName) config.ecosystem.walletAppName = ecosystemAppName;
      if (ecosystemLogoLight)
        config.ecosystem.logoLightUrl = ecosystemLogoLight;
      if (ecosystemLogoDark) config.ecosystem.logoDarkUrl = ecosystemLogoDark;
    }

    // Common connector settings
    const connectors: Array<"coinbase" | "walletconnect"> = [];
    if (enableCoinbase) connectors.push("coinbase");
    if (enableWalletConnect) connectors.push("walletconnect");
    if (connectors.length > 0) config.connectors = connectors;

    if (walletConnectProjectId)
      config.walletConnectProjectId = walletConnectProjectId;
    if (!includeEIP6963Wallets)
      config.includeEIP6963Wallets = includeEIP6963Wallets;

    onUpdate(Object.keys(config).length > 0 ? config : undefined);
  };

  const walletTypeOptions = [
    { label: "Not set", value: "" },
    { label: "Universal", value: "UNIVERSAL" },
    { label: "Embedded", value: "EMBEDDED" },
    { label: "Ecosystem", value: "ECOSYSTEM" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Text variant="small" color="text50">
          Override wallet configuration and connection options
        </Text>
        <Switch checked={isOverridden} onCheckedChange={handleToggle} />
      </div>

      {isOverridden && (
        <>
          {/* Wallet Type Selection */}
          <div className="flex flex-col gap-3 rounded bg-background-secondary p-3">
            <Text variant="small" color="text80" className="mb-2">
              Wallet Type
            </Text>
            <Select
              name="wallet-type"
              label="Wallet Type"
              labelLocation="top"
              value={walletType || ""}
              options={walletTypeOptions}
              onValueChange={(value) => {
                setWalletType(
                  (value as "UNIVERSAL" | "EMBEDDED" | "ECOSYSTEM") || undefined
                );
                updateConfig();
              }}
            />
          </div>

          {/* Universal Wallet Settings */}
          {walletType === "UNIVERSAL" && (
            <Collapsible
              label={
                <Text variant="small" color="text80">
                  Universal Wallet Settings
                </Text>
              }
              defaultOpen={false}
            >
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex gap-2">
                  <Select
                    name="sequence-env"
                    label="Sequence Environment"
                    labelLocation="top"
                    value={sequenceEnv}
                    options={ENV_OPTIONS}
                    onValueChange={(value) => {
                      setSequenceEnv(value as Env);
                      updateConfig();
                    }}
                  />
                  <TextInput
                    name="sequence-access-key"
                    label="Access Key Override"
                    labelLocation="top"
                    value={sequenceAccessKey}
                    onChange={(e) => {
                      setSequenceAccessKey(e.target.value);
                      updateConfig();
                    }}
                    placeholder="Optional access key override"
                  />
                </div>
                <TextInput
                  name="sequence-banner-url"
                  label="Banner URL"
                  labelLocation="top"
                  value={sequenceBannerUrl}
                  onChange={(e) => {
                    setSequenceBannerUrl(e.target.value);
                    updateConfig();
                  }}
                  placeholder="https://..."
                />
              </div>
            </Collapsible>
          )}

          {/* Embedded Wallet Settings */}
          {walletType === "EMBEDDED" && (
            <Collapsible
              label={
                <Text variant="small" color="text80">
                  Embedded Wallet Settings
                </Text>
              }
              defaultOpen={false}
            >
              <div className="mt-2 flex flex-col gap-3">
                <TextInput
                  name="waas-config-key"
                  label="WaaS Config Key"
                  labelLocation="top"
                  value={waasConfigKey}
                  onChange={(e) => {
                    setWaasConfigKey(e.target.value);
                    updateConfig();
                  }}
                  placeholder="WaaS configuration key"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={(checked) => {
                      setEmailEnabled(checked);
                      updateConfig();
                    }}
                  />
                  <Text variant="small" color="text80">
                    Enable Email Login
                  </Text>
                </div>
                <div className="flex gap-2">
                  <TextInput
                    name="google-client-id"
                    label="Google Client ID"
                    labelLocation="top"
                    value={googleClientId}
                    onChange={(e) => {
                      setGoogleClientId(e.target.value);
                      updateConfig();
                    }}
                    placeholder="Google OAuth Client ID"
                  />
                  <TextInput
                    name="apple-client-id"
                    label="Apple Client ID"
                    labelLocation="top"
                    value={appleClientId}
                    onChange={(e) => {
                      setAppleClientId(e.target.value);
                      updateConfig();
                    }}
                    placeholder="Apple OAuth Client ID"
                  />
                </div>
              </div>
            </Collapsible>
          )}

          {/* Ecosystem Wallet Settings */}
          {walletType === "ECOSYSTEM" && (
            <Collapsible
              label={
                <Text variant="small" color="text80">
                  Ecosystem Wallet Settings
                </Text>
              }
              defaultOpen={false}
            >
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex gap-2">
                  <TextInput
                    name="ecosystem-wallet-url"
                    label="Wallet URL"
                    labelLocation="top"
                    value={ecosystemWalletUrl}
                    onChange={(e) => {
                      setEcosystemWalletUrl(e.target.value);
                      updateConfig();
                    }}
                    placeholder="https://wallet.example.com"
                  />
                  <TextInput
                    name="ecosystem-app-name"
                    label="App Name"
                    labelLocation="top"
                    value={ecosystemAppName}
                    onChange={(e) => {
                      setEcosystemAppName(e.target.value);
                      updateConfig();
                    }}
                    placeholder="My Wallet App"
                  />
                </div>
                <div className="flex gap-2">
                  <TextInput
                    name="ecosystem-logo-light"
                    label="Light Logo URL"
                    labelLocation="top"
                    value={ecosystemLogoLight}
                    onChange={(e) => {
                      setEcosystemLogoLight(e.target.value);
                      updateConfig();
                    }}
                    placeholder="https://..."
                  />
                  <TextInput
                    name="ecosystem-logo-dark"
                    label="Dark Logo URL"
                    labelLocation="top"
                    value={ecosystemLogoDark}
                    onChange={(e) => {
                      setEcosystemLogoDark(e.target.value);
                      updateConfig();
                    }}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </Collapsible>
          )}

          {/* Common Connector Settings */}
          <Collapsible
            label={
              <Text variant="small" color="text80">
                Connector Settings
              </Text>
            }
            defaultOpen={false}
          >
            <div className="mt-2 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={enableCoinbase}
                    onCheckedChange={(checked) => {
                      setEnableCoinbase(checked);
                      updateConfig();
                    }}
                  />
                  <Text variant="small" color="text80">
                    Enable Coinbase Wallet
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={enableWalletConnect}
                    onCheckedChange={(checked) => {
                      setEnableWalletConnect(checked);
                      updateConfig();
                    }}
                  />
                  <Text variant="small" color="text80">
                    Enable WalletConnect
                  </Text>
                </div>
              </div>
              {enableWalletConnect && (
                <TextInput
                  name="walletconnect-project-id"
                  label="WalletConnect Project ID"
                  labelLocation="top"
                  value={walletConnectProjectId}
                  onChange={(e) => {
                    setWalletConnectProjectId(e.target.value);
                    updateConfig();
                  }}
                  placeholder="WalletConnect project ID"
                />
              )}
              <div className="flex items-center gap-2">
                <Switch
                  checked={includeEIP6963Wallets}
                  onCheckedChange={(checked) => {
                    setIncludeEIP6963Wallets(checked);
                    updateConfig();
                  }}
                />
                <Text variant="small" color="text80">
                  Include EIP-6963 Wallets
                </Text>
              </div>
            </div>
          </Collapsible>
        </>
      )}
    </div>
  );
}
