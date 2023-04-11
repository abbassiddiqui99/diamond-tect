type arrType = {
  name: string;
  childitems: {
    name: string;
  }[];
}[];

export type IPaymentPlans = {
  description: string;
  payTypes: string[];
  vip?: boolean;
  alpha?: boolean;
  items: arrType;
};

export const paymentPlans: IPaymentPlans[] = [
  {
    description: 'Access dashboards with the best on-chain data and find out what is happening on the blockchain real-time.',
    payTypes: ['Fiat', 'Crypto'],
    items: [
      {
        name: 'Token God Mode',
        childitems: [],
      },
      {
        name: 'NFT Dashboards',
        childitems: [{ name: 'NFT Paradise' }, { name: 'NFT God Mode' }, { name: 'NFT God NFT Wallet Profiler' }],
      },
      {
        name: 'NFT Wallet Profiler',
        childitems: [],
      },
      {
        name: 'Smart Money',
        childitems: [],
      },
      {
        name: 'ETH Tracker',
        childitems: [],
      },
      {
        name: 'Stablecoin Master',
        childitems: [],
      },
      {
        name: 'DEX Trades',
        childitems: [],
      },
      {
        name: '3 Custom Smart Alerts',
        childitems: [],
      },
      {
        name: 'Supported Chains',
        childitems: [{ name: 'Ethereum' }, { name: 'Polygon' }, { name: 'Binance Smart Chain (BSC)*' }, { name: 'Fantom*' }],
      },
    ],
  },
  {
    description: 'Unlock the full power of Nansen dashboards with added customizable features.',
    payTypes: ['Fiat', 'Crypto'],
    vip: true,
    alpha: false,
    items: [
      {
        name: 'Early Access to New Features',
        childitems: [],
      },
      {
        name: 'Hot Contracts',
        childitems: [],
      },
      {
        name: 'Downloadable CSV Data',
        childitems: [],
      },
      {
        name: 'Filters',
        childitems: [],
      },
      {
        name: '100 Custom Smart Alerts',
        childitems: [],
      },
    ],
  },
  {
    description: 'Follow the smart money and be a part of our private community with the smartest and most prominent investors in crypto.',
    payTypes: ['Fiat', 'Crypto'],
    vip: false,
    alpha: true,
    items: [
      {
        name: "Private Discord Community'",
        childitems: [],
      },
      {
        name: 'Exclusive Insights and Reports',
        childitems: [],
      },
      {
        name: 'War Room Calls',
        childitems: [],
      },
      {
        name: 'AMAs and Introductions to Early-Stage Projects',
        childitems: [],
      },
      {
        name: 'Workshops on Special Topics of Interest',
        childitems: [],
      },
    ],
  },
];
