//#region src/utils/abi/marketplace/EIP2981.d.ts
declare const EIP2981_ABI: readonly [{
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "_saleCost";
    readonly type: "uint256";
  }];
  readonly name: "royaltyInfo";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "receiver";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "royaltyAmount";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}];
//#endregion
//#region src/utils/abi/marketplace/sequence-marketplace-v1.d.ts
declare const SequenceMarketplaceV1_ABI: readonly [{
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_owner";
    readonly type: "address";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "constructor";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidAdditionalFees";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidBatchRequest";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidCurrency";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "currency";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "quantity";
    readonly type: "uint256";
  }, {
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }];
  readonly name: "InvalidCurrencyApproval";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidExpiry";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidPrice";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidQuantity";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }];
  readonly name: "InvalidRequestId";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidRoyalty";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "tokenContract";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "quantity";
    readonly type: "uint256";
  }, {
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }];
  readonly name: "InvalidTokenApproval";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "contractAddress";
    readonly type: "address";
  }, {
    readonly internalType: "bytes4";
    readonly name: "interfaceId";
    readonly type: "bytes4";
  }];
  readonly name: "UnsupportedContractInterface";
  readonly type: "error";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "tokenContract";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "address";
    readonly name: "recipient";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint96";
    readonly name: "fee";
    readonly type: "uint96";
  }];
  readonly name: "CustomRoyaltyChanged";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "previousOwner";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "newOwner";
    readonly type: "address";
  }];
  readonly name: "OwnershipTransferred";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "buyer";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "tokenContract";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "address";
    readonly name: "receiver";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "quantity";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "quantityRemaining";
    readonly type: "uint256";
  }];
  readonly name: "RequestAccepted";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "tokenContract";
    readonly type: "address";
  }];
  readonly name: "RequestCancelled";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "creator";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "tokenContract";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "bool";
    readonly name: "isListing";
    readonly type: "bool";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "quantity";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "address";
    readonly name: "currency";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "pricePerToken";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "expiry";
    readonly type: "uint256";
  }];
  readonly name: "RequestCreated";
  readonly type: "event";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "quantity";
    readonly type: "uint256";
  }, {
    readonly internalType: "address";
    readonly name: "receiver";
    readonly type: "address";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "additionalFees";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "address[]";
    readonly name: "additionalFeeReceivers";
    readonly type: "address[]";
  }];
  readonly name: "acceptRequest";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "requestIds";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "quantities";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "address[]";
    readonly name: "receivers";
    readonly type: "address[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "additionalFees";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "address[]";
    readonly name: "additionalFeeReceivers";
    readonly type: "address[]";
  }];
  readonly name: "acceptRequestBatch";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }];
  readonly name: "cancelRequest";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "requestIds";
    readonly type: "uint256[]";
  }];
  readonly name: "cancelRequestBatch";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "bool";
      readonly name: "isListing";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "isERC1155";
      readonly type: "bool";
    }, {
      readonly internalType: "address";
      readonly name: "tokenContract";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "tokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "quantity";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint96";
      readonly name: "expiry";
      readonly type: "uint96";
    }, {
      readonly internalType: "address";
      readonly name: "currency";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "pricePerToken";
      readonly type: "uint256";
    }];
    readonly internalType: "struct ISequenceMarketStorage.RequestParams";
    readonly name: "request";
    readonly type: "tuple";
  }];
  readonly name: "createRequest";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "bool";
      readonly name: "isListing";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "isERC1155";
      readonly type: "bool";
    }, {
      readonly internalType: "address";
      readonly name: "tokenContract";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "tokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "quantity";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint96";
      readonly name: "expiry";
      readonly type: "uint96";
    }, {
      readonly internalType: "address";
      readonly name: "currency";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "pricePerToken";
      readonly type: "uint256";
    }];
    readonly internalType: "struct ISequenceMarketStorage.RequestParams[]";
    readonly name: "requests";
    readonly type: "tuple[]";
  }];
  readonly name: "createRequestBatch";
  readonly outputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "requestIds";
    readonly type: "uint256[]";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly name: "customRoyalties";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "recipient";
    readonly type: "address";
  }, {
    readonly internalType: "uint96";
    readonly name: "fee";
    readonly type: "uint96";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }];
  readonly name: "getRequest";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "creator";
      readonly type: "address";
    }, {
      readonly internalType: "bool";
      readonly name: "isListing";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "isERC1155";
      readonly type: "bool";
    }, {
      readonly internalType: "address";
      readonly name: "tokenContract";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "tokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "quantity";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint96";
      readonly name: "expiry";
      readonly type: "uint96";
    }, {
      readonly internalType: "address";
      readonly name: "currency";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "pricePerToken";
      readonly type: "uint256";
    }];
    readonly internalType: "struct ISequenceMarketStorage.Request";
    readonly name: "request";
    readonly type: "tuple";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "requestIds";
    readonly type: "uint256[]";
  }];
  readonly name: "getRequestBatch";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "creator";
      readonly type: "address";
    }, {
      readonly internalType: "bool";
      readonly name: "isListing";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "isERC1155";
      readonly type: "bool";
    }, {
      readonly internalType: "address";
      readonly name: "tokenContract";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "tokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "quantity";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint96";
      readonly name: "expiry";
      readonly type: "uint96";
    }, {
      readonly internalType: "address";
      readonly name: "currency";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "pricePerToken";
      readonly type: "uint256";
    }];
    readonly internalType: "struct ISequenceMarketStorage.Request[]";
    readonly name: "requests";
    readonly type: "tuple[]";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "tokenContract";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "cost";
    readonly type: "uint256";
  }];
  readonly name: "getRoyaltyInfo";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "recipient";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "royalty";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "requestId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "quantity";
    readonly type: "uint256";
  }];
  readonly name: "isRequestValid";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "valid";
    readonly type: "bool";
  }, {
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "creator";
      readonly type: "address";
    }, {
      readonly internalType: "bool";
      readonly name: "isListing";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "isERC1155";
      readonly type: "bool";
    }, {
      readonly internalType: "address";
      readonly name: "tokenContract";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "tokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "quantity";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint96";
      readonly name: "expiry";
      readonly type: "uint96";
    }, {
      readonly internalType: "address";
      readonly name: "currency";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "pricePerToken";
      readonly type: "uint256";
    }];
    readonly internalType: "struct ISequenceMarketStorage.Request";
    readonly name: "request";
    readonly type: "tuple";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "requestIds";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "quantities";
    readonly type: "uint256[]";
  }];
  readonly name: "isRequestValidBatch";
  readonly outputs: readonly [{
    readonly internalType: "bool[]";
    readonly name: "valid";
    readonly type: "bool[]";
  }, {
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "creator";
      readonly type: "address";
    }, {
      readonly internalType: "bool";
      readonly name: "isListing";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "isERC1155";
      readonly type: "bool";
    }, {
      readonly internalType: "address";
      readonly name: "tokenContract";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "tokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "quantity";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint96";
      readonly name: "expiry";
      readonly type: "uint96";
    }, {
      readonly internalType: "address";
      readonly name: "currency";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "pricePerToken";
      readonly type: "uint256";
    }];
    readonly internalType: "struct ISequenceMarketStorage.Request[]";
    readonly name: "requests";
    readonly type: "tuple[]";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "owner";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "renounceOwnership";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "tokenContract";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "recipient";
    readonly type: "address";
  }, {
    readonly internalType: "uint96";
    readonly name: "fee";
    readonly type: "uint96";
  }];
  readonly name: "setRoyaltyInfo";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "newOwner";
    readonly type: "address";
  }];
  readonly name: "transferOwnership";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}];
