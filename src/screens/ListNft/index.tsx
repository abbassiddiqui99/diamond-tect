import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import NftView from 'src/components/NftView';
import Skeleton from 'src/components/Skeleton';
import { GET_USER_NFT_QUERY } from 'src/graphql/query';
import { getNFTTypesBasedURL } from 'src/utils/helpers';
import { AssignedRights, MintFeedType, RIGHTS_LIST } from 'src/constant/commonConstants';
import { ReactComponent as EmptyWallet } from 'src/assets/svgs/EmptyWallet.svg';

const ListNft = () => {
  const { loading, data } = useQuery<{
    getUser: {
      nfts: MintFeedType[];
    };
  }>(GET_USER_NFT_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const list = data?.getUser?.nfts || [];

  return (
    <div className='container py-10 mx-auto'>
      {loading && !data ? (
        <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Skeleton type='NftView' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
        </div>
      ) : null}

      {!loading && (!data || list?.length === 0) ? (
        <div className='mt-10 flex-center'>
          <EmptyWallet />
        </div>
      ) : null}
      <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {list?.map(item => {
          const right = item.ipfsMetaData?.rights?.[0] as unknown as AssignedRights;
          return (
            <Link
              key={item.ipfsToken}
              to={getNFTTypesBasedURL(item?.type, item?.hashId)}
              className='block col-span-10 col-start-2 transition sm:col-auto hover:-translate-y-1 hover:scale-105'
            >
              <NftView
                name={item.ipfsMetaData.name}
                image={item.ipfsMetaData.image}
                animation_url={item.ipfsMetaData.animation_url}
                type={item.type}
                rights={right ? RIGHTS_LIST[right] : ''}
                score={item.score}
                fixedHeight
                isProtected={item.isProtected}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ListNft;
