//#region src/utils/abi/token/ERC20.d.ts
declare const ERC20_ABI: readonly [{
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "spender";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "Approval";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "from";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "Transfer";
  readonly type: "event";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "spender";
    readonly type: "address";
  }];
  readonly name: "allowance";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "spender";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "approve";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "who";
    readonly type: "address";
  }];
  readonly name: "balanceOf";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "totalSupply";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
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
    readonly name: "value";
    readonly type: "uint256";
  }];
  readonly name: "transfer";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "from";
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
  readonly name: "transferFrom";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}];
//#endregion
//#region src/utils/abi/token/ERC721.d.ts
declare const ERC721_ABI: readonly [{
  readonly inputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "constructor";
}, {
  readonly inputs: readonly [];
  readonly name: "AlreadyInitialized";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidMintRequest";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "InvalidSequenceConfig";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "NotAuthorized";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "SequenceIsSealed";
  readonly type: "error";
}, {
  readonly inputs: readonly [];
  readonly name: "SequenceSupplyExhausted";
  readonly type: "error";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "spender";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }];
  readonly name: "Approval";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "operator";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "bool";
    readonly name: "approved";
    readonly type: "bool";
  }];
  readonly name: "ApprovalForAll";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: false;
    readonly internalType: "string";
    readonly name: "topic";
    readonly type: "string";
  }, {
    readonly indexed: false;
    readonly internalType: "string";
    readonly name: "message";
    readonly type: "string";
  }];
  readonly name: "Broadcast";
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
    readonly name: "tokenId";
    readonly type: "uint256";
  }, {
    readonly indexed: true;
    readonly internalType: "uint16";
    readonly name: "sequenceId";
    readonly type: "uint16";
  }, {
    readonly indexed: false;
    readonly internalType: "uint80";
    readonly name: "data";
    readonly type: "uint80";
  }];
  readonly name: "RecordCreated";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "uint16";
    readonly name: "sequenceId";
    readonly type: "uint16";
  }, {
    readonly components: readonly [{
      readonly internalType: "uint64";
      readonly name: "sealedBeforeTimestamp";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "sealedAfterTimestamp";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "maxSupply";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "minted";
      readonly type: "uint64";
    }, {
      readonly internalType: "contract IEngine";
      readonly name: "engine";
      readonly type: "address";
    }, {
      readonly internalType: "uint64";
      readonly name: "dropNodeId";
      readonly type: "uint64";
    }];
    readonly indexed: false;
    readonly internalType: "struct SequenceData";
    readonly name: "sequenceData";
    readonly type: "tuple";
  }, {
    readonly indexed: false;
    readonly internalType: "bytes";
    readonly name: "engineData";
    readonly type: "bytes";
  }];
  readonly name: "SequenceConfigured";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "from";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }];
  readonly name: "Transfer";
  readonly type: "event";
}, {
  readonly inputs: readonly [];
  readonly name: "accessControl";
  readonly outputs: readonly [{
    readonly internalType: "contract INodeRegistry";
    readonly name: "nodeRegistry";
    readonly type: "address";
  }, {
    readonly internalType: "uint64";
    readonly name: "controlNodeId";
    readonly type: "uint64";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "spender";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }];
  readonly name: "approve";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }];
  readonly name: "balanceOf";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "string";
    readonly name: "topic";
    readonly type: "string";
  }, {
    readonly internalType: "string";
    readonly name: "message";
    readonly type: "string";
  }];
  readonly name: "broadcast";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "uint64";
      readonly name: "sealedBeforeTimestamp";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "sealedAfterTimestamp";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "maxSupply";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "minted";
      readonly type: "uint64";
    }, {
      readonly internalType: "contract IEngine";
      readonly name: "engine";
      readonly type: "address";
    }, {
      readonly internalType: "uint64";
      readonly name: "dropNodeId";
      readonly type: "uint64";
    }];
    readonly internalType: "struct SequenceData";
    readonly name: "_sequence";
    readonly type: "tuple";
  }, {
    readonly internalType: "bytes";
    readonly name: "_engineData";
    readonly type: "bytes";
  }];
  readonly name: "configureSequence";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "contractURI";
  readonly outputs: readonly [{
    readonly internalType: "string";
    readonly name: "value";
    readonly type: "string";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "controlNode";
  readonly outputs: readonly [{
    readonly internalType: "uint64";
    readonly name: "nodeId";
    readonly type: "uint64";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly name: "getApproved";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint16";
    readonly name: "sequenceId";
    readonly type: "uint16";
  }];
  readonly name: "getSequenceData";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "uint64";
      readonly name: "sealedBeforeTimestamp";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "sealedAfterTimestamp";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "maxSupply";
      readonly type: "uint64";
    }, {
      readonly internalType: "uint64";
      readonly name: "minted";
      readonly type: "uint64";
    }, {
      readonly internalType: "contract IEngine";
      readonly name: "engine";
      readonly type: "address";
    }, {
      readonly internalType: "uint64";
      readonly name: "dropNodeId";
      readonly type: "uint64";
    }];
    readonly internalType: "struct SequenceData";
    readonly name: "sequence";
    readonly type: "tuple";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }];
  readonly name: "getTokenData";
  readonly outputs: readonly [{
    readonly components: readonly [{
      readonly internalType: "address";
      readonly name: "owner";
      readonly type: "address";
    }, {
      readonly internalType: "uint16";
      readonly name: "sequenceId";
      readonly type: "uint16";
    }, {
      readonly internalType: "uint80";
      readonly name: "data";
      readonly type: "uint80";
    }];
    readonly internalType: "struct TokenData";
    readonly name: "";
    readonly type: "tuple";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_owner";
    readonly type: "address";
  }, {
    readonly components: readonly [{
      readonly internalType: "contract INodeRegistry";
      readonly name: "nodeRegistry";
      readonly type: "address";
    }, {
      readonly internalType: "uint64";
      readonly name: "controlNodeId";
      readonly type: "uint64";
    }];
    readonly internalType: "struct AccessControlData";
    readonly name: "_accessControl";
    readonly type: "tuple";
  }, {
    readonly internalType: "string";
    readonly name: "_metadata";
    readonly type: "string";
  }, {
    readonly components: readonly [{
      readonly internalType: "string";
      readonly name: "name";
      readonly type: "string";
    }, {
      readonly internalType: "string";
      readonly name: "symbol";
      readonly type: "string";
    }, {
      readonly internalType: "string";
      readonly name: "contractURI";
      readonly type: "string";
    }];
    readonly internalType: "struct ImmutableCollectionData";
    readonly name: "_data";
    readonly type: "tuple";
  }];
  readonly name: "init";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "";
    readonly type: "address";
  }];
  readonly name: "isApprovedForAll";
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
    readonly name: "subject";
    readonly type: "address";
  }];
  readonly name: "isAuthorized";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "authorized";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint16";
    readonly name: "sequenceId";
    readonly type: "uint16";
  }];
  readonly name: "mintRecord";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint16";
    readonly name: "sequenceId";
    readonly type: "uint16";
  }, {
    readonly internalType: "uint80";
    readonly name: "tokenData";
    readonly type: "uint80";
  }];
  readonly name: "mintRecord";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "name";
  readonly outputs: readonly [{
    readonly internalType: "string";
    readonly name: "value";
    readonly type: "string";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "nodeRegistry";
  readonly outputs: readonly [{
    readonly internalType: "contract INodeRegistry";
    readonly name: "";
    readonly type: "address";
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
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }];
  readonly name: "ownerOf";
  readonly outputs: readonly [{
    readonly internalType: "address";
    readonly name: "owner";
    readonly type: "address";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "salePrice";
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
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "from";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }];
  readonly name: "safeTransferFrom";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "from";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }, {
    readonly internalType: "bytes";
    readonly name: "data";
    readonly type: "bytes";
  }];
  readonly name: "safeTransferFrom";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "sequenceCount";
  readonly outputs: readonly [{
    readonly internalType: "uint16";
    readonly name: "";
    readonly type: "uint16";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "operator";
    readonly type: "address";
  }, {
    readonly internalType: "bool";
    readonly name: "approved";
    readonly type: "bool";
  }];
  readonly name: "setApprovalForAll";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_owner";
    readonly type: "address";
  }];
  readonly name: "setOwner";
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
  readonly inputs: readonly [];
  readonly name: "symbol";
  readonly outputs: readonly [{
    readonly internalType: "string";
    readonly name: "value";
    readonly type: "string";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }];
  readonly name: "tokenMintData";
  readonly outputs: readonly [{
    readonly internalType: "uint80";
    readonly name: "data";
    readonly type: "uint80";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }];
  readonly name: "tokenSequenceId";
  readonly outputs: readonly [{
    readonly internalType: "uint16";
    readonly name: "sequenceId";
    readonly type: "uint16";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "tokenId";
    readonly type: "uint256";
  }];
  readonly name: "tokenURI";
  readonly outputs: readonly [{
    readonly internalType: "string";
    readonly name: "uri";
    readonly type: "string";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [];
  readonly name: "totalSupply";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "from";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "id";
    readonly type: "uint256";
  }];
  readonly name: "transferFrom";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}];
