interface NetworkType {
  [key: string]: {
    chainId?: string;
    chainName?: string;
    nativeCurrency?: {
      name?: string;
      symbol?: string;
      decimals?: number;
    };
    rpcUrls?: string[];
    blockExplorerUrls?: string[];
  };
}

export const networks: NetworkType = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
};

export const networkDetails = {
  ethereum: {
    name: 'ethereum',
    chainId: '0x1',
    title: 'Ethereum',
  },
  polygon: {
    name: 'polygon',
    chainId: '0x89',
    title: 'Polygon',
  },
};

interface NetworkNamesType {
  '0x1': 'Ethereum';
  '0x3': 'Ropsten';
  '0x4': 'Rinkeby Test';
  '0x5': 'Kovan';
  '0x89': 'Polygon';
  '0x13881': 'Mumbai';
  '0x56': 'Binance Smart Chain (Mainnet)';
  '0x97': 'Binance Smart Chain (Testnet)';
}

export const networkNames: NetworkNamesType = {
  '0x1': 'Ethereum',
  '0x3': 'Ropsten',
  '0x4': 'Rinkeby Test',
  '0x5': 'Kovan',
  '0x89': 'Polygon',
  '0x13881': 'Mumbai',
  '0x56': 'Binance Smart Chain (Mainnet)',
  '0x97': 'Binance Smart Chain (Testnet)',
};

export const TEST_NETS = ['0x2a', '0x3', '0x4', '0x5', '0x97'];

export type OneNetworkName = keyof NetworkNamesType;

export enum CHAIN_LIST_TYPE {
  'eth' = 'eth',
  '0x1' = '0x1',
  'ropsten' = 'ropsten',
  '0x3' = '0x3',
  'rinkeby' = 'rinkeby',
  '0x4' = '0x4',
  'goerli' = 'goerli',
  '0x5' = '0x5',
  'kovan' = 'kovan',
  '0x2a' = '0x2a',
  'polygon' = 'polygon',
  '0x89' = '0x89',
  'mumbai' = 'mumbai',
  '0x13881' = '0x13881',
  'bsc' = 'bsc',
  '0x38' = '0x38',
  'bsc testnet' = 'bsc testnet',
  '0x61' = '0x61',
  'avalanche' = 'avalanche',
  '0xa86a' = '0xa86a',
  'avalanche testnet' = 'avalanche testnet',
  '0xa869' = '0xa869',
  'fantom' = 'fantom',
  '0xfa' = '0xfa',
}

export enum ETHEREUM_REQUEST_METHODS {
  WALLET_SWITCHETHEREUM_CHAIN = 'wallet_switchEthereumChain',
  WALLET_ADDETHEREUM_CHAIN = 'wallet_addEthereumChain',
  ETH_SIGN_TYPED_DATA = 'eth_signTypedData',
}

export const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';
export const MINT_ADDRESS = '0x0000000000000000000000000000000000000000';
