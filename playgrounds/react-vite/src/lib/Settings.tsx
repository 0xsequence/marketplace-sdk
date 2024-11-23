import {
  Card,
  Box,
  TextInput,
  Button,
  Collapsible,
} from "@0xsequence/design-system";
import type { Hex } from "viem";
import { useMarketplace } from "./MarketplaceContext";
import { useAccount, useDisconnect } from "wagmi";
import { useOpenConnectModal } from "@0xsequence/kit";

export function Settings() {
  const { setOpenConnectModal } = useOpenConnectModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  function toggleConnect() {
    if (address) {
      disconnect();
    } else {
      setOpenConnectModal(true);
    }
  }
  const {
    pendingCollectionAddress,
    setCollectionAddress,
    isCollectionAddressValid,
    pendingChainId,
    setChainId,
    isChainIdValid,
    pendingCollectibleId,
    setCollectibleId,
    isCollectibleIdValid,
  } = useMarketplace();

  return (
    <Collapsible label="Settings">
      <Box gap="3" flexDirection='column'>
        <Box gap="3">
          <TextInput
            label="Collection address"
            style={{ width: "250px" }}
            labelLocation="top"
            name="collectionAddress"
            value={pendingCollectionAddress}
            onChange={(ev) => setCollectionAddress(ev.target.value as Hex)}
            error={
              !isCollectionAddressValid
                ? "Invalid collection address"
                : undefined
            }
          />
          <TextInput
            label="Chain ID"
            labelLocation="top"
            name="chainId"
            value={pendingChainId}
            onChange={(ev) => setChainId(ev.target.value)}
            error={!isChainIdValid ? "Chainid undefined" : undefined}
          />
          <TextInput
            label="Collectible ID"
            labelLocation="top"
            name="collectibleId"
            value={pendingCollectibleId}
            onChange={(ev) => setCollectibleId(ev.target.value)}
            error={!isCollectibleIdValid ? "Missing collectable id" : undefined}
          />
        </Box>
        <TextInput
          label="Wallet"
          labelLocation="top"
          placeholder="No wallet connected"
          value={address || ""}
          disabled={true}
          name="wallet"
          controls={
            <Box>
              <Button
                label={address ? "Disconnect" : "Connect"}
                size="xs"
                shape="square"
                onClick={toggleConnect}
              />
            </Box>
          }
        />
      </Box>
    </Collapsible>
  );
}
