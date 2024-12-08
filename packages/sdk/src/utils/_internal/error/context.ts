import { BaseError } from './base.js'

export type MarketplaceSdkProviderNotFoundErrorType = MarketplaceSdkProviderNotFoundError & {
  name: 'MarketplaceSDKProviderNotFoundError'
}

export class MarketplaceSdkProviderNotFoundError extends BaseError {
  override name = 'MarketplaceSDKProviderNotFoundError'
  constructor() {
    super('`useConfig` must be used within `MarketplaceSdkProvider`.')
  }
}