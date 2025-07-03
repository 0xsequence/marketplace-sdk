//#region src/utils/abi/primary-sale/sequence-721-sales-contract.d.ts
declare const ERC721_SALE_ABI: readonly [{
  readonly type: "function";
  readonly name: "DEFAULT_ADMIN_ROLE";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "checkMerkleProof";
  readonly inputs: readonly [{
    readonly name: "root";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "proof";
    readonly type: "bytes32[]";
    readonly internalType: "bytes32[]";
  }, {
    readonly name: "addr";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "salt";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bool";
    readonly internalType: "bool";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "getRoleAdmin";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "getRoleMember";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "index";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "getRoleMemberCount";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "grantRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "hasRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bool";
    readonly internalType: "bool";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "initialize";
  readonly inputs: readonly [{
    readonly name: "owner";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "items";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "itemsContract";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "mint";
  readonly inputs: readonly [{
    readonly name: "to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "amount";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "paymentToken";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "maxTotal";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "proof";
    readonly type: "bytes32[]";
    readonly internalType: "bytes32[]";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "payable";
}, {
  readonly type: "function";
  readonly name: "renounceRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "revokeRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "saleDetails";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "tuple";
    readonly internalType: "struct IERC721SaleFunctions.SaleDetails";
    readonly components: readonly [{
      readonly name: "supplyCap";
      readonly type: "uint256";
      readonly internalType: "uint256";
    }, {
      readonly name: "cost";
      readonly type: "uint256";
      readonly internalType: "uint256";
    }, {
      readonly name: "paymentToken";
      readonly type: "address";
      readonly internalType: "address";
    }, {
      readonly name: "startTime";
      readonly type: "uint64";
      readonly internalType: "uint64";
    }, {
      readonly name: "endTime";
      readonly type: "uint64";
      readonly internalType: "uint64";
    }, {
      readonly name: "merkleRoot";
      readonly type: "bytes32";
      readonly internalType: "bytes32";
    }];
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "setSaleDetails";
  readonly inputs: readonly [{
    readonly name: "supplyCap";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "cost";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "paymentToken";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "startTime";
    readonly type: "uint64";
    readonly internalType: "uint64";
  }, {
    readonly name: "endTime";
    readonly type: "uint64";
    readonly internalType: "uint64";
  }, {
    readonly name: "merkleRoot";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "supportsInterface";
  readonly inputs: readonly [{
    readonly name: "interfaceId";
    readonly type: "bytes4";
    readonly internalType: "bytes4";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bool";
    readonly internalType: "bool";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "withdrawERC20";
  readonly inputs: readonly [{
    readonly name: "token";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "value";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "withdrawETH";
  readonly inputs: readonly [{
    readonly name: "to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "value";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "event";
  readonly name: "RoleAdminChanged";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "previousAdminRole";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "newAdminRole";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "RoleGranted";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "sender";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "RoleRevoked";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "sender";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "SaleDetailsUpdated";
  readonly inputs: readonly [{
    readonly name: "supplyCap";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "cost";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "paymentToken";
    readonly type: "address";
    readonly indexed: false;
    readonly internalType: "address";
  }, {
    readonly name: "startTime";
    readonly type: "uint64";
    readonly indexed: false;
    readonly internalType: "uint64";
  }, {
    readonly name: "endTime";
    readonly type: "uint64";
    readonly indexed: false;
    readonly internalType: "uint64";
  }, {
    readonly name: "merkleRoot";
    readonly type: "bytes32";
    readonly indexed: false;
    readonly internalType: "bytes32";
  }];
  readonly anonymous: false;
}, {
  readonly type: "error";
  readonly name: "InsufficientPayment";
  readonly inputs: readonly [{
    readonly name: "currency";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "expected";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "actual";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
}, {
  readonly type: "error";
  readonly name: "InsufficientSupply";
  readonly inputs: readonly [{
    readonly name: "currentSupply";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "amount";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "maxSupply";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
}, {
  readonly type: "error";
  readonly name: "InvalidInitialization";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "InvalidSaleDetails";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "MerkleProofInvalid";
  readonly inputs: readonly [{
    readonly name: "root";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "proof";
    readonly type: "bytes32[]";
    readonly internalType: "bytes32[]";
  }, {
    readonly name: "addr";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "salt";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
}, {
  readonly type: "error";
  readonly name: "SaleInactive";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "WithdrawFailed";
  readonly inputs: readonly [];
}];
//#endregion
//#region src/utils/abi/primary-sale/sequence-1155-sales-contract.d.ts
declare const ERC1155_SALES_CONTRACT_ABI: readonly [{
  readonly type: "function";
  readonly name: "DEFAULT_ADMIN_ROLE";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "checkMerkleProof";
  readonly inputs: readonly [{
    readonly name: "root";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "proof";
    readonly type: "bytes32[]";
    readonly internalType: "bytes32[]";
  }, {
    readonly name: "addr";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "salt";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bool";
    readonly internalType: "bool";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "getRoleAdmin";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "getRoleMember";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "index";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "getRoleMemberCount";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "globalSaleDetails";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "tuple";
    readonly internalType: "struct IERC1155SaleFunctions.SaleDetails";
    readonly components: readonly [{
      readonly name: "cost";
      readonly type: "uint256";
      readonly internalType: "uint256";
    }, {
      readonly name: "supplyCap";
      readonly type: "uint256";
      readonly internalType: "uint256";
    }, {
      readonly name: "startTime";
      readonly type: "uint64";
      readonly internalType: "uint64";
    }, {
      readonly name: "endTime";
      readonly type: "uint64";
      readonly internalType: "uint64";
    }, {
      readonly name: "merkleRoot";
      readonly type: "bytes32";
      readonly internalType: "bytes32";
    }];
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "grantRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "hasRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bool";
    readonly internalType: "bool";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "initialize";
  readonly inputs: readonly [{
    readonly name: "owner";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "items";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "mint";
  readonly inputs: readonly [{
    readonly name: "to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "tokenIds";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "amounts";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "data";
    readonly type: "bytes";
    readonly internalType: "bytes";
  }, {
    readonly name: "expectedPaymentToken";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "maxTotal";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "proof";
    readonly type: "bytes32[]";
    readonly internalType: "bytes32[]";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "payable";
}, {
  readonly type: "function";
  readonly name: "paymentToken";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "renounceRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "revokeRole";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setGlobalSaleDetails";
  readonly inputs: readonly [{
    readonly name: "cost";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "supplyCap";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "startTime";
    readonly type: "uint64";
    readonly internalType: "uint64";
  }, {
    readonly name: "endTime";
    readonly type: "uint64";
    readonly internalType: "uint64";
  }, {
    readonly name: "merkleRoot";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setPaymentToken";
  readonly inputs: readonly [{
    readonly name: "paymentTokenAddr";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setTokenSaleDetails";
  readonly inputs: readonly [{
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "cost";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "supplyCap";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "startTime";
    readonly type: "uint64";
    readonly internalType: "uint64";
  }, {
    readonly name: "endTime";
    readonly type: "uint64";
    readonly internalType: "uint64";
  }, {
    readonly name: "merkleRoot";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "supportsInterface";
  readonly inputs: readonly [{
    readonly name: "interfaceId";
    readonly type: "bytes4";
    readonly internalType: "bytes4";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "bool";
    readonly internalType: "bool";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "tokenSaleDetails";
  readonly inputs: readonly [{
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "tuple";
    readonly internalType: "struct IERC1155SaleFunctions.SaleDetails";
    readonly components: readonly [{
      readonly name: "cost";
      readonly type: "uint256";
      readonly internalType: "uint256";
    }, {
      readonly name: "supplyCap";
      readonly type: "uint256";
      readonly internalType: "uint256";
    }, {
      readonly name: "startTime";
      readonly type: "uint64";
      readonly internalType: "uint64";
    }, {
      readonly name: "endTime";
      readonly type: "uint64";
      readonly internalType: "uint64";
    }, {
      readonly name: "merkleRoot";
      readonly type: "bytes32";
      readonly internalType: "bytes32";
    }];
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "withdrawERC20";
  readonly inputs: readonly [{
    readonly name: "token";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "value";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "withdrawETH";
  readonly inputs: readonly [{
    readonly name: "to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "value";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "event";
  readonly name: "GlobalSaleDetailsUpdated";
  readonly inputs: readonly [{
    readonly name: "cost";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "supplyCap";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "startTime";
    readonly type: "uint64";
    readonly indexed: false;
    readonly internalType: "uint64";
  }, {
    readonly name: "endTime";
    readonly type: "uint64";
    readonly indexed: false;
    readonly internalType: "uint64";
  }, {
    readonly name: "merkleRoot";
    readonly type: "bytes32";
    readonly indexed: false;
    readonly internalType: "bytes32";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "RoleAdminChanged";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "previousAdminRole";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "newAdminRole";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "RoleGranted";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "sender";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "RoleRevoked";
  readonly inputs: readonly [{
    readonly name: "role";
    readonly type: "bytes32";
    readonly indexed: true;
    readonly internalType: "bytes32";
  }, {
    readonly name: "account";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "sender";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "TokenSaleDetailsUpdated";
  readonly inputs: readonly [{
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "cost";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "supplyCap";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "startTime";
    readonly type: "uint64";
    readonly indexed: false;
    readonly internalType: "uint64";
  }, {
    readonly name: "endTime";
    readonly type: "uint64";
    readonly indexed: false;
    readonly internalType: "uint64";
  }, {
    readonly name: "merkleRoot";
    readonly type: "bytes32";
    readonly indexed: false;
    readonly internalType: "bytes32";
  }];
  readonly anonymous: false;
}, {
  readonly type: "error";
  readonly name: "GlobalSaleInactive";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "InsufficientPayment";
  readonly inputs: readonly [{
    readonly name: "currency";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "expected";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "actual";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
}, {
  readonly type: "error";
  readonly name: "InsufficientSupply";
  readonly inputs: readonly [{
    readonly name: "currentSupply";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "requestedAmount";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "maxSupply";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
}, {
  readonly type: "error";
  readonly name: "InvalidInitialization";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "InvalidSaleDetails";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "InvalidTokenIds";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "MerkleProofInvalid";
  readonly inputs: readonly [{
    readonly name: "root";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }, {
    readonly name: "proof";
    readonly type: "bytes32[]";
    readonly internalType: "bytes32[]";
  }, {
    readonly name: "addr";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "salt";
    readonly type: "bytes32";
    readonly internalType: "bytes32";
  }];
}, {
  readonly type: "error";
  readonly name: "SaleInactive";
  readonly inputs: readonly [{
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
}, {
  readonly type: "error";
  readonly name: "WithdrawFailed";
  readonly inputs: readonly [];
}];
//#endregion
export { ERC1155_SALES_CONTRACT_ABI, ERC721_SALE_ABI };
//# sourceMappingURL=index-DOlDAkgf.d.ts.map