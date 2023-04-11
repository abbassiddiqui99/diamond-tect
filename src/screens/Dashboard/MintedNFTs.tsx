import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import NftView from 'src/components/NftView';
import Skeleton from 'src/components/Skeleton';
import { useGetNFTFeed } from 'src/hooks/useGetNFtFeed';
import { getNFTTypesBasedURL } from 'src/utils/helpers';
import { ReactComponent as EmptyWallet } from 'src/assets/svgs/EmptyWallet.svg';
import { MintFeedType, MINT_TYPE, RIGHTS_LIST, INITIAL_FETCH_LIMIT, AssignedRights } from 'src/constant/commonConstants';

const MintedNFTs = () => {
  const { loading, data, onLoadMore, hasMore, error } = useGetNFTFeed(INITIAL_FETCH_LIMIT, [
    MINT_TYPE.MINT,
    MINT_TYPE.RE_MINT,
    MINT_TYPE.LAZY_MINT,
  ]);
  const list: MintFeedType[] = data?.mintFeed ?? [];

  const items: React.ReactElement[] = [];

  list?.map(item => {
    const right = item?.ipfsMetaData?.rights?.[0] as unknown as AssignedRights;

    items.push(
      <Link
        key={item?.id}
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
          creator={item?.owner || item?.creator}
          fixedHeight
        />
      </Link>,
    );
  });

  return (
    <>
      <div className='container py-10 mx-auto'>
        <div>
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
          <InfiniteScroll pageStart={0} loadMore={onLoadMore} hasMore={hasMore} loader={<Skeleton key={0} type='Dots' />}>
            <div className='grid grid-cols-12 gap-4 mx-auto sm:grid-cols-2 lg:grid-cols-3'>{items}</div>
          </InfiniteScroll>
        </div>
        {error ? <div className='p-20 text-red-500 flex-center'>{error}</div> : null}
      </div>
    </>
  );
};

export default MintedNFTs;
