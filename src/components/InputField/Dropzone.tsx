import * as React from 'react';
import { BsCloudUpload, BsImage } from 'react-icons/bs';
import ReactAudioPlayer from 'react-audio-player';

import { Asset } from 'src/types';
import Dropzone from 'src/components/Dropzone';
import AssetViewer from 'src/components/AssetViewer';
import { getAssetType, getUrlContentType } from 'src/utils/helpers';
import SelectedFileCard from 'src/screens/MintNft/SelectedFileCard';
import { ACCEPTED_FILE_TYPES } from 'src/constant/DropzoneConstants';
import {
  acceptedImgTypes,
  acceptedTypeNames,
  ASSET_TYPE,
  CATEGORY,
  IMAGE_SIZE_LIMIT,
  UPLOAD_SIZE_LIMIT,
} from 'src/constant/commonConstants';

interface IDropzoneField {
  fileUrl: string;
  category: CATEGORY | undefined;
  selectedFile: File | undefined;
  disabled?: boolean;
  setFileUrl: React.Dispatch<React.SetStateAction<string>>;
  setThumbnail: React.Dispatch<React.SetStateAction<File | undefined>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const DropZoneField: React.FC<IDropzoneField> = ({
  fileUrl,
  category,
  selectedFile,
  disabled,
  setFileUrl,
  setThumbnail,
  setSelectedFile,
}) => {
  const [assetType, setAssetType] = React.useState<Asset>();
  const [thumbnailPreview, setThumbnailPreview] = React.useState('');

  const getAssetTypeFromUrl = async (url: string) => {
    const contentType = (await getUrlContentType(url)) as Asset;
    setAssetType(contentType);
  };

  const newFile = async (fileList: File[]) => {
    setSelectedFile(fileList[0]);
    const assetUrl = URL.createObjectURL(fileList[0]);
    setFileUrl(assetUrl);
    if (getAssetType(fileList[0]) !== ASSET_TYPE.IMAGE) {
      getAssetTypeFromUrl(assetUrl);
    }
  };

  const newThumbnail = (fileList: File[]) => {
    setThumbnail(fileList[0]);
    setThumbnailPreview(URL.createObjectURL(fileList[0]));
  };

  const resetFields = () => {
    setThumbnailPreview('');
    setThumbnail(undefined);
    setAssetType(undefined);
    setSelectedFile(undefined);
  };

  if (selectedFile && assetType !== Asset.AUDIO) {
    return (
      <>
        <AssetViewer
          image={getAssetType(selectedFile) === ASSET_TYPE.IMAGE || getAssetType(selectedFile) === ASSET_TYPE.GIF ? fileUrl : ''}
          animation_url={fileUrl}
          fixedHeight
        />
        <SelectedFileCard file={selectedFile} onClick={resetFields} disabled={disabled} />
      </>
    );
  } else if (selectedFile && assetType === Asset.AUDIO) {
    return (
      <>
        {thumbnailPreview ? (
          <AssetViewer image={thumbnailPreview} fixedHeight />
        ) : (
          <Dropzone
            maxFiles={1}
            maxSize={IMAGE_SIZE_LIMIT}
            onChange={newThumbnail}
            acceptedTypes={ACCEPTED_FILE_TYPES[CATEGORY.Photography]}
          >
            <BsImage size={25} className='mx-auto mb-3' />
            <div className='px-3 text-center'>
              Add a <strong>thumbnail</strong> for your audio asset
              <p className='mt-2'>{acceptedImgTypes.join().replaceAll(',', ', ')} Max. Size 5MB</p>
            </div>
          </Dropzone>
        )}
        <ReactAudioPlayer src={fileUrl} controls controlsList='nodownload' className='w-full mt-3' />
        <SelectedFileCard file={selectedFile} onClick={resetFields} disabled={disabled} />
      </>
    );
  }

  return (
    <Dropzone maxFiles={1} maxSize={UPLOAD_SIZE_LIMIT} onChange={newFile} acceptedTypes={ACCEPTED_FILE_TYPES[category || CATEGORY.Other]}>
      <BsCloudUpload size={25} className='mx-auto mb-3' />
      <div className='px-3 text-center'>
        <strong>Drag</strong> and <strong>Drop</strong> File <br />
        or <strong>browse media on your device</strong>
        <p className='mt-3'>{acceptedTypeNames.join().replaceAll(',', ', ')} Max. Size 100MB</p>
      </div>
    </Dropzone>
  );
};

export default DropZoneField;
