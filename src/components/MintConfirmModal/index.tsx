import * as React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { BiCheck, BiCopy } from 'react-icons/bi';
import { BsFillCheckCircleFill } from 'react-icons/bs';

import configEnv from 'src/config.env';
import Button from 'src/components/Button';
import { etherscanFilter } from 'src/types';
import Heading from 'src/components/Heading';
import Tooltip from 'src/components/Tooltip';
import PopupModal from 'src/components/PopupModal';
import { MINT_TYPE } from 'src/constant/commonConstants';
import { copyToClipboard, getNFTTypesBasedURL } from 'src/utils/helpers';

interface MintConfirmModalType {
  show: boolean;
  hashUrl: string;
  type: MINT_TYPE;
  onClose: () => void;
  mintedHashId: string;
}

const MintConfirmModal: React.FC<MintConfirmModalType> = ({ mintedHashId, show, type, hashUrl, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const { title, subTitle } = React.useMemo(
    () => ({
      title: type === MINT_TYPE.MINT ? 'Minted NFT' : type === MINT_TYPE.RE_MINT ? 'Reminted NFT' : 'Gasless Minted NFT',
      subTitle:
        type === MINT_TYPE.MINT
          ? 'Asset has been minted'
          : type === MINT_TYPE.RE_MINT
          ? 'Asset has been reminted'
          : 'Asset has been minted',
    }),
    [type],
  );

  return (
    <PopupModal show={show} title={title} closeBtn persistent onClose={onClose}>
      <div className='flex flex-col items-center mt-10'>
        <BsFillCheckCircleFill size={100} className='mb-5 fill-secondary-purple' />
        <Heading text={subTitle} type='heading' />
        {hashUrl ? (
          <div className='flex-col w-full flex-center'>
            <div className='gap-2 flex-center'>
              <div className='w-1/4 overflow-hidden text-ellipsis'>{hashUrl}</div>
              <a href={`${configEnv.ETHERSCAN_URL}/${etherscanFilter.TRANSACTION_HASH}/${hashUrl}`} target='_blank' rel='noreferrer'>
                <FiExternalLink size={24} />
              </a>
              <div
                className='cursor-pointer'
                onClick={() => {
                  copyToClipboard(`${configEnv.ETHERSCAN_URL}/${etherscanFilter.TRANSACTION_HASH}/${hashUrl}`);
                  setCopied(!copied);
                }}
              >
                {copied ? <Tooltip icon={<BiCheck size={24} />} text='Copied to Clipboard.' /> : <BiCopy size={24} />}
              </div>
            </div>
          </div>
        ) : null}
        <Link to={getNFTTypesBasedURL(type, mintedHashId)}>
          <Button btnText={mintedHashId ? 'View NFT' : 'Back To Home'} bold className='w-40' />
        </Link>
      </div>
    </PopupModal>
  );
};

export default MintConfirmModal;
