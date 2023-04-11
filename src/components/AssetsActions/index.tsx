import { useRecoilValue } from 'recoil';

import { NFTDetails } from 'src/types';
import { authUser } from 'src/providers';
import ProtectNft from 'src/components/ProtectNft';
import { MINT_TYPE } from 'src/constant/commonConstants';
import RegistryButton from 'src/components/AssetsActions/RegistryButton';

type AssetsActionsType = {
  asset: NFTDetails;
  mintHash: string;
};

const AssetsActions: React.FC<AssetsActionsType> = ({ asset, mintHash }) => {
  const auth = useRecoilValue(authUser);
  return (
    <div className='gap-1 flex-center lg:justify-end'>
      {asset.type !== MINT_TYPE.LAZY_MINT ? (
        <>
          <div className='flex rounded-lg bg-slate-100'>
            <RegistryButton mintHash={mintHash} />
          </div>
          {auth ? <ProtectNft asset={asset} isProtected={asset.isProtected} /> : null}
        </>
      ) : null}
    </div>
  );
};

export default AssetsActions;
