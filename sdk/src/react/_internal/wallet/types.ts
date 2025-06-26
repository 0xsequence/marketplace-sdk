export interface WalletConnectionHandler {
  openConnectModal: () => void;
  isConnected: boolean;
  address?: string;
  getAddress?: () => Promise<string>;
}