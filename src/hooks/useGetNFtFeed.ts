import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { INITIAL_FETCH_LIMIT, MINT_TYPE } from 'src/constant/commonConstants';
import { GET_MINT_FEED } from 'src/graphql/mint.graphql';

export const useGetNFTFeed = (fetchLimit: number, mintType: MINT_TYPE[]) => {
  const { loading, data, error, fetchMore, refetch } = useQuery(GET_MINT_FEED, {
    fetchPolicy: 'network-only',
    variables: {
      mintType,
      limit: INITIAL_FETCH_LIMIT,
      offset: 0,
    },
  });

  const hasMore = useMemo((): boolean => {
    const total = (data && data.mintFeedAggregate?.count) || 0;
    const loaded = data?.mintFeed?.length || 0;
    return total - loaded > 0;
  }, [data]);

  const onLoadMore = () => {
    if (hasMore) {
      fetchMore({
        variables: {
          mintType,
          limit: fetchLimit,
          offset: data?.mintFeed.length,
        },
      });
    }
  };
  return { data, onLoadMore, hasMore, loading, error, refetch };
};
