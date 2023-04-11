export const ROUTES = {
  ALL: '*',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',
  FORGOT_PASSWORD: '/forgot-password',
};

export const PROTECTED_ROUTES = {
  ALL: '*',
  ROOT: '/',
  PAYMENT: '/payment',
  PROFILE: '/profile',
  LOAD_NFT: '/load-nft',
  LIST_NFT: '/list-nft',
  MINT_NFT: '/mint-nft',
  REMINT_NFT: '/remint-nft',
  NOTIFICATION: '/notifications',
  UPDATE_PAYMENT: '/updatePayment',
  LIST_REMINT_NFT: '/list-remintnft',
  STRIPE_PAYMENT: '/stripe-payment',
  TRADITIONAL: '/hd-contract/:mintHash',
  GASLESS: '/gasless/:mintHash',
  PROTECTED_NFTS: '/protected-nfts',
};
