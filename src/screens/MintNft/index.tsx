import { useRecoilValue } from 'recoil';

import { walletNetwork } from 'src/providers';
import { MINT_TYPE } from 'src/constant/commonConstants';
import useMintNft from 'src/hooks/useMinting';
import MintNftComponent from 'src/components/NftMint';

const MintNft: React.FC = () => {
  const network = useRecoilValue(walletNetwork);
  const { mintType, showConfirm, initialMetadata, finalMetadata } = useMintNft();

  const showBtnText = () => {
    if (showConfirm && initialMetadata && finalMetadata) return 'Confirm Mint';

    if (mintType && !showConfirm) {
      if (!network) return 'Connect Wallet';
      if (mintType === MINT_TYPE.MINT) return 'Mint NFT';
      return 'Gasless Mint NFT';
    }
    return '';
  };

  return <MintNftComponent btnText={showBtnText()} />;
};

export default MintNft;
