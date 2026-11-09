//#region src/utils/abi/primary-sale/sequence-721-sales-contract-v0.d.ts
declare const ERC721_SALE_ABI_V0: readonly [{
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
//#region src/utils/abi/primary-sale/sequence-721-sales-contract-v1.d.ts
declare const ERC721_SALE_ABI_V1: readonly [{
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "currency";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "expected";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "actual";
    readonly type: "uint256";
  }];
  readonly name: "InsufficientPayment";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "amount";
    readonly type: "uint256";
  }];
  readonly name: "InsufficientSupply";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidInitialization";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidSaleDetails";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "root";
    readonly type: "bytes32";
  }, {
    readonly internalType: "bytes32[]";
    readonly name: "proof";
    readonly type: "bytes32[]";
  }, {
    readonly internalType: "address";
    readonly name: "addr";
    readonly type: "address";
  }, {
    readonly internalType: "bytes32";
    readonly name: "salt";
    readonly type: "bytes32";
  }];
  readonly name: "MerkleProofInvalid";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "SaleInactive";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "WithdrawFailed";
  readonly type: "error";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: false;
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "amount";
    readonly type: "uint256";
  }];
  readonly name: "ItemsMinted";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "previousAdminRole";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "newAdminRole";
    readonly type: "bytes32";
  }];
  readonly name: "RoleAdminChanged";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "sender";
    readonly type: "address";
  }];
  readonly name: "RoleGranted";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "sender";
    readonly type: "address";
  }];
  readonly name: "RoleRevoked";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "cost";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "address";
    readonly name: "paymentToken";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint64";
    readonly name: "startTime";
    readonly type: "uint64";
  }, {
    readonly indexed: false;
    readonly internalType: "uint64";
    readonly name: "endTime";
    readonly type: "uint64";
  }, {
    readonly indexed: false;
    readonly internalType: "bytes32";
    readonly name: "merkleRoot";
    readonly type: "bytes32";
  }];
  readonly name: "SaleDetailsUpdated";
  readonly type: "event";
}, {
  readonly inputs: readonly [];
  readonly name: "DEFAULT_ADMIN_ROLE";
  readonly outputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "";
    readonly type: "bytes32";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "wallet";
    readonly type: "address";
  }, {
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "approvedSigner";
      readonly type: "address";
    }, {
      readonly internalType: "bytes4";
      readonly name: "identityType";
      readonly type: "bytes4";
    }, {
      readonly internalType: "bytes32";
      readonly name: "issuerHash";
      readonly type: "bytes32";
    }, {
      readonly internalType: "bytes32";
      readonly name: "audienceHash";
      readonly type: "bytes32";
    }, {
      readonly internalType: "bytes";
      readonly name: "applicationData";
      readonly type: "bytes";
    }, {
      readonly components: readonly [{
        readonly internalType: "string";
        readonly name: "redirectUrl";
        readonly type: "string";
      }, {
        readonly internalType: "uint64";
        readonly name: "issuedAt";
        readonly type: "uint64";
      }];
      readonly internalType: "struct AuthData";
      readonly name: "authData";
      readonly type: "tuple";
    }];
    readonly internalType: "struct Attestation";
    readonly name: "attestation";
    readonly type: "tuple";
  }, {
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "to";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "value";
      readonly type: "uint256";
    }, {
      readonly internalType: "bytes";
      readonly name: "data";
      readonly type: "bytes";
    }, {
      readonly internalType: "uint256";
      readonly name: "gasLimit";
      readonly type: "uint256";
    }, {
      readonly internalType: "bool";
      readonly name: "delegateCall";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "onlyFallback";
      readonly type: "bool";
    }, {
      readonly internalType: "uint256";
      readonly name: "behaviorOnError";
      readonly type: "uint256";
    }];
    readonly internalType: "struct Payload.Call";
    readonly name: "call";
    readonly type: "tuple";
  }];
  readonly name: "acceptImplicitRequest";
  readonly outputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "";
    readonly type: "bytes32";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "root";
    readonly type: "bytes32";
  }, {
    readonly internalType: "bytes32[]";
    readonly name: "proof";
    readonly type: "bytes32[]";
  }, {
    readonly internalType: "address";
    readonly name: "addr";
    readonly type: "address";
  }, {
    readonly internalType: "bytes32";
    readonly name: "salt";
    readonly type: "bytes32";
  }];
  readonly name: "checkMerkleProof";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }];
  readonly name: "getRoleAdmin";
  readonly outputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "";
    readonly type: "bytes32";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "uint256";
    readonly name: "index";
    readonly type: "uint256";
  }];
  readonly name: "getRoleMember";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }];
  readonly name: "getRoleMemberCount";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "grantRole";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "hasRole";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "items";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "implicitModeValidator";
    readonly type: "address";
  }, {
    readonly internalType: "bytes32";
    readonly name: "implicitModeProjectId";
    readonly type: "bytes32";
  }];
  readonly name: "initialize";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "itemsContract";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "amount";
    readonly type: "uint256";
  }, {
    readonly internalType: "address";
    readonly name: "paymentToken";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "maxTotal";
    readonly type: "uint256";
  }, {
    readonly internalType: "bytes32[]";
    readonly name: "proof";
    readonly type: "bytes32[]";
  }];
  readonly name: "mint";
  readonly outputs: readonly [];
  readonly stateMutability: "payable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "renounceRole";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "revokeRole";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "saleDetails";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "uint256";
      readonly name: "remainingSupply";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "cost";
      readonly type: "uint256";
    }, {
      readonly internalType: "address";
      readonly name: "paymentToken";
      readonly type: "address";
    }, {
      readonly internalType: "uint64";
      readonly name: "startTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "endTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "bytes32";
      readonly name: "merkleRoot";
      readonly type: "bytes32";
    }];
    readonly internalType: "struct IERC721SaleFunctions.SaleDetails";
    readonly name: "";
    readonly type: "tuple";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "projectId";
    readonly type: "bytes32";
  }];
  readonly name: "setImplicitModeProjectId";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "validator";
    readonly type: "address";
  }];
  readonly name: "setImplicitModeValidator";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "cost";
    readonly type: "uint256";
  }, {
    readonly internalType: "address";
    readonly name: "paymentToken";
    readonly type: "address";
  }, {
    readonly internalType: "uint64";
    readonly name: "startTime";
    readonly type: "uint64";
  }, {
    readonly internalType: "uint64";
    readonly name: "endTime";
    readonly type: "uint64";
  }, {
    readonly internalType: "bytes32";
    readonly name: "merkleRoot";
    readonly type: "bytes32";
  }];
  readonly name: "setSaleDetails";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes4";
    readonly name: "interfaceId";
    readonly type: "bytes4";
  }];
  readonly name: "supportsInterface";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "token";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "withdrawERC20";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "withdrawETH";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}];
