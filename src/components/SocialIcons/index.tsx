import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import { NftMetadata } from 'src/types';

const SocialIcons: React.FC<{ metadata: NftMetadata }> = ({ metadata }) => {
  return (
    <>
      <div className='gap-8 mt-5 flex-center'>
        <div className='flex items-center gap-2'>
          <FacebookShareButton url={window.location.href} quote={metadata?.description} tabIndex={-1} className='flex items-center'>
            <FacebookIcon className='mr-2' size={32} round />
            Facebook
          </FacebookShareButton>
        </div>

        <div className='flex items-center gap-2'>
          <TwitterShareButton title={`${metadata?.name}\n`} url={window.location.href} className='flex items-center' tabIndex={-1}>
            <TwitterIcon className='mr-2' size={32} round />
            Twitter
          </TwitterShareButton>
        </div>
      </div>
    </>
  );
};

export default SocialIcons;
