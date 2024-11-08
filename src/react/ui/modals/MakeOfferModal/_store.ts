import { observable, when } from "@legendapp/state";
import { useMount, useSelector } from "@legendapp/state/react";
import { useCollection } from "@react-hooks/useCollection";
import { useGenerateOfferTransaction } from "@react-hooks/useGenerateOfferTransaction";
import {
  type Currency,
  OrderbookKind,
  type Price,
  type Step,
  StepType,
  type WalletKind,
} from "@types";
import { addDays } from "date-fns/addDays";
import { parseUnits, type Hex } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import type { ShowMakeOfferModalArgs } from ".";
import type { Messages } from "../../../../types/messages";
import { useTransactionStatusModal } from "../_internal/components/transactionStatusModal";
import {
  getMakeOfferTransactionMessage,
  getMakeOfferTransactionTitle,
} from "./_utils/getMakeOfferTransactionTitleMessage";
import { useCollectible } from "@react-hooks/useCollectible";
import type { CollectionType } from "@internal";

export interface MakeOfferModalState {
  isOpen: boolean;
  open: (args: ShowMakeOfferModalArgs) => void;
  close: () => void;
  state: {
    collectionName: string;
    collectionType: CollectionType | undefined;
    offerPrice: Price;
    quantity: string;
    collectionAddress: Hex;
    chainId: string;
    collectibleId: string;
    expiry: Date;
    messages?: Messages;
  };
  steps: {
    isLoading: () => boolean;
    stepsData: Step[] | undefined;
    _currentStep: null | "tokenApproval" | "createOffer";
    tokenApproval: {
      isNeeded: () => boolean;
      pending: boolean;
      getStep: () => Step | undefined;
      execute: () => void;
    };
    createOffer: {
      pending: boolean;
      execute: () => void;
    };
  };
  hash: Hex | undefined;
}

export const initialState: MakeOfferModalState = {
  isOpen: false,
  open: ({
    collectionAddress,
    chainId,
    collectibleId,
    messages,
  }: ShowMakeOfferModalArgs) => {
    makeOfferModal$.state.set({
      ...makeOfferModal$.state.get(),
      collectionAddress,
      chainId,
      collectibleId,
      messages,
    });
    makeOfferModal$.isOpen.set(true);
  },
  close: () => {
    makeOfferModal$.isOpen.set(false);
  },
  state: {
    collectionName: "",
    offerPrice: {
      amountRaw: "0",
      currency: {} as Currency,
    },
    quantity: "1",
    expiry: new Date(addDays(new Date(), 7).toJSON()),
    collectionType: undefined,
    collectionAddress: "",
    chainId: "",
    collectibleId: "",
  },
  steps: {
    isLoading: () => !!makeOfferModal$.steps.stepsData.get(),
    stepsData: undefined,
    _currentStep: null,
    tokenApproval: {} as MakeOfferModalState["steps"]["tokenApproval"],
    createOffer: {} as MakeOfferModalState["steps"]["createOffer"],
  },
  hash: undefined,
};

export const makeOfferModal$ = observable(initialState);

const exp = new Date(addDays(new Date(), 7).toJSON());

export const useHydrate = () => {
  const chainId = useSelector(makeOfferModal$.state.chainId);
  const collectionAddress = useSelector(
    makeOfferModal$.state.collectionAddress
  );
  const currencyAddress = useSelector(
    makeOfferModal$.state.offerPrice.currency.contractAddress
  );
  const collectionType = useSelector(makeOfferModal$.state.collectionType);
  const { data: collection, isSuccess: isSuccessCollection } = useCollection({
    chainId,
    collectionAddress,
  });

  when(isSuccessCollection, () => {
    makeOfferModal$.state.collectionName.set(collection!.name);
    makeOfferModal$.state.collectionType.set(
      collection!.type as CollectionType
    );
  });

  useTokenApprovalHandler(chainId);
  useCreateOfferHandler(chainId);

  const onOfferSuccess = (data?: Step[]) => {
    makeOfferModal$.steps.stepsData.set(data);
  };

  const { generateOfferTransactionAsync } = useGenerateOfferTransaction({
    chainId,
    onSuccess: onOfferSuccess,
  });

  const { connector, address: userAddress } = useAccount();

  useMount(() => {
    const setSteps = async () => {
      const makeOfferTransactionData = await generateOfferTransactionAsync({
        collectionAddress,
        orderbook: OrderbookKind.sequence_marketplace_v1,
        offer: {
          tokenId: "1",
          quantity: "1",
          expiry: exp,
          currencyAddress,
          pricePerToken:
            makeOfferModal$.state.offerPrice.amountRaw.get() || "1",
        },
        maker: userAddress!,
        contractType: collectionType!,
        walletType: connector?.id as WalletKind,
      });
      makeOfferModal$.steps.stepsData.set(makeOfferTransactionData);
    };

    when(isSuccessCollection && collectionType && currencyAddress, setSteps);
  });
};