//#endregion
//#region src/utils/abi/primary-sale/sequence-1155-sales-contract-v0.d.ts
declare const ERC1155_SALES_CONTRACT_ABI_V0: readonly [{
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
  readonly name: "setTokenSaleDetailsBatch";
  readonly inputs: readonly [{
    readonly name: "tokenIds";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "costs";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "supplyCaps";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "startTimes";
    readonly type: "uint64[]";
    readonly internalType: "uint64[]";
  }, {
    readonly name: "endTimes";
    readonly type: "uint64[]";
    readonly internalType: "uint64[]";
  }, {
    readonly name: "merkleRoots";
    readonly type: "bytes32[]";
    readonly internalType: "bytes32[]";
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
  readonly name: "tokenSaleDetailsBatch";
  readonly inputs: readonly [{
    readonly name: "tokenIds";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "tuple[]";
    readonly internalType: "struct IERC1155SaleFunctions.SaleDetails[]";
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
  readonly name: "ItemsMinted";
  readonly inputs: readonly [{
    readonly name: "to";
    readonly type: "address";
    readonly indexed: false;
    readonly internalType: "address";
  }, {
    readonly name: "tokenIds";
    readonly type: "uint256[]";
    readonly indexed: false;
    readonly internalType: "uint256[]";
  }, {
    readonly name: "amounts";
    readonly type: "uint256[]";
    readonly indexed: false;
    readonly internalType: "uint256[]";
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
//#region src/utils/abi/primary-sale/sequence-1155-sales-contract-v1.d.ts
declare const ERC1155_SALES_CONTRACT_ABI_V1: readonly [{
  readonly inputs: readonly [];
  readonly name: "GlobalSaleInactive";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "currency";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "expected";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "actual";
    readonly type: "uint256";
  }];
  readonly name: "InsufficientPayment";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "amount";
    readonly type: "uint256";
  }];
  readonly name: "InsufficientSupply";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidInitialization";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidSaleDetails";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidTokenIds";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "root";
    readonly type: "bytes32";
  }, {
    readonly internalType: "bytes32[]";
    readonly name: "proof";
    readonly type: "bytes32[]";
  }, {
    readonly internalType: "address";
    readonly name: "addr";
    readonly type: "address";
  }, {
    readonly internalType: "bytes32";
    readonly name: "salt";
    readonly type: "bytes32";
  }];
  readonly name: "MerkleProofInvalid";
  readonly type: "error";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }];
  readonly name: "SaleInactive";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "WithdrawFailed";
  readonly type: "error";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "minTokenId";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "maxTokenId";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "cost";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint64";
    readonly name: "startTime";
    readonly type: "uint64";
  }, {
    readonly indexed: false;
    readonly internalType: "uint64";
    readonly name: "endTime";
    readonly type: "uint64";
  }, {
    readonly indexed: false;
    readonly internalType: "bytes32";
    readonly name: "merkleRoot";
    readonly type: "bytes32";
  }];
  readonly name: "GlobalSaleDetailsUpdated";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: false;
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256[]";
    readonly name: "tokenIds";
    readonly type: "uint256[]";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256[]";
    readonly name: "amounts";
    readonly type: "uint256[]";
  }];
  readonly name: "ItemsMinted";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "previousAdminRole";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "newAdminRole";
    readonly type: "bytes32";
  }];
  readonly name: "RoleAdminChanged";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "sender";
    readonly type: "address";
  }];
  readonly name: "RoleGranted";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "sender";
    readonly type: "address";
  }];
  readonly name: "RoleRevoked";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "cost";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint64";
    readonly name: "startTime";
    readonly type: "uint64";
  }, {
    readonly indexed: false;
    readonly internalType: "uint64";
    readonly name: "endTime";
    readonly type: "uint64";
  }, {
    readonly indexed: false;
    readonly internalType: "bytes32";
    readonly name: "merkleRoot";
    readonly type: "bytes32";
  }];
  readonly name: "TokenSaleDetailsUpdated";
  readonly type: "event";
}, {
  readonly inputs: readonly [];
  readonly name: "DEFAULT_ADMIN_ROLE";
  readonly outputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "";
    readonly type: "bytes32";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "wallet";
    readonly type: "address";
  }, {
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "approvedSigner";
      readonly type: "address";
    }, {
      readonly internalType: "bytes4";
      readonly name: "identityType";
      readonly type: "bytes4";
    }, {
      readonly internalType: "bytes32";
      readonly name: "issuerHash";
      readonly type: "bytes32";
    }, {
      readonly internalType: "bytes32";
      readonly name: "audienceHash";
      readonly type: "bytes32";
    }, {
      readonly internalType: "bytes";
      readonly name: "applicationData";
      readonly type: "bytes";
    }, {
      readonly components: readonly [{
        readonly internalType: "string";
        readonly name: "redirectUrl";
        readonly type: "string";
      }, {
        readonly internalType: "uint64";
        readonly name: "issuedAt";
        readonly type: "uint64";
      }];
      readonly internalType: "struct AuthData";
      readonly name: "authData";
      readonly type: "tuple";
    }];
    readonly internalType: "struct Attestation";
    readonly name: "attestation";
    readonly type: "tuple";
  }, {
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "to";
      readonly type: "address";
    }, {
      readonly internalType: "uint256";
      readonly name: "value";
      readonly type: "uint256";
    }, {
      readonly internalType: "bytes";
      readonly name: "data";
      readonly type: "bytes";
    }, {
      readonly internalType: "uint256";
      readonly name: "gasLimit";
      readonly type: "uint256";
    }, {
      readonly internalType: "bool";
      readonly name: "delegateCall";
      readonly type: "bool";
    }, {
      readonly internalType: "bool";
      readonly name: "onlyFallback";
      readonly type: "bool";
    }, {
      readonly internalType: "uint256";
      readonly name: "behaviorOnError";
      readonly type: "uint256";
    }];
    readonly internalType: "struct Payload.Call";
    readonly name: "call";
    readonly type: "tuple";
  }];
  readonly name: "acceptImplicitRequest";
  readonly outputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "";
    readonly type: "bytes32";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "root";
    readonly type: "bytes32";
  }, {
    readonly internalType: "bytes32[]";
    readonly name: "proof";
    readonly type: "bytes32[]";
  }, {
    readonly internalType: "address";
    readonly name: "addr";
    readonly type: "address";
  }, {
    readonly internalType: "bytes32";
    readonly name: "salt";
    readonly type: "bytes32";
  }];
  readonly name: "checkMerkleProof";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }];
  readonly name: "getRoleAdmin";
  readonly outputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "";
    readonly type: "bytes32";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "uint256";
    readonly name: "index";
    readonly type: "uint256";
  }];
  readonly name: "getRoleMember";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }];
  readonly name: "getRoleMemberCount";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "globalSaleDetails";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "uint256";
      readonly name: "minTokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "maxTokenId";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "cost";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "remainingSupply";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint64";
      readonly name: "startTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "endTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "bytes32";
      readonly name: "merkleRoot";
      readonly type: "bytes32";
    }];
    readonly internalType: "struct IERC1155SaleFunctions.GlobalSaleDetails";
    readonly name: "";
    readonly type: "tuple";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "grantRole";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "hasRole";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "items";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "implicitModeValidator";
    readonly type: "address";
  }, {
    readonly internalType: "bytes32";
    readonly name: "implicitModeProjectId";
    readonly type: "bytes32";
  }];
  readonly name: "initialize";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "tokenIds";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "amounts";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "bytes";
    readonly name: "data";
    readonly type: "bytes";
  }, {
    readonly internalType: "address";
    readonly name: "expectedPaymentToken";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "maxTotal";
    readonly type: "uint256";
  }, {
    readonly internalType: "bytes32[]";
    readonly name: "proof";
    readonly type: "bytes32[]";
  }];
  readonly name: "mint";
  readonly outputs: readonly [];
  readonly stateMutability: "payable";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "paymentToken";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "renounceRole";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "role";
    readonly type: "bytes32";
  }, {
    readonly internalType: "address";
    readonly name: "account";
    readonly type: "address";
  }];
  readonly name: "revokeRole";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "minTokenId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "maxTokenId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "cost";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint64";
    readonly name: "startTime";
    readonly type: "uint64";
  }, {
    readonly internalType: "uint64";
    readonly name: "endTime";
    readonly type: "uint64";
  }, {
    readonly internalType: "bytes32";
    readonly name: "merkleRoot";
    readonly type: "bytes32";
  }];
  readonly name: "setGlobalSaleDetails";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes32";
    readonly name: "projectId";
    readonly type: "bytes32";
  }];
  readonly name: "setImplicitModeProjectId";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "validator";
    readonly type: "address";
  }];
  readonly name: "setImplicitModeValidator";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "paymentTokenAddr";
    readonly type: "address";
  }];
  readonly name: "setPaymentToken";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "cost";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "remainingSupply";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint64";
    readonly name: "startTime";
    readonly type: "uint64";
  }, {
    readonly internalType: "uint64";
    readonly name: "endTime";
    readonly type: "uint64";
  }, {
    readonly internalType: "bytes32";
    readonly name: "merkleRoot";
    readonly type: "bytes32";
  }];
  readonly name: "setTokenSaleDetails";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "tokenIds";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "costs";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "remainingSupplies";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "uint64[]";
    readonly name: "startTimes";
    readonly type: "uint64[]";
  }, {
    readonly internalType: "uint64[]";
    readonly name: "endTimes";
    readonly type: "uint64[]";
  }, {
    readonly internalType: "bytes32[]";
    readonly name: "merkleRoots";
    readonly type: "bytes32[]";
  }];
  readonly name: "setTokenSaleDetailsBatch";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes4";
    readonly name: "interfaceId";
    readonly type: "bytes4";
  }];
  readonly name: "supportsInterface";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }];
  readonly name: "tokenSaleDetails";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "uint256";
      readonly name: "cost";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "remainingSupply";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint64";
      readonly name: "startTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "endTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "bytes32";
      readonly name: "merkleRoot";
      readonly type: "bytes32";
    }];
    readonly internalType: "struct IERC1155SaleFunctions.SaleDetails";
    readonly name: "";
    readonly type: "tuple";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "tokenIds";
    readonly type: "uint256[]";
  }];
  readonly name: "tokenSaleDetailsBatch";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "uint256";
      readonly name: "cost";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint256";
      readonly name: "remainingSupply";
      readonly type: "uint256";
    }, {
      readonly internalType: "uint64";
      readonly name: "startTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "endTime";
      readonly type: "uint64";
    }, {
      readonly internalType: "bytes32";
      readonly name: "merkleRoot";
      readonly type: "bytes32";
    }];
    readonly internalType: "struct IERC1155SaleFunctions.SaleDetails[]";
    readonly name: "";
    readonly type: "tuple[]";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "token";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "withdrawERC20";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "withdrawETH";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}];
//#endregion
export { ERC721_SALE_ABI_V0 as i, ERC1155_SALES_CONTRACT_ABI_V0 as n, ERC721_SALE_ABI_V1 as r, ERC1155_SALES_CONTRACT_ABI_V1 as t };
//# sourceMappingURL=index6.d.ts.map