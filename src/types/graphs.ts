import { IUser, NFTDetails } from 'src/types';
import { ProtectNftType } from 'src/constant/commonConstants';

export interface TinEyeMatch {
  domain: string;
  score: number;
  backlinks: string[];
  _id: string;
  deleted: boolean;
}
export interface NftPortMatch {
  tokenId: string;
  chain: string;
  contractAddress?: string;
  score: number;
  fileUrl?: string;
  cachedFileUrl?: string;
  mintDate: string | null;
  _id: string;
  deleted?: boolean;
}

export interface Uniqueness {
  id: string;
  avgTinEyeScore: number;
  avgNFTPortScore: number;
  totalNFTPortResults: number;
  totalTinEyeResults: number;
  totalBacklinks: number;
  newlyMintedAssets?: NftPortMatch[];
  tinEyeMatches: TinEyeMatch[];
  nftPortMatches: NftPortMatch[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UniquenessType = [
  string,
  {
    avgScore: number;
    count: number;
    links: string[];
  },
];

export interface IChainTable {
  contractAddress: string;
  score: number;
  chain: string;
  tokenId: string;
  fileUrl: string;
  cachedFileUrl: string;
  mintDate: string;
}

export interface NftHistogramType {
  '80-85': number;
  '85-90': number;
  '90-95': number;
  '95-100': number;
}

export interface IProtectedNft {
  asset: NFTDetails;
  id: string;
  itemId: string;
  owner: IUser;
  ownerAddress: string;
  successorAdress: string;
  timer: number;
  type: ProtectNftType;
}

export interface ProtectNFTInput {
  assetId: string;
  id: string;
  otp: number;
  ownerAddress: string;
  successorAdress: string;
  type: ProtectNftType;
}
