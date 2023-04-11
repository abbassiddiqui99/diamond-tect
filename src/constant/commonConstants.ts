import { MdListAlt, MdLockOutline, MdPayment, MdPersonOutline } from 'react-icons/md';

import { Creator, NftMetadata } from 'src/types';
import { CATEGORY_IMAGES } from 'src/constant/Image';
import { NftHistogramType, Uniqueness } from 'src/types/graphs';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';

export enum CATEGORY {
  'Art' = 'Art',
  'Photography' = 'Photography',
  'Music' = 'Music',
  'Video' = 'Video',
  'Other' = 'Other',
  // '3D Asset' = '3D Asset',
}

export enum TRANSFER_ASSET_STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
}

export const CATEGORY_LIST = [
  { title: CATEGORY.Art, image: CATEGORY_IMAGES.ArtImage },
  { title: CATEGORY.Photography, image: CATEGORY_IMAGES.PhotographyImage },
  { title: CATEGORY.Music, image: CATEGORY_IMAGES.MusicImage },
  { title: CATEGORY.Video, image: CATEGORY_IMAGES.VideoImage },
  // { title: CATEGORY['3D Asset'], image: CATEGORY_IMAGES.ThreeDImage },
  { title: CATEGORY.Other, image: CATEGORY_IMAGES.OtherImage },
];

export const RIGHTS_LIST = [
  'No Rights Definition',
  'Minimal Collectible Rights',
  'Exhibition Rights',
  'Commercial Rights',
  'Reproduction Rights',
  'Modifications Rights',
  'All Rights Assigned',
];

export enum AssignedRights {
  None,
  Minimal,
  Exhibition,
  Commercial,
  Reproduction,
  Modification,
  All,
}

export enum MINT_TYPE {
  'BURN' = 'BURN',
  'MINT' = 'MINT',
  'RE_MINT' = 'RE_MINT',
  'LAZY_MINT' = 'LAZY_MINT',
}

export enum ASSET_TYPE {
  'AUDIO' = 'AUDIO',
  'IMAGE' = 'IMAGE',
  'GIF' = 'GIF',
  'VIDEO' = 'VIDEO',
  'THREE_DIMENSIONAL' = 'THREE_DIMENSIONAL',
}

export enum SOCIAL_MEDIA {
  'FACEBOOK' = 'FACEBOOK',
  'TWITTER' = 'TWITTER',
  'WEBSITE' = 'WEBSITE',
  'LINKEDIN' = 'LINKEDIN',
}

// mb's to byte's conversion
export const UPLOAD_SIZE_LIMIT = 100 * 1024 * 1024; // 100 Mb
export const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 Mb

export const NAVBAR_LINKS = [
  {
    name: 'Profile',
    icon: MdPersonOutline,
    link: PROTECTED_ROUTES.PROFILE,
  },
  {
    name: 'My NFTs',
    icon: MdListAlt,
    link: PROTECTED_ROUTES.LIST_NFT,
  },
  {
    name: 'Protected NFTs',
    icon: MdLockOutline,
    link: PROTECTED_ROUTES.PROTECTED_NFTS,
    isPremium: true,
  },
  {
    name: 'Payment',
    icon: MdPayment,
    link: PROTECTED_ROUTES.UPDATE_PAYMENT,
  },
];

export interface MintFeedType {
  creator?: Creator;
  owner?: Creator;
  hashId?: string;
  contractAddress?: string;
  score?: Uniqueness;
  id: string;
  type: MINT_TYPE;
  ipfsToken: string;
  ipfsMetaData: NftMetadata;
  tokenId: string;
  isProtected?: boolean;
}

export const BAR_COLOR = {
  green: '#16A085',
  yellow: '#d4ac0d',
  red: '#EC7063',
  darkRed: '#C0392B',
};

export const acceptedTypeNames = ['JPG', 'PNG', 'GIF', 'SVG', 'WEBM', 'MP3', 'MP4'];
export const acceptedImgTypes = ['JPG', 'PNG', 'GIF'];

export const NftHistogramRange: NftHistogramType = {
  '80-85': 0,
  '85-90': 0,
  '90-95': 0,
  '95-100': 0,
};

const COMMON_LOADING_TEXT = [
  'Please wait ..',
  'It may take a while ..',
  'Please hold on ..',
  'Wait it will take few seconds ..',
  'Almost there ..',
];
export const LOADING_RIGHTS_ARRAY = ['Editing Rights ..', ...COMMON_LOADING_TEXT, 'Updating the rights ..'];
export const LOADING_TRANSFER_ARRAY = ['Transferring asset ..', ...COMMON_LOADING_TEXT];
export const LOADING_UNIQUENESS_ARRAY = [
  'Checking for uniqueness ..',
  ...COMMON_LOADING_TEXT,
  'We check across the web for similar assets ..',
  'We also look for similar assets on chain ..',
];

export const MINT_STEPS = [
  'Uploading to IPFS',
  'Generating Metadata',
  'Checking for Uniqueness',
  'Waiting for Confirmation',
  'Storing Information',
  'Interacting with Smart Contract',
];

export const GASLESS_MINT_STEPS = [
  'Uploading to IPFS',
  'Generating Metadata',
  'Checking for Uniqueness',
  'Waiting for Confirmation',
  'Storing Information',
];

export const REMINT_STEPS = [
  'Checking for Uniqueness',
  'Waiting for Confirmation',
  'Storing Information',
  'Burning Token',
  'Reminting Token',
];

export const UNIQUENESS_ACCEPTED_TYPES = 'image/jpeg, image/png, video/webm, video/mp4 image/gif';

export const SMALL_IMG_ERROR = 'Image too simple or too small to create unique signature';
export const USER_REJECTED_MINT_ERROR = 'MetaMask Tx Signature: User denied transaction signature.';

export const ALREADY_MINTED_ON_PLATFORM_ERROR = 'The asset is already minted on our platform';

export const NFT_PORT_API_ERROR = "Cannot read properties of undefined (reading 'data')";

export const toastCustomStyle = {
  fontSize: 13,
};

export const INITIAL_FETCH_LIMIT = 15;

export enum BROWSERS {
  'Firefox' = 'Firefox',
  'Samsung' = 'Samsung',
  'Opera' = 'Opera',
  'Explorer' = 'Explorer',
  'Edge' = 'Edge',
  'Chrome' = 'Chrome',
  'Safari' = 'Safari',
  'Unknown' = 'Unknown',
}

export const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export enum ProtectNftType {
  LOSS = 'LOSS',
  POLICING = 'POLICING',
  SUCCESSION = 'SUCCESSION',
}

export enum SUPPORTED_CHAINS {
  ETHERIUM_MAINNET = 'ETHERIUM_MAINNET',
  POLYGON_MAINNET = 'POLYGON_MAINNET',
  RINKEBY_TESTNET = 'RINKEBY_TESTNET',
}
