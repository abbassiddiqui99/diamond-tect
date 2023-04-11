import React from 'react';
import { BsShareFill } from 'react-icons/bs';
import PopupModal from '../PopupModal';
import SocialIcons from '../SocialIcons';
import FormInput from '../InputField/FormInput';
import Tooltip from '../Tooltip';
import { BiCopy } from 'react-icons/bi';
import { copyToClipboard } from 'src/utils/helpers';
import Heading from '../Heading';
import AssetViewer from '../AssetViewer';
import { NftMetadata } from 'src/types';

const ShareButton: React.FC<{ ipfsMetaData: NftMetadata }> = ({ ipfsMetaData }) => {
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showLess, setShowLess] = React.useState(true);
  const [tootlipText, setTootlipText] = React.useState('Click to copy');

  return (
    <>
      <div
        onClick={() => setShowShareModal(true)}
        className='px-5 py-4 transition ease-in rounded-lg cursor-pointer hover:bg-slate-300 bg-slate-100'
      >
        <BsShareFill />
      </div>

      <PopupModal show={showShareModal} title='Share to' closeBtn onClose={() => setShowShareModal(false)}>
        <SocialIcons metadata={ipfsMetaData} />
        <div className='items-center w-full gap-4 mt-2 flex-center'>
          <FormInput disabled className='w-72' type='text' value={window.location.href} />

          <Tooltip
            icon={
              <BiCopy
                onClick={() => {
                  copyToClipboard(window.location.href);
                  setTootlipText('Copied!');
                }}
                className='cursor-pointer'
              />
            }
            text={tootlipText}
          />
        </div>

        <div className='grid mt-2'>
          <Heading type='base' className='text-center' text='Preview' />
          <Heading type='subheading' text={ipfsMetaData.name} />

          {ipfsMetaData.description.length < 30 ? (
            <p className='mb-5 text-sm break-all'>{ipfsMetaData?.description}</p>
          ) : (
            <p className='mb-5 text-sm break-all'>
              {showLess ? `${ipfsMetaData.description.slice(0, 30)}...` : ipfsMetaData?.description}
              <a className='ml-2 cursor-pointer text-secondary-blue' onClick={() => setShowLess(!showLess)}>
                View {showLess ? 'More' : 'Less'}
              </a>
            </p>
          )}

          <AssetViewer
            image={ipfsMetaData?.image}
            animation_url={ipfsMetaData?.animation_url}
            effect='blur'
            className='w-56 h-56 place-self-center'
            draggable={false}
          />
        </div>
      </PopupModal>
    </>
  );
};

export default ShareButton;
