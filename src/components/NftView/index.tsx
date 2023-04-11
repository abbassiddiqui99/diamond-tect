import * as React from 'react';
import ReactPlayer from 'react-player';
import classnames from 'classnames/bind';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { AiFillLock, AiFillSound, AiFillVideoCamera } from 'react-icons/ai';

import Badge from 'src/components/Badge';
import { Asset, Creator } from 'src/types';
import UserAvatar from 'src/components/UserAvatar';
import DefaultImage from 'src/assets/default-image.jpg';
import { MINT_TYPE } from 'src/constant/commonConstants';
import { getResolvedAssetUrl } from 'src/services/http/restApi';
import { errorHandler, getUrlContentType } from 'src/utils/helpers';
import { ReactComponent as EthereumLogo } from 'src/assets/svgs/ethereum-eth-logo.svg';

interface IScore {
  avgNFTPortScore: number;
  avgTinEyeScore: number;
  totalNFTPortResults: number;
  totalTinEyeResults: number;
}
interface NftViewType {
  name: string;
  image: string;
  animation_url?: string;
  type?: MINT_TYPE;
  rights?: string;
  fixedHeight?: boolean;
  score?: IScore;
  creator?: Creator;
  isProtected?: boolean;
}

const NftView: React.FC<NftViewType> = ({
  name = '',
  image,
  animation_url,
  type,
  rights,
  fixedHeight = false,
  score,
  creator,
  isProtected,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [assetType, setAssetType] = React.useState<Asset>();
  const [assetUrl, setAssetUrl] = React.useState('');

  const getAssetType = async (asset: string) => {
    try {
      setLoading(true);
      const contentType = (await getUrlContentType(asset)) as Asset;
      setAssetType(contentType);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchURL = async (animation_url: string) => {
    try {
      setLoading(true);
      const res = await getResolvedAssetUrl(animation_url);
      setAssetUrl(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (animation_url) {
      getAssetType(animation_url);
      fetchURL(animation_url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AssetIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
    <div className='absolute w-8 h-8 text-white rounded-full primary-gradient top-2 right-2'>{icon}</div>
  );

  return (
    <div className='overflow-hidden transition-all bg-white border-2 rounded-lg hover:shadow-lg border-slate-300'>
      <div className='bg-gray-100 h-72'>
        {image ? (
          <div className='relative w-full h-full'>
            <LazyLoadImage src={image || DefaultImage} alt={name} className='object-cover w-full h-full' draggable={false} />
            {assetType === Asset.AUDIO ? <AssetIcon icon={<AiFillSound className='absolute top-2 right-2' size={16} />} /> : null}
          </div>
        ) : null}
        {!image && loading ? <div className='h-full animate-pulse bg-slate-300 flex-center text-slate-700'></div> : null}
        {!image && !loading ? (
          <div className='h-full'>
            {assetType === Asset.AUDIO ? (
              <div className='relative w-full h-full'>
                <LazyLoadImage alt={name} src={DefaultImage} className='block object-cover w-full h-full' />
                <AssetIcon icon={<AiFillSound className='absolute top-2 right-2' size={16} />} />
              </div>
            ) : (
              <div className='relative w-full h-full'>
                <div className='flex w-full h-full'>
                  <ReactPlayer url={assetUrl} height='100%' />
                </div>
                <AssetIcon icon={<AiFillVideoCamera className='absolute top-2 right-2' size={16} />} />
              </div>
            )}
          </div>
        ) : null}
      </div>
      <div
        className={classnames('flex flex-col justify-between p-4 border-t-2 border-slate-300', {
          'h-56': fixedHeight,
        })}
      >
        {creator ? (
          <div className='w-full gap-4 mb-5 flex-between'>
            <div className='flex items-center w-3/4 gap-2'>
              <UserAvatar source={creator?.avatar} />
              <span className='font-semibold truncate'>{creator?.name}</span>
            </div>
            <div>
              <EthereumLogo width={20} height={20} />
            </div>
          </div>
        ) : null}

        <div className='flex-between'>
          <div className='w-4/5 text-lg font-semibold truncate'>{name}</div>
          {isProtected ? (
            <div className='w-8 h-8 text-white rounded-lg flex-center primary-gradient'>
              <AiFillLock />
            </div>
          ) : null}
        </div>
        <div className='flex items-end justify-between gap-4'>
          <div className='text-sm'>
            {score ? (
              <>
                <strong className='text-sm'>Similarity</strong>
                <div>
                  <strong>{score.avgTinEyeScore ?? 0}%</strong> | <strong>{score.totalTinEyeResults ?? 0}</strong>
                </div>
                <div>
                  <strong>{score.avgNFTPortScore ?? 0}%</strong> | <strong>{score.totalNFTPortResults ?? 0}</strong>
                </div>
              </>
            ) : null}
            {rights ? <div className='mt-3'>{rights}</div> : null}
          </div>
          {type === MINT_TYPE.LAZY_MINT ? <Badge text='Gasless' className='whitespace-nowrap' /> : null}
          {type === MINT_TYPE.RE_MINT ? <Badge text='Remint' className='whitespace-nowrap' /> : null}
        </div>
      </div>
    </div>
  );
};

export default NftView;
