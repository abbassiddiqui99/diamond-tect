import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import NftView from 'src/components/NftView';
import Skeleton from 'src/components/Skeleton';

import { MINT_TYPE } from 'src/constant/commonConstants';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';

import { nftTypeDataToRemint, walletAddress, walletChain } from 'src/providers';
import { NFTType } from 'src/types';
import { GET_WALLET_NFT } from 'src/graphql/query';
import { useQuery } from '@apollo/client';
import { useAuthActions } from 'src/providers/auth';

const LoadNft: React.FC = () => {
  const navigate = useNavigate();
  const chain = useRecoilValue(walletChain);
  const setNftTypeData = useSetRecoilState(nftTypeDataToRemint);
  const address = useRecoilValue(walletAddress);
  const authActions = useAuthActions();

  React.useEffect(() => {
    if (authActions.isUserOnFreePlan) {
      navigate(PROTECTED_ROUTES.ROOT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, data } = useQuery(GET_WALLET_NFT, {
    variables: {
      chain: chain,
      walletAddress: address,
    },
    // fetchPolicy: 'cache-and-network',
  });

  const nft: NFTType[] = data?.getWalletNFTs ?? [];

  const handleClickonNftCard = (item: NFTType) => {
    setNftTypeData(item);
    navigate(PROTECTED_ROUTES.REMINT_NFT);
  };
  return (
    <div className='container mx-auto mt-5'>
      <div className='flex-center'>{!address || !chain ? <p>Please Connect Wallet</p> : null}</div>
      {loading ? (
        <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Skeleton type='NftView' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
        </div>
      ) : null}
      {!loading && nft?.length > 0 ? (
        <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {nft?.map(item => (
            <div
              key={item.ipfsToken}
              onClick={() => handleClickonNftCard(item)}
              className='block col-span-10 col-start-2 transition cursor-pointer sm:col-auto hover:-translate-y-1 hover:scale-105'
            >
              <NftView
                name={item.metadata.name}
                image={item.metadata.image}
                animation_url={item.metadata?.animation_url}
                type={MINT_TYPE.MINT}
                rights={item.metadata?.rights?.[0]}
              />
            </div>
          ))}
        </div>
      ) : null}

      {address && !loading && (!data || nft?.length === 0) ? <div className='text-center text-gray-600'>No items to show</div> : null}
    </div>
  );
};

export default LoadNft;
