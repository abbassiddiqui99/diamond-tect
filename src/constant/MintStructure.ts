import { MINT_TYPE, RIGHTS_LIST } from 'src/constant/commonConstants';
import { MintNftType } from 'src/types/mint.type';

export const MintNftContext: MintNftType = {
  name: '',
  error: '',
  fileUrl: '',
  hashUrl: '',
  progress: '',
  loading: false,
  showModal: false,
  description: '',
  rights: RIGHTS_LIST[0],
  mintedType: 'Minted',
  mintType: MINT_TYPE.MINT,
  mintedNftId: '',
  showConfirm: false,
  setName: () => {},
  setFileUrl: () => {},
  setShowModal: () => {},
  setDescription: () => {},
  setCategory: () => {},
  setRights: () => {},
  setSelectedFile: () => {},
  setMintType: () => {},
  mint: async () => {},
  confirmMint: async () => {},
};