const useTokenApprovalHandler = (chainId: string) => {
  const { sendTransactionAsync, isPending, isSuccess } = useSendTransaction();
  const {
    onUnknownError,
    onSuccess,
  }: { onUnknownError?: Function; onSuccess?: Function } =
    makeOfferModal$.state.get().messages?.approveToken || {};

  makeOfferModal$.steps.tokenApproval.set({
    isNeeded: () => !!makeOfferModal$.steps.tokenApproval.getStep(),
    getStep: () =>
      makeOfferModal$.steps.stepsData
        ?.get()
        ?.find((s) => s.id === StepType.tokenApproval),
    pending:
      makeOfferModal$.steps._currentStep.get() === "tokenApproval" && isPending,
    execute: () => {
      const step = makeOfferModal$.steps.tokenApproval.getStep();
      if (!step) return;
      makeOfferModal$.steps._currentStep.set("tokenApproval");
      try {
        sendTransactionAsync({
          to: step.to as Hex,
          chainId: Number(chainId),
          data: step.data as Hex,
          value: BigInt(step.value || "0"),
        });

        onSuccess && onSuccess();
      } catch (error) {
        onUnknownError && onUnknownError(error);
      }
    },
  });

  if (
    isSuccess &&
    makeOfferModal$.steps._currentStep.get() === "tokenApproval"
  ) {
    makeOfferModal$.steps._currentStep.set(null);
  }
};

const useCreateOfferHandler = (chainId: string) => {
  const { collectibleId, collectionAddress } = makeOfferModal$.state.get();
  const { connector, address } = useAccount();
  const {
    generateOfferTransactionAsync,
    isPending: generateOfferTransactionPending,
    error: generateOfferTransactionError,
  } = useGenerateOfferTransaction({ chainId });
  const { data: collectible } = useCollectible({
    chainId,
    collectionAddress,
    collectibleId,
  });

  const {
    onUnknownError,
    onSuccess,
  }: { onUnknownError?: Function; onSuccess?: Function } =
    makeOfferModal$.state.get().messages?.sellCollectible || {};

  const { sendTransactionAsync, isPending: sendTransactionPending } =
    useSendTransaction();

  const { show: showTransactionStatusModal } = useTransactionStatusModal();

  makeOfferModal$.steps.createOffer.set({
    pending:
      makeOfferModal$.steps._currentStep.get() === "createOffer" &&
      (generateOfferTransactionPending || sendTransactionPending),
    execute: () => {
      makeOfferModal$.steps._currentStep.set("createOffer");
      generateOfferTransactionAsync({
        collectionAddress: makeOfferModal$.state.collectionAddress.get(),
        maker: address!,
        contractType: makeOfferModal$.state.collectionType.get()!,
        orderbook: OrderbookKind.sequence_marketplace_v1,
        walletType: connector?.id as WalletKind,
        offer: {
          tokenId: makeOfferModal$.state.collectibleId.get(),
          quantity: makeOfferModal$.state.quantity.get(),
          expiry: makeOfferModal$.state.expiry.get(),
          currencyAddress:
            makeOfferModal$.state.offerPrice.currency.contractAddress.get(),
          pricePerToken: parseUnits(
            makeOfferModal$.state.offerPrice.amountRaw.get(),
            makeOfferModal$.state.offerPrice.currency.decimals.get()
          ).toString(),
        },
      })
        .then(async (steps) => {
          const step = steps.find((s) => s.id === StepType.createOffer);
          if (!step) throw new Error("No steps found");
          const hash = await sendTransactionAsync({
            to: step.to as Hex,
            chainId: Number(chainId),
            data: step.data as Hex,
            value: BigInt(step.value || "0"),
          });

          makeOfferModal$.hash.set(hash);

          makeOfferModal$.steps._currentStep.set(null);

          showTransactionStatusModal({
            hash: hash!,
            price: makeOfferModal$.state.offerPrice.get(),
            collectionAddress,
            chainId,
            tokenId: collectibleId,
            getTitle: getMakeOfferTransactionTitle,
            getMessage: (params) =>
              getMakeOfferTransactionMessage(params, collectible?.name || ""),
            type: StepType.createOffer,
          });

          makeOfferModal$.close();

          onSuccess && onSuccess();
        })
        .catch((error) => {
          onUnknownError && onUnknownError(error);
        });
    },
  });

  if (generateOfferTransactionError) {
    onUnknownError && onUnknownError(generateOfferTransactionError);
  }
};
