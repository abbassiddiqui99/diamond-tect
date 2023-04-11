import * as React from 'react';
import { BiCopy } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';

import configEnv from 'src/config.env';
import Button from 'src/components/Button';
import { etherscanFilter, NFTDetails } from 'src/types';
import Heading from 'src/components/Heading';
import Tooltip from 'src/components/Tooltip';
import PopupModal from 'src/components/PopupModal';
import { copyToClipboard } from 'src/utils/helpers';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';

interface TransferConfirmModalType {
  id: string;
  show: boolean;
  hashUrl: string;
  onClose: () => void;
  refetch: (variables?: Partial<OperationVariables>) => Promise<
    ApolloQueryResult<{
      getMint: NFTDetails;
    }>
  >;
}

const TransferConfirmModal: React.FC<TransferConfirmModalType> = ({ id, show, hashUrl, onClose, refetch }) => {
  const [copied, setCopied] = React.useState(false);
  const navigate = useNavigate();

  return (
    <PopupModal show={show} title='Transfer NFT' persistent onClose={onClose}>
      <div className='flex flex-col items-center mt-10'>
        <BsFillCheckCircleFill size={100} className='mb-5 fill-secondary-purple' />
        <Heading text='Asset has been transfered' type='heading' />
        {hashUrl ? (
          <div className='flex-col w-full flex-center'>
            <div className='gap-2 flex-center'>
              <div className='w-1/4 overflow-hidden text-ellipsis'>{hashUrl}</div>
              <a href={`${configEnv.ETHERSCAN_URL}/${etherscanFilter.TRANSACTION_HASH}/${hashUrl}`} target='_blank' rel='noreferrer'>
                <FiExternalLink size={24} />
              </a>
              <div>
                <Tooltip
                  icon={
                    <BiCopy
                      onClick={() => {
                        copyToClipboard(`${configEnv.ETHERSCAN_URL}/${etherscanFilter.TRANSACTION_HASH}/${hashUrl}`);
                        setCopied(true);
                      }}
                      className='cursor-pointer'
                    />
                  }
                  text={copied ? 'Copied' : 'Copy to Clipboard.'}
                />
              </div>
            </div>
          </div>
        ) : null}
        <Button
          btnText={id ? 'Okay' : 'Back To Home'}
          bold
          className='w-40'
          onClick={() => {
            if (!id) {
              navigate(PROTECTED_ROUTES.ROOT);
            } else {
              onClose();
              refetch();
            }
          }}
        />
      </div>
    </PopupModal>
  );
};

export default TransferConfirmModal;
