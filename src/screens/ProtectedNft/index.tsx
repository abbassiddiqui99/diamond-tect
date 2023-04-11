import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { TableColumn } from 'react-data-table-component';

import { IToken } from 'src/types';
import Card from 'src/components/Card';
import { authUser } from 'src/providers';
import Button from 'src/components/Button';
import { showToast } from 'src/utils/Toast';
import Heading from 'src/components/Heading';
import { IProtectedNft } from 'src/types/graphs';
import PopupModal from 'src/components/PopupModal';
import { useAuthActions } from 'src/providers/auth';
import Table from 'src/components/UniquenessGraphs/Table';
import { useProtectedNft } from 'src/hooks/useProtectedNft';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import CountdownTimer from 'src/screens/ProtectedNft/CountdownTimer';
import { MINT_TYPE, ProtectNftType } from 'src/constant/commonConstants';
import { errorHandler, formatAddress, getNFTTypesBasedURL } from 'src/utils/helpers';

const ProtectedNft: React.FC = () => {
  const navigate = useNavigate();
  const authActions = useAuthActions();
  const { user } = useRecoilValue(authUser) as IToken;

  const [assetId, setAssetId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showConfirmClaim, setShowConfirmClaim] = React.useState(false);
  const [protectionTimer, setProtectionTimer] = React.useState(user?.protectionTimer || 0);

  const { data, loading, error, triggetLossPrevention, refetch, resetProtectionTimer } = useProtectedNft();
  const protectedNfts = data?.getProtectedNfts;

  React.useEffect(() => {
    if (authActions.isUserOnFreePlan) {
      navigate(PROTECTED_ROUTES.ROOT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const claimAsset = async () => {
    try {
      setIsLoading(true);
      showToast({ message: 'Claiming asset may take a while', type: 'info' });
      await triggetLossPrevention({
        variables: {
          protectedNftId: assetId,
        },
      });
      showToast({ message: 'Asset claimed successfully ', type: 'success' });
      await refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
      setShowConfirmClaim(false);
    }
  };

  const closeModal = () => {
    setAssetId('');
    setShowConfirmClaim(false);
  };

  const chainTableColumns: TableColumn<IProtectedNft>[] = [
    {
      name: 'Chain',
      sortable: true,
      width: '200px',
      selector: row => row.asset.chain,
    },
    {
      name: 'ID',
      sortable: true,
      width: '100px',
      selector: row => row.asset.tokenId,
    },
    {
      name: 'Contract Address',
      sortable: true,
      selector: row => row.asset.contractAddress || '',
      cell: row => (
        <>
          {row.asset.contractAddress ? (
            <a
              href={`https://etherscan.io/address/${row.asset.contractAddress}`}
              target='_blank'
              rel='noreferrer'
              className='text-blue-500 hover:underline'
            >
              {formatAddress(row.asset.contractAddress)}
            </a>
          ) : null}
        </>
      ),
    },
    {
      name: 'Successor Address',
      sortable: true,
      selector: row => row.successorAdress || '',
      cell: row => (
        <>
          {row.successorAdress ? (
            <a
              href={`https://etherscan.io/address/${row.successorAdress}`}
              target='_blank'
              rel='noreferrer'
              className='text-blue-500 hover:underline'
            >
              {formatAddress(row.successorAdress)}
            </a>
          ) : null}
        </>
      ),
    },
    {
      name: 'Type',
      sortable: true,
      selector: row => row.type,
    },
    {
      cell: row => (
        <>
          {row.type === ProtectNftType.LOSS ? (
            <Button
              btnText='Claim'
              textSize='sm'
              className='w-32 rounded-lg'
              disabled={!row.itemId}
              onClick={() => {
                setAssetId(row.id);
                setShowConfirmClaim(true);
              }}
            />
          ) : null}
        </>
      ),
    },
    {
      cell: row => (
        <Link to={getNFTTypesBasedURL(MINT_TYPE.MINT, row.asset.hashId)} target='_blank'>
          <Button btnText='View Asset' textSize='sm' className='w-32 rounded-lg' />
        </Link>
      ),
    },
  ];

  const resetTimer = async () => {
    try {
      setIsLoading(true);
      const val = await resetProtectionTimer();
      setProtectionTimer(val.data.resetProtectionTimer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto mt-10'>
      <Card>
        <Heading type='heading' text='Protected NFTs' />

        {protectionTimer ? (
          <div className='my-10 flex-between'>
            <CountdownTimer time={protectionTimer} />
            <Button btnText='Reset' className='rounded-lg' onClick={resetTimer} disabled={isLoading} loading={isLoading} />
          </div>
        ) : null}

        <Table
          columns={chainTableColumns}
          gridData={protectedNfts || []}
          paginationTotalRows={data?.getProtectedNftsAggregate.total}
          progressPending={loading}
        />
      </Card>
      {error ? <div className='text-sm text-center text-red-500'>{error}</div> : null}
      <PopupModal
        show={showConfirmClaim}
        onClose={closeModal}
        title='Claim Asset'
        text='Are you sure you want to claim this Asset?'
        closeBtn={!isLoading}
        persistent={loading}
      >
        <div className='flex gap-4'>
          <Button btnText='Confirm' gradient full onClick={claimAsset} loading={isLoading} disabled={isLoading} />
          <Button btnText='Cancel' full onClick={closeModal} disabled={isLoading} />
        </div>
      </PopupModal>
    </div>
  );
};

export default ProtectedNft;
