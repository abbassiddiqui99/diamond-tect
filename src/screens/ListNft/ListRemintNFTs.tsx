import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import Loader from 'src/assets/svgs/Loader';
import NftCard from 'src/components/NftCard';
import Skeleton from 'src/components/Skeleton';
import { useGetNFTFeed } from 'src/hooks/useGetNFtFeed';
import { MintFeedType, MINT_TYPE } from 'src/constant/commonConstants';

interface ListType {
  name: string;
  image: string;
}

const fetchLimit = 15;

export const ListRemintNFTs = () => {
  const { loading, data, onLoadMore, hasMore, error } = useGetNFTFeed(fetchLimit, [MINT_TYPE.RE_MINT]);
  const [list, setList] = React.useState<ListType[]>([]);

  React.useEffect(() => {
    if (data?.mintFeed) {
      const values = data.mintFeed.map((item: MintFeedType) => ({
        name: item.ipfsMetaData.name,
        image: item.ipfsMetaData.image,
      }));
      setList(values);
    }
  }, [data]);

  const items: React.ReactElement[] = [];

  list.map(item => {
    items.push(<NftCard key={item.name} name={item.name} image={item.image} />);
  });
  return (
    <div className='container py-10 mx-auto'>
      {loading && !data ? (
        <div className='mt-10 flex-center'>
          <Loader color='white' />
        </div>
      ) : null}
      {!loading && (!data || list?.length === 0) ? <div className='text-center text-gray-600'>No items to show</div> : null}
      <div>
        <InfiniteScroll pageStart={0} loadMore={onLoadMore} hasMore={hasMore} loader={<Skeleton type='Dots' />}>
          <div className='grid grid-cols-12 gap-5 mx-auto sm:grid-cols-3 lg:grid-cols-4'>{items}</div>
        </InfiniteScroll>
      </div>
      {error ? <div className='p-20 text-red-500 flex-center'>{error}</div> : null}
    </div>
  );
};
