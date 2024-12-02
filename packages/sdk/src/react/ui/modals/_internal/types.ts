import type { Hash } from 'viem';

export interface ModalCallbacks {
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}
