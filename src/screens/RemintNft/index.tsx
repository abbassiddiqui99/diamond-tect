import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import MintNftComponent from 'src/components/NftMint';
import { MINT_TYPE } from 'src/constant/commonConstants';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import useMintNft from 'src/hooks/useMinting';
import { nftTypeDataToRemint } from 'src/providers';

const RemintNft = () => {
  const navigate = useNavigate();
  const nftTypeData = useRecoilValue(nftTypeDataToRemint);

  const { remintSubmitText } = useMintNft();

  React.useEffect(() => {
    if (!nftTypeData) {
      navigate(PROTECTED_ROUTES.LOAD_NFT);
    }
  }, [navigate, nftTypeData]);

  return <MintNftComponent btnText={remintSubmitText} type={MINT_TYPE.RE_MINT} />;
};

export default RemintNft;
