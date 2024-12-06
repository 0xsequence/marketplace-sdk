import { BaseError } from './base.js'

export type TransactionErrorType<name extends string = 'TransactionError'> = BaseError & { name: name }

export class TransactionError extends BaseError {
  override name = 'TransactionError'
}

export class ChainSwitchError extends TransactionError {
  override name = 'ChainSwitchError'
  constructor(currentChainId: number, targetChainId: number) {
    super(`Failed to switch network from ${currentChainId} to ${targetChainId}`, {
      details: 'The user may have rejected the network switch or there might be a network connectivity issue.'
    })
  }
}

export class TransactionExecutionError extends TransactionError {
  override name = 'TransactionExecutionError'
  constructor(stepId: string, cause?: Error) {
    super(`Failed to execute transaction step: ${stepId}`, { 
      details: cause?.message || 'The transaction may have been rejected or failed during execution.',
      cause 
    })
  }
}

export class TransactionSignatureError extends TransactionError {
  override name = 'TransactionSignatureError'
  constructor(stepId: string, cause?: Error) {
    super(`Failed to sign transaction step: ${stepId}`, { 
      details: cause?.message || 'The signature request may have been rejected by the user.',
      cause 
    })
  }
}

export class NoWalletConnectedError extends TransactionError {
  override name = 'NoWalletConnectedError'
  constructor() {
    super('No wallet connected', {
      details: 'Please connect your wallet before attempting this transaction.'
    })
  }
}

export class NoMarketplaceConfigError extends TransactionError {
  override name = 'NoMarketplaceConfigError'
  constructor() {
    super('Marketplace configuration not found', {
      details: 'The marketplace configuration is missing or invalid. This could be due to an initialization error.'
    })
  }
}

export class UserRejectedRequestError extends TransactionError {
  override name = 'UserRejectedRequestError'
  constructor() {
    super('User rejected the request', {
      details: 'The user cancelled or rejected the transaction request.'
    })
  }
}

export class InsufficientFundsError extends TransactionError {
  override name = 'InsufficientFundsError'
  constructor(cause?: Error) {
    super('Insufficient funds for transaction', {
      details: 'The wallet does not have enough funds to complete this transaction.',
      cause
    })
  }
}

export class StepExecutionError extends TransactionError {
  override name = 'StepExecutionError'
  constructor(stepId: string, stepType: string, cause?: Error) {
    super(`Failed to execute step ${stepId} (${stepType})`, {
      details: cause?.message || 'The step execution failed unexpectedly.',
      cause
    })
  }
}

export class StepGenerationError extends TransactionError {
  override name = 'StepGenerationError'
  constructor(transactionType: string, cause?: Error) {
    super(`Failed to generate steps for ${transactionType}`, {
      details: cause?.message || 'Could not generate the required transaction steps.',
      cause
    })
  }
}

export class PaymentModalError extends TransactionError {
  override name = 'PaymentModalError'
  constructor(cause?: Error) {
    super('Payment modal operation failed', {
      details: cause?.message || 'The payment modal operation was unsuccessful.',
      cause
    })
  }
}

export class InvalidStepError extends TransactionError {
  override name = 'InvalidStepError'
  constructor(stepId: string, reason: string) {
    super(`Invalid step configuration for ${stepId}`, {
      details: reason
    })
  }
}

export class TransactionConfirmationError extends TransactionError {
  override name = 'TransactionConfirmationError'
  constructor(hash: string, cause?: Error) {
    super(`Failed to confirm transaction ${hash}`, {
      details: cause?.message || 'The transaction could not be confirmed on the network.',
      cause
    })
  }
}
