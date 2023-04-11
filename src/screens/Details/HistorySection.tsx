import * as React from 'react';
import classnames from 'classnames/bind';

import configEnv from 'src/config.env';
import Heading from 'src/components/Heading';
import Skeleton from 'src/components/Skeleton';
import UserAvatar from 'src/components/UserAvatar';
import { etherscanFilter } from 'src/types';
import { formatAddress, formatDateTime } from 'src/utils/helpers';
import { TRANSACTION_HISTORY } from 'src/graphql/query';
import { useLazyQuery } from '@apollo/client';

interface HistorySectionType {
  assetId: string;
}

export enum TransactionType {
  TOKEN_MINTED = 'TOKEN_MINTED',
}

interface History {
  asset: string;
  contractAddress: string;
  fromAddress: string;
  id: string;
  toAddress: string;
  transactionHash: string;
  type: TransactionType;
  user: string;
  createdAt: Date;
}
interface ITransactionHistory {
  getTransactionHistory: History[];
}

const HistorySection: React.FC<HistorySectionType> = ({ assetId }) => {
  const [getTransactionHistory, { loading: transactionLoading, data: transactionHistory }] =
    useLazyQuery<ITransactionHistory>(TRANSACTION_HISTORY);

  React.useEffect(() => {
    if (assetId) {
      getTransactionHistory({
        variables: { assetId },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  const transactionText = {
    [TransactionType.TOKEN_MINTED]: 'token minted by',
  };

  const HistoryItem: React.FC<{ historyData: History; index: number }> = ({ historyData, index }) => {
    return (
      <div
        className={classnames('flex gap-4 p-5', {
          'bg-gray-100': index % 2 === 0,
        })}
      >
        <UserAvatar />
        <div>
          <a
            href={`${configEnv.ETHERSCAN_URL}/${etherscanFilter.TRANSACTION_HASH}/${historyData.transactionHash}`}
            className='hover:text-secondary-purple'
            target='_blank'
            rel='noreferrer'
          >
            <strong>{formatAddress(historyData.transactionHash)}</strong>
          </a>
          <span className='px-1'>{transactionText[historyData.type]}</span>
          <a
            href={`${configEnv.ETHERSCAN_URL}/${etherscanFilter.ADDRESS}/${historyData.toAddress}`}
            className='hover:text-secondary-purple'
            target='_blank'
            rel='noreferrer'
          >
            <strong>{formatAddress(historyData.toAddress)}</strong>
          </a>
          <div className='text-sm'>{formatDateTime(historyData.createdAt)}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {transactionHistory?.getTransactionHistory.length ? <Heading type='subheading' text='History' className='mb-5' /> : null}
      {transactionLoading ? (
        <Skeleton type='History' />
      ) : (
        <div>
          {transactionHistory?.getTransactionHistory?.map((item, index) => {
            if (transactionText[item.type]) return <HistoryItem key={item.id} index={index} historyData={item} />;
          })}
        </div>
      )}
    </>
  );
};

export default HistorySection;
