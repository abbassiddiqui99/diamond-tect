import * as React from 'react';
import ReactPlayer from 'react-player';
import classnames from 'classnames/bind';
import ReactAudioPlayer from 'react-audio-player';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import { Asset } from 'src/types';
import DefaultImage from 'src/assets/default-image.jpg';
import { getResolvedAssetUrl } from 'src/services/http/restApi';
import { errorHandler, getUrlContentType } from 'src/utils/helpers';

interface AssetViewerType {
  animation_url?: string;
  image?: string;
  name?: string;
  fixedHeight?: boolean;
  className?: string;
  effect?: 'blur' | 'black-and-white' | 'opacity';
  draggable?: boolean;
}

const AssetViewer: React.FC<AssetViewerType> = ({
  animation_url,
  image,
  name = 'Asset Image',
  fixedHeight = false,
  effect,
  draggable,
  className = '',
}) => {
  const [loading, setLoading] = React.useState(false);
  const [assetUrl, setAssetUrl] = React.useState('');
  const [assetType, setAssetType] = React.useState<Asset>();

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
      const res = await getResolvedAssetUrl(animation_url);
      setAssetUrl(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    }
  };

  React.useEffect(() => {
    if (animation_url) {
      getAssetType(animation_url);
      fetchURL(animation_url);
    }
  }, [animation_url]);

  return (
    <div
      className={classnames(`${className}`, {
        'flex-center flex-col md:px-10 h-[30rem]': fixedHeight,
        'flex-between flex-col gap-4': image,
      })}
    >
      {loading ? <div className='w-full h-full animate-pulse rounded-2xl bg-slate-300' /> : null}
      {/* Image */}
      {!loading && image ? (
        <LazyLoadImage
          alt={name}
          src={image || DefaultImage}
          className={classnames('rounded-2xl', {
            'max-h-full': fixedHeight,
            'w-full': !fixedHeight,
          })}
          effect={effect}
          draggable={draggable}
        />
      ) : null}
      {/* Audio */}
      {!loading && !image && assetType === Asset.AUDIO ? (
        <div className='flex flex-col w-full h-full rounded-2xl'>
          <LazyLoadImage src={DefaultImage} className='mb-3 rounded-2xl' />
          {animation_url ? (
            <ReactAudioPlayer src={assetUrl || animation_url} controls controlsList={!assetUrl ? 'nodownload' : ''} className='w-full' />
          ) : null}
        </div>
      ) : null}
      {!loading && image && assetType === Asset.AUDIO && animation_url ? (
        <ReactAudioPlayer src={assetUrl || animation_url} controls controlsList={!assetUrl ? 'nodownload' : ''} className='w-full' />
      ) : null}
      {/* Video */}
      {!loading && assetType === Asset.VIDEO ? (
        <div className='w-full h-full'>
          <ReactPlayer url={assetUrl} controls={true} width={'100%'} height={'100%'} />
        </div>
      ) : null}
    </div>
  );
};

export default AssetViewer;
