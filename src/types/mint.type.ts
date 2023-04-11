import { Uniqueness } from 'src/types/graphs';
import { finalMetadataType, NftMetadata } from 'src/types';
import { ASSET_TYPE, CATEGORY, MINT_TYPE } from 'src/constant/commonConstants';

export interface Metadata {
  name: string;
  image: string;
  rights?: string;
  description: string;
}

export type RemintInput = {
  assetType?: ASSET_TYPE;
  ipfsMetaData: NftMetadata;
  ipfsToken: string;
  contractAdress: string;
  tokenId: string;
};

export interface MintNftType {
  name: string;
  error: string;
  fileUrl: string;
  hashUrl: string;
  progress: string;
  loading: boolean;
  showModal: boolean;
  description: string;
  category?: CATEGORY;
  rights: string;
  mintedType: string;
  selectedFile?: File;
  mintType: MINT_TYPE.MINT | MINT_TYPE.LAZY_MINT;
  mintedNftId: string;
  uniquenessResponse?: Uniqueness;
  showConfirm: boolean;
  initialMetadata?: NftMetadata;
  finalMetadata?: finalMetadataType;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setFileUrl: React.Dispatch<React.SetStateAction<string>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<CATEGORY | undefined>>;
  setRights: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setMintType: React.Dispatch<React.SetStateAction<MINT_TYPE.MINT | MINT_TYPE.LAZY_MINT>>;
  mint: () => Promise<void>;
  confirmMint: (assetType: ASSET_TYPE, metadata: NftMetadata, finalData: finalMetadataType) => Promise<void>;
}
