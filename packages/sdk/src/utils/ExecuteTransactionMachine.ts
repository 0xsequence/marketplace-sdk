import type { WalletClient, Hash } from "viem";
import { StepType, type Step, type Signature, type CreateReq, type ContractType, type MarketplaceKind, type OrderbookKind, ExecuteType } from "../types";
import type { SequenceMarketplace } from "../react/_internal";

export enum TransactionState {
  IDLE = "IDLE",
  VALIDATING_CHAIN = "VALIDATING_CHAIN",
  WRONG_CHAIN = "WRONG_CHAIN",
  CHECKING_STEPS = "CHECKING_STEPS",
  TOKEN_APPROVAL = "TOKEN_APPROVAL",
  EXECUTING_TRANSACTION = "EXECUTING_TRANSACTION",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  LISTING = 'LISTING',
  OFFER = 'OFFER',
  CANCEL = 'CANCEL'
}

interface TransactionConfig {
  chainId: string;
  collectionAddress: string;
  orderId?: string;
  marketplace: MarketplaceKind;
  quantity?: string;
  owner?: string; 
  contractType?: ContractType;
  orderbook?: OrderbookKind;
  listing?: CreateReq;
  maker?: string;
  offer?: CreateReq;
}

interface StateConfig {
  type: TransactionType;
  config: TransactionConfig;
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}

interface TransactionSteps {
  needsApproval: boolean;
  approvalStep?: Step;
  executionSteps: Step[];
}

export class TransactionStateMachine {
  private currentState: TransactionState;
  private config: StateConfig;
  private walletClient: WalletClient;
  private marketplaceClient: SequenceMarketplace;

  constructor(
    config: StateConfig, 
    walletClient: WalletClient,
    marketplaceClient: SequenceMarketplace
  ) {
    this.currentState = TransactionState.IDLE;
    this.config = config;
    this.walletClient = walletClient;
    this.marketplaceClient = marketplaceClient;
  }

  private async generateSteps(): Promise<Step[]> {
    const { type, config } = this.config;
    const address = await this.walletClient.account?.address

    switch (type) {
      case TransactionType.BUY:
        return this.marketplaceClient.generateBuyTransaction({
          collectionAddress: config.collectionAddress,
          buyer: address,
          marketplace: config.marketplace,
          ordersData: [{
            orderId: config.orderId!,
            quantity: config.quantity || '1'
          }],
          additionalFees: []
        }).then(resp => resp.steps);

      case TransactionType.SELL:
        return this.marketplaceClient.generateSellTransaction({
          collectionAddress: config.collectionAddress,
          seller: address,
          marketplace: config.marketplace,
          ordersData: [{
            orderId: config.orderId!,
            quantity: config.quantity || '1'
          }],
          additionalFees: []
        }).then(resp => resp.steps);

      case TransactionType.LISTING:
        return this.marketplaceClient.generateListingTransaction({
          collectionAddress: config.collectionAddress,
          owner: address,
          contractType: config.contractType!,
          orderbook: config.orderbook!,
          listing: config.listing!
        }).then(resp => resp.steps);

      case TransactionType.OFFER:
        return this.marketplaceClient.generateOfferTransaction({
          collectionAddress: config.collectionAddress,
          maker: address,
          contractType: config.contractType!,
          orderbook: config.orderbook!,
          offer: config.offer!
        }).then(resp => resp.steps);

      case TransactionType.CANCEL:
        return this.marketplaceClient.generateCancelTransaction({
          collectionAddress: config.collectionAddress,
          maker: address,
          marketplace: config.marketplace,
          orderId: config.orderId!
        }).then(resp => resp.steps);

      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }

  private async transition(newState: TransactionState) {
    console.log(`Transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
  }

  async start() {
    await this.transition(TransactionState.VALIDATING_CHAIN);

    const chainId = await this.walletClient.getChainId();

    if (String(chainId) !== this.config.config.chainId) {
      await this.transition(TransactionState.WRONG_CHAIN);
      throw new Error("Wrong chain");
    }

    await this.transition(TransactionState.CHECKING_STEPS);

    const steps = await this.generateSteps();

    for (const step of steps) {
      try {
        switch (step.id) {
          case StepType.tokenApproval:
            await this.transition(TransactionState.TOKEN_APPROVAL);
            await this.executeStep(step);
            break;

          case StepType.buy:
          case StepType.sell:
          case StepType.createListing:
          case StepType.createOffer:
          case StepType.cancel:
            await this.transition(TransactionState.EXECUTING_TRANSACTION);
            await this.executeStep(step);
            break;

          default:
            throw new Error(`Unknown step type: ${step.id}`);
        }
      } catch (error) {
        await this.transition(TransactionState.ERROR);
        throw error;
      }
    }

    await this.transition(TransactionState.SUCCESS);
  }

  private async executeTransaction(step: Step) {
    const hash = await this.walletClient.sendTransaction({
      to: step.to,
      data: step.data,
      value: BigInt(step.value || "0"),
    });

    await this.walletClient.waitForTransactionReceipt({ hash });

    if (step.post) {
      await this.marketplaceClient.execute({
        signature: "",
        executeType: ExecuteType,
        body: ''
      })
    }

    return hash;
  }

  private async executeSignature(step: Step): Promise<Signature> {
    switch (step.id) {
      case StepType.signEIP712:
        return this.walletClient.signTypedData({
          domain: step.signature!.domain,
          types: step.signature!.types,
          primaryType: step.signature!.primaryType,
          message: step.signature!.message,
        });

      case StepType.signEIP191:
        return this.walletClient.signMessage({
          message: step.data,
        });

      default:
        throw new Error(`Invalid signature step: ${step.id}`);
    }
  }

  private async executeStep(step: Step) {
    if (!step.to && !step.signature) {
      throw new Error("Invalid step data");
    }

    try {
      switch (step.id) {
        case StepType.tokenApproval:
        case StepType.buy:
        case StepType.sell:
        case StepType.createListing:
        case StepType.createOffer:
        case StepType.cancel:
          const hash = await this.executeTransaction(step);
          await this.walletClient.waitForTransactionReceipt({ hash });
          this.config.onSuccess?.(hash);
          return hash;

        case StepType.signEIP712:
        case StepType.signEIP191:
          const signature = await this.executeSignature(step);
          return signature;

        default:
          throw new Error(`Unknown step type: ${step.id}`);
      }
    } catch (error) {
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  async getTransactionSteps(): Promise<TransactionSteps> {
    const steps = await this.generateSteps();
    
    return {
      needsApproval: steps.some(step => step.id === StepType.tokenApproval),
      approvalStep: steps.find(step => step.id === StepType.tokenApproval),
      executionSteps: steps.filter(step => 
        step.id === StepType.buy || 
        step.id === StepType.sell ||
        step.id === StepType.createListing ||
        step.id === StepType.createOffer ||
        step.id === StepType.cancel
      )
    };
  }
}

// const stateMachine = new TransactionStateMachine(
//   {
//     type: TransactionType.BUY,
//     config: {
//       chainId: "1",
//       collectionAddress: "0x...",
//       marketplace: MarketplaceKind.OpenSea,
//     },
//     onSuccess: (hash) => console.log(`Success: ${hash}`),
//     onError: (error) => console.error(`Error: ${error.message}`),
//   },
//   walletClient,
//   marketplaceClient
// );

// await stateMachine.start();
