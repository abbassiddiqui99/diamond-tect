import { CID } from 'ipfs-http-client';
import { Uniqueness } from 'src/types/graphs';
import { ASSET_TYPE, MINT_TYPE, SOCIAL_MEDIA, SUPPORTED_CHAINS } from 'src/constant/commonConstants';

export interface AddResult {
  cid: CID;
  size: number;
  path: string;
  mode?: number;
  mtime?: {
    secs: number;
    nsecs?: number;
  };
}

export interface IToken {
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;
  require2FA?: boolean;
}

export interface SubscriptionPlan {
  name: string;
  price: string;
  currency: string;
  type: string;
}

export interface SocialKYC {
  verified?: boolean;
  signature?: string;
  twitter_handle?: string;
}

export interface IUser {
  isActive?: boolean;
  _id?: string;
  username?: string;
  email?: string;
  name?: string;
  createdAt?: string;
  isEmailVerified?: boolean;
  profileType?: string;
  activePlanId?: string;
  activePlan: SubscriptionPlan;
  upcomingPlan: SubscriptionPlan;
  socialKyc?: SocialKYC;
  avatar?: string;
  walletAddress?: string;
  protectionTimer?: Date | number;
  protectionDays?: number;
  socialMedia?: { type: SOCIAL_MEDIA; link: string }[];
}
export interface DropzoneType {
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string;
  onChange: (files: File[]) => void;
}

export interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface SocialKycData {
  socialKyc: string;
}

export enum PROFILE_TYPE {
  'TWO_FACTOR_AUTH' = 'TWO_FACTOR_AUTH',
  'ACTIVE' = 'ACTIVE',
}
export interface IPlans {
  coinbasePriceId: string;
  currency: string;
  features: {
    feature: FEATURES_TYPE;
    limitType: LIMIT_TYPE;
    amount?: string;
  }[];
  name: string;
  price: number;
  stripePriceId: string;
  type: PLAN_TYPE;
  _id: string;
  description: string;
}

export enum FEATURES_TYPE {
  MINT = 'MINT',
  LAZY_MINT = 'LAZY_MINT',
  REMINT = 'REMINT',
  SAVE_RIGHTS = 'SAVE_RIGHTS',
  EDIT_RIGHTS = 'EDIT_RIGHTS',
  UNIQUENESS_CHECKS = 'UNIQUENESS_CHECKS',
  ON_DEMAND_CHECKS = 'ON_DEMAND_CHECKS',
  POLICING = 'POLICING',
  TRANSFER_ASSET = 'TRANSFER_ASSET',
  PROTECT_NFT = 'PROTECT_NFT',
}

export enum LIMIT_TYPE {
  UNLIMITED = 'UNLIMITED',
  LIMITED = 'LIMITED',
}

export enum PLAN_TYPE {
  MARKET_PLACE = 'MARKET_PLACE',
  PREMIUM = 'PREMIUM',
  FREE = 'FREE',
}

export const FeatureTypeToString = {
  [FEATURES_TYPE.MINT]: 'Mint',
  [FEATURES_TYPE.LAZY_MINT]: 'Gasless Mint',
  [FEATURES_TYPE.REMINT]: 'Remint',
  [FEATURES_TYPE.SAVE_RIGHTS]: 'Save Rights',
  [FEATURES_TYPE.EDIT_RIGHTS]: 'Edit Rights',
  [FEATURES_TYPE.UNIQUENESS_CHECKS]: 'Uniqueness Checks',
  [FEATURES_TYPE.ON_DEMAND_CHECKS]: 'On-Demand Checks',
  [FEATURES_TYPE.POLICING]: 'Assets Policing',
  [FEATURES_TYPE.TRANSFER_ASSET]: 'Transfer Asset',
  [FEATURES_TYPE.PROTECT_NFT]: 'Loss Prevention and Succession Management',
};

export const LimitTypeToString = {
  [LIMIT_TYPE.UNLIMITED]: 'Unlimited',
  [LIMIT_TYPE.LIMITED]: 'Limited',
};

export type tokenHistory = {
  to_address: string;
  token_address: string;
  from_address?: string;
  transaction_hash: string;
  block_timestamp: string;
};

export interface NftMetadata {
  name: string;
  description: string;
  rights?: string[];
  image: string;
  animation_url?: string;
}

export interface NFTType {
  amount: string | number;
  block_number: string | number;
  block_number_minted: string | number;
  contract_type: string;
  frozen: number;
  ipfsToken: string;
  is_valid: number | boolean;
  metadata: NftMetadata;
  name: string;
  owner_of: string;
  symbol: string;
  synced_at: string | Date;
  syncing: number;
  token_address: string;
  token_id: string;
  token_uri: string;
}

export type finalMetadataType = {
  path: string;
  size: number;
  cid: CID;
};

export enum Asset {
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum etherscanFilter {
  ADDRESS = 'address',
  TRANSACTION_HASH = 'tx',
  BLOCK_TOKEN = 'token',
}

export enum NotificationType {
  FOUND_DUPLICATE_NFT = 'FOUND_DUPLICATE_NFT',
  SETUP_LOSS_PREVENTION = 'SETUP_LOSS_PREVENTION',
  SETUP_POLICING = 'SETUP_POLICING',
  SETUP_SUCCESSION = 'SETUP_SUCCESSION',
  SUCCESSION_RECEIVED = 'SUCCESSION_RECEIVED',
  SUCCESSION_TRANSFERRED = 'SUCCESSION_TRANSFERRED',
  SUCCESSION_WARNING = 'SUCCESSION_WARNING',
}

export enum NotificationStatus {
  READ = 'READ',
  SENT = 'SENT',
  RECIEVED = 'RECIEVED',
}

export interface INotification {
  id: string;
  createdAt: number;
  message: string;
  sender?: {
    avatar?: string;
  };
  status: NotificationStatus;
  type: NotificationType;
}

export interface Creator {
  walletAddress?: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export interface NFTDetails {
  assetType: ASSET_TYPE;
  chain: SUPPORTED_CHAINS;
  contractAddress?: string;
  creator?: Creator;
  detailedScore?: Uniqueness;
  frames?: string[];
  hashId: string;
  id: string;
  isProtected: boolean;
  ipfsMetaData: NftMetadata;
  ipfsToken: string;
  owner?: Creator;
  scoreId?: string;
  tokenId: string;
  transactionHash: string;
  type: MINT_TYPE;
}

export interface UserDataType {
  getUser: IUser;
}