//#endregion
//#region src/utils/abi/marketplace/sequence-marketplace-v2.d.ts
declare const SequenceMarketplaceV2_ABI: ({
  type: string;
  inputs: never[];
  stateMutability: string;
  name?: undefined;
  outputs?: undefined;
  anonymous?: undefined;
} | {
  type: string;
  name: string;
  inputs: {
    name: string;
    type: string;
    internalType: string;
    components: {
      name: string;
      type: string;
      internalType: string;
    }[];
  }[];
  outputs: {
    name: string;
    type: string;
    internalType: string;
  }[];
  stateMutability: string;
  anonymous?: undefined;
} | {
  type: string;
  name: string;
  inputs: {
    name: string;
    type: string;
    internalType: string;
  }[];
  outputs: ({
    name: string;
    type: string;
    internalType: string;
    components?: undefined;
  } | {
    name: string;
    type: string;
    internalType: string;
    components: {
      name: string;
      type: string;
      internalType: string;
    }[];
  })[];
  stateMutability: string;
  anonymous?: undefined;
} | {
  type: string;
  name: string;
  inputs: {
    name: string;
    type: string;
    indexed: boolean;
    internalType: string;
  }[];
  anonymous: boolean;
  stateMutability?: undefined;
  outputs?: undefined;
} | {
  type: string;
  name: string;
  inputs: {
    name: string;
    type: string;
    internalType: string;
  }[];
  stateMutability?: undefined;
  outputs?: undefined;
  anonymous?: undefined;
})[];
//#endregion
export { SequenceMarketplaceV1_ABI as n, EIP2981_ABI as r, SequenceMarketplaceV2_ABI as t };
//# sourceMappingURL=index5.d.ts.map