import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { IProtectedNft } from 'src/types/graphs';
import { GET_PROTECTED_NFTS } from 'src/graphql/query';
import { INITIAL_FETCH_LIMIT } from 'src/constant/commonConstants';
import {
  PROTECT_NFT,
  REQUEST_PROTECT_NFT,
  RESET_PROTECTION_TIMER,
  TRIGGER_LOSS_PREVENTION,
  UPDATE_PROTECTION_TIMER,
} from 'src/graphql/mutation';

interface IGetProtectedNfts {
  getProtectedNfts: IProtectedNft[];
  getProtectedNftsAggregate: {
    total: number;
  };
}

export const useProtectedNft = () => {
  const { loading, data, error, fetchMore, refetch } = useQuery<IGetProtectedNfts>(GET_PROTECTED_NFTS, {
    fetchPolicy: 'network-only',
    variables: {},
  });

  const hasMore = useMemo((): boolean => {
    const total = data?.getProtectedNftsAggregate?.total || 0;
    const loaded = data?.getProtectedNfts?.length || 0;
    return total - loaded > 0;
  }, [data]);

  const onLoadMore = () => {
    if (hasMore) {
      fetchMore({
        variables: {
          offset: data?.getProtectedNfts?.length,
          limit: INITIAL_FETCH_LIMIT,
        },
      });
    }
  };

  const [protectNft] = useMutation(PROTECT_NFT);
  const [requestProtectNFT, { loading: loadingProtectNFT }] = useMutation(REQUEST_PROTECT_NFT);
  const [resetProtectionTimer] = useMutation(RESET_PROTECTION_TIMER);
  const [triggetLossPrevention] = useMutation(TRIGGER_LOSS_PREVENTION);
  const [updateProtectionTimer] = useMutation(UPDATE_PROTECTION_TIMER);

  return {
    data,
    loading,
    loadingProtectNFT,
    error,
    hasMore,
    onLoadMore,
    protectNft,
    refetch,
    requestProtectNFT,
    resetProtectionTimer,
    triggetLossPrevention,
    updateProtectionTimer,
  };
};
