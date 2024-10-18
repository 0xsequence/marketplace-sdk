export const ERC721_ABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'AlreadyInitialized', type: 'error' },
  { inputs: [], name: 'InvalidMintRequest', type: 'error' },
  { inputs: [], name: 'InvalidSequenceConfig', type: 'error' },
  { inputs: [], name: 'NotAuthorized', type: 'error' },
  { inputs: [], name: 'SequenceIsSealed', type: 'error' },
  { inputs: [], name: 'SequenceSupplyExhausted', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'topic', type: 'string' },
      {
        indexed: false,
        internalType: 'string',
        name: 'message',
        type: 'string'
      }
    ],
    name: 'Broadcast',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint16',
        name: 'sequenceId',
        type: 'uint16'
      },
      { indexed: false, internalType: 'uint80', name: 'data', type: 'uint80' }
    ],
    name: 'RecordCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'sequenceId',
        type: 'uint16'
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'sealedBeforeTimestamp',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'sealedAfterTimestamp',
            type: 'uint64'
          },
          { internalType: 'uint64', name: 'maxSupply', type: 'uint64' },
          { internalType: 'uint64', name: 'minted', type: 'uint64' },
          { internalType: 'contract IEngine', name: 'engine', type: 'address' },
          { internalType: 'uint64', name: 'dropNodeId', type: 'uint64' }
        ],
        indexed: false,
        internalType: 'struct SequenceData',
        name: 'sequenceData',
        type: 'tuple'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'engineData',
        type: 'bytes'
      }
    ],
    name: 'SequenceConfigured',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [],
    name: 'accessControl',
    outputs: [
      {
        internalType: 'contract INodeRegistry',
        name: 'nodeRegistry',
        type: 'address'
      },
      { internalType: 'uint64', name: 'controlNodeId', type: 'uint64' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'string', name: 'topic', type: 'string' },
      { internalType: 'string', name: 'message', type: 'string' }
    ],
    name: 'broadcast',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'sealedBeforeTimestamp',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'sealedAfterTimestamp',
            type: 'uint64'
          },
          { internalType: 'uint64', name: 'maxSupply', type: 'uint64' },
          { internalType: 'uint64', name: 'minted', type: 'uint64' },
          { internalType: 'contract IEngine', name: 'engine', type: 'address' },
          { internalType: 'uint64', name: 'dropNodeId', type: 'uint64' }
        ],
        internalType: 'struct SequenceData',
        name: '_sequence',
        type: 'tuple'
      },
      { internalType: 'bytes', name: '_engineData', type: 'bytes' }
    ],
    name: 'configureSequence',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'contractURI',
    outputs: [{ internalType: 'string', name: 'value', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'controlNode',
    outputs: [{ internalType: 'uint64', name: 'nodeId', type: 'uint64' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint16', name: 'sequenceId', type: 'uint16' }],
    name: 'getSequenceData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'sealedBeforeTimestamp',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'sealedAfterTimestamp',
            type: 'uint64'
          },
          { internalType: 'uint64', name: 'maxSupply', type: 'uint64' },
          { internalType: 'uint64', name: 'minted', type: 'uint64' },
          { internalType: 'contract IEngine', name: 'engine', type: 'address' },
          { internalType: 'uint64', name: 'dropNodeId', type: 'uint64' }
        ],
        internalType: 'struct SequenceData',
        name: 'sequence',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'getTokenData',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'uint16', name: 'sequenceId', type: 'uint16' },
          { internalType: 'uint80', name: 'data', type: 'uint80' }
        ],
        internalType: 'struct TokenData',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_owner', type: 'address' },
      {
        components: [
          {
            internalType: 'contract INodeRegistry',
            name: 'nodeRegistry',
            type: 'address'
          },
          { internalType: 'uint64', name: 'controlNodeId', type: 'uint64' }
        ],
        internalType: 'struct AccessControlData',
        name: '_accessControl',
        type: 'tuple'
      },
      { internalType: 'string', name: '_metadata', type: 'string' },
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'string', name: 'contractURI', type: 'string' }
        ],
        internalType: 'struct ImmutableCollectionData',
        name: '_data',
        type: 'tuple'
      }
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'subject', type: 'address' }],
    name: 'isAuthorized',
    outputs: [{ internalType: 'bool', name: 'authorized', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint16', name: 'sequenceId', type: 'uint16' }
    ],
    name: 'mintRecord',
    outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint16', name: 'sequenceId', type: 'uint16' },
      { internalType: 'uint80', name: 'tokenData', type: 'uint80' }
    ],
    name: 'mintRecord',
    outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: 'value', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nodeRegistry',
    outputs: [
      { internalType: 'contract INodeRegistry', name: '', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'salePrice', type: 'uint256' }
    ],
    name: 'royaltyInfo',
    outputs: [
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'uint256', name: 'royaltyAmount', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'sequenceCount',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: 'value', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenMintData',
    outputs: [{ internalType: 'uint80', name: 'data', type: 'uint80' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenSequenceId',
    outputs: [{ internalType: 'uint16', name: 'sequenceId', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: 'uri', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const