//#endregion
//#region src/utils/abi/token/ERC1155.d.ts
declare const ERC1155_ABI: readonly [{
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_owner";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_operator";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "bool";
    readonly name: "_approved";
    readonly type: "bool";
  }];
  readonly name: "ApprovalForAll";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_operator";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_from";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_to";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256[]";
    readonly name: "_ids";
    readonly type: "uint256[]";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256[]";
    readonly name: "_amounts";
    readonly type: "uint256[]";
  }];
  readonly name: "TransferBatch";
  readonly type: "event";
}, {
  readonly anonymous: false;
  readonly inputs: readonly [{
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_operator";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_from";
    readonly type: "address";
  }, {
    readonly indexed: true;
    readonly internalType: "address";
    readonly name: "_to";
    readonly type: "address";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "_id";
    readonly type: "uint256";
  }, {
    readonly indexed: false;
    readonly internalType: "uint256";
    readonly name: "_amount";
    readonly type: "uint256";
  }];
  readonly name: "TransferSingle";
  readonly type: "event";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_owner";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "_id";
    readonly type: "uint256";
  }];
  readonly name: "balanceOf";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address[]";
    readonly name: "_owners";
    readonly type: "address[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "_ids";
    readonly type: "uint256[]";
  }];
  readonly name: "balanceOfBatch";
  readonly outputs: readonly [{
    readonly internalType: "uint256[]";
    readonly name: "";
    readonly type: "uint256[]";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "_id";
    readonly type: "uint256";
  }];
  readonly name: "getIDBinIndex";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "bin";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "index";
    readonly type: "uint256";
  }];
  readonly stateMutability: "pure";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "_binValues";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "_index";
    readonly type: "uint256";
  }];
  readonly name: "getValueInBin";
  readonly outputs: readonly [{
    readonly internalType: "uint256";
    readonly name: "";
    readonly type: "uint256";
  }];
  readonly stateMutability: "pure";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_owner";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "_operator";
    readonly type: "address";
  }];
  readonly name: "isApprovedForAll";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "isOperator";
    readonly type: "bool";
  }];
  readonly stateMutability: "view";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_from";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "_to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "_ids";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "uint256[]";
    readonly name: "_amounts";
    readonly type: "uint256[]";
  }, {
    readonly internalType: "bytes";
    readonly name: "_data";
    readonly type: "bytes";
  }];
  readonly name: "safeBatchTransferFrom";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_from";
    readonly type: "address";
  }, {
    readonly internalType: "address";
    readonly name: "_to";
    readonly type: "address";
  }, {
    readonly internalType: "uint256";
    readonly name: "_id";
    readonly type: "uint256";
  }, {
    readonly internalType: "uint256";
    readonly name: "_amount";
    readonly type: "uint256";
  }, {
    readonly internalType: "bytes";
    readonly name: "_data";
    readonly type: "bytes";
  }];
  readonly name: "safeTransferFrom";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "address";
    readonly name: "_operator";
    readonly type: "address";
  }, {
    readonly internalType: "bool";
    readonly name: "_approved";
    readonly type: "bool";
  }];
  readonly name: "setApprovalForAll";
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
  readonly type: "function";
}, {
  readonly inputs: readonly [{
    readonly internalType: "bytes4";
    readonly name: "_interfaceID";
    readonly type: "bytes4";
  }];
  readonly name: "supportsInterface";
  readonly outputs: readonly [{
    readonly internalType: "bool";
    readonly name: "";
    readonly type: "bool";
  }];
  readonly stateMutability: "pure";
  readonly type: "function";
}];
//#endregion
//#region src/utils/abi/token/sequence-erc1155-items.d.ts
declare const SEQUENCE_1155_ITEMS_ABI: readonly [{
  readonly type: "constructor";
  readonly inputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
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
  readonly name: "balanceOf";
  readonly inputs: readonly [{
    readonly name: "_owner";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "_id";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "balanceOfBatch";
  readonly inputs: readonly [{
    readonly name: "_owners";
    readonly type: "address[]";
    readonly internalType: "address[]";
  }, {
    readonly name: "_ids";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "baseURI";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "string";
    readonly internalType: "string";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "batchBurn";
  readonly inputs: readonly [{
    readonly name: "tokenIds";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "amounts";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "batchMint";
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
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "burn";
  readonly inputs: readonly [{
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "amount";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "contractURI";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "string";
    readonly internalType: "string";
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
    readonly name: "tokenName";
    readonly type: "string";
    readonly internalType: "string";
  }, {
    readonly name: "tokenBaseURI";
    readonly type: "string";
    readonly internalType: "string";
  }, {
    readonly name: "tokenContractURI";
    readonly type: "string";
    readonly internalType: "string";
  }, {
    readonly name: "royaltyReceiver";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "royaltyFeeNumerator";
    readonly type: "uint96";
    readonly internalType: "uint96";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "isApprovedForAll";
  readonly inputs: readonly [{
    readonly name: "_owner";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "_operator";
    readonly type: "address";
    readonly internalType: "address";
  }];
  readonly outputs: readonly [{
    readonly name: "isOperator";
    readonly type: "bool";
    readonly internalType: "bool";
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
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "amount";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "data";
    readonly type: "bytes";
    readonly internalType: "bytes";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "name";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "string";
    readonly internalType: "string";
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
  readonly name: "royaltyInfo";
  readonly inputs: readonly [{
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "salePrice";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "safeBatchTransferFrom";
  readonly inputs: readonly [{
    readonly name: "_from";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "_to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "_ids";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "_amounts";
    readonly type: "uint256[]";
    readonly internalType: "uint256[]";
  }, {
    readonly name: "_data";
    readonly type: "bytes";
    readonly internalType: "bytes";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "safeTransferFrom";
  readonly inputs: readonly [{
    readonly name: "_from";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "_to";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "_id";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "_amount";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "_data";
    readonly type: "bytes";
    readonly internalType: "bytes";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setApprovalForAll";
  readonly inputs: readonly [{
    readonly name: "_operator";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "_approved";
    readonly type: "bool";
    readonly internalType: "bool";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setBaseMetadataURI";
  readonly inputs: readonly [{
    readonly name: "tokenBaseURI";
    readonly type: "string";
    readonly internalType: "string";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setContractName";
  readonly inputs: readonly [{
    readonly name: "tokenName";
    readonly type: "string";
    readonly internalType: "string";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setContractURI";
  readonly inputs: readonly [{
    readonly name: "tokenContractURI";
    readonly type: "string";
    readonly internalType: "string";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setDefaultRoyalty";
  readonly inputs: readonly [{
    readonly name: "receiver";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "feeNumerator";
    readonly type: "uint96";
    readonly internalType: "uint96";
  }];
  readonly outputs: readonly [];
  readonly stateMutability: "nonpayable";
}, {
  readonly type: "function";
  readonly name: "setTokenRoyalty";
  readonly inputs: readonly [{
    readonly name: "tokenId";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }, {
    readonly name: "receiver";
    readonly type: "address";
    readonly internalType: "address";
  }, {
    readonly name: "feeNumerator";
    readonly type: "uint96";
    readonly internalType: "uint96";
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
  readonly name: "tokenSupply";
  readonly inputs: readonly [{
    readonly name: "";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "totalSupply";
  readonly inputs: readonly [];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "function";
  readonly name: "uri";
  readonly inputs: readonly [{
    readonly name: "_id";
    readonly type: "uint256";
    readonly internalType: "uint256";
  }];
  readonly outputs: readonly [{
    readonly name: "";
    readonly type: "string";
    readonly internalType: "string";
  }];
  readonly stateMutability: "view";
}, {
  readonly type: "event";
  readonly name: "ApprovalForAll";
  readonly inputs: readonly [{
    readonly name: "_owner";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_operator";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_approved";
    readonly type: "bool";
    readonly indexed: false;
    readonly internalType: "bool";
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
  readonly name: "TransferBatch";
  readonly inputs: readonly [{
    readonly name: "_operator";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_from";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_to";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_ids";
    readonly type: "uint256[]";
    readonly indexed: false;
    readonly internalType: "uint256[]";
  }, {
    readonly name: "_amounts";
    readonly type: "uint256[]";
    readonly indexed: false;
    readonly internalType: "uint256[]";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "TransferSingle";
  readonly inputs: readonly [{
    readonly name: "_operator";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_from";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_to";
    readonly type: "address";
    readonly indexed: true;
    readonly internalType: "address";
  }, {
    readonly name: "_id";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }, {
    readonly name: "_amount";
    readonly type: "uint256";
    readonly indexed: false;
    readonly internalType: "uint256";
  }];
  readonly anonymous: false;
}, {
  readonly type: "event";
  readonly name: "URI";
  readonly inputs: readonly [{
    readonly name: "_uri";
    readonly type: "string";
    readonly indexed: false;
    readonly internalType: "string";
  }, {
    readonly name: "_id";
    readonly type: "uint256";
    readonly indexed: true;
    readonly internalType: "uint256";
  }];
  readonly anonymous: false;
}, {
  readonly type: "error";
  readonly name: "InvalidArrayLength";
  readonly inputs: readonly [];
}, {
  readonly type: "error";
  readonly name: "InvalidInitialization";
  readonly inputs: readonly [];
}];
//#endregion
export { ERC20_ABI as i, ERC1155_ABI as n, ERC721_ABI as r, SEQUENCE_1155_ITEMS_ABI as t };
//# sourceMappingURL=index6.d.ts.map