import * as React from 'react';
import classnames from 'classnames/bind';
import { useRecoilState, useRecoilValue } from 'recoil';

import Card from 'src/components/Card';
import Button from 'src/components/Button';
import Select from 'src/components/Select';
import Heading from 'src/components/Heading';
import useMintNft from 'src/hooks/useMinting';
import Graphs from 'src/screens/MintNft/Graphs';
import { usePrompt } from 'src/hooks/useBlockPromt';
import Checkbox from 'src/screens/MintNft/Checkbox';
import AssetViewer from 'src/components/AssetViewer';
import LoadingText from 'src/components/LoadingText';
import StepsProgress from 'src/components/StepsProgress';
import CategoryCard from 'src/screens/MintNft/CategoryCard';
import FormInput from 'src/components/InputField/FormInput';
import MintConfirmModal from 'src/components/MintConfirmModal';
import DropZoneField from 'src/components/InputField/Dropzone';
import FormTextarea from 'src/components/InputField/FormTextarea';
import { Asset, finalMetadataType, NftMetadata } from 'src/types';
import { nftTypeDataToRemint, walletNetwork } from 'src/providers';
import { errorHandler, getUrlContentType } from 'src/utils/helpers';

import {
  MINT_STEPS,
  MINT_TYPE,
  ASSET_TYPE,
  RIGHTS_LIST,
  REMINT_STEPS,
  CATEGORY_LIST,
  GASLESS_MINT_STEPS,
  LOADING_UNIQUENESS_ARRAY,
  ALREADY_MINTED_ON_PLATFORM_ERROR,
} from 'src/constant/commonConstants';
interface IMintNftComponent {
  btnText: string;
  type?: MINT_TYPE;
}

const showTitle = (mintType: MINT_TYPE) => {
  switch (mintType) {
    case MINT_TYPE.MINT:
      return 'Create a single NFT';
    case MINT_TYPE.RE_MINT:
      return 'Remint NFT';
    default:
      return 'Gasless Mint an NFT';
  }
};

const MintNftComponent: React.FC<IMintNftComponent> = ({ btnText, type }) => {
  const network = useRecoilValue(walletNetwork);
  const [nftTypeData, setNftTypeData] = useRecoilState(nftTypeDataToRemint);

  const {
    mintedHashId,
    mintedType,
    name,
    error,
    hashUrl,
    fileUrl,
    progress,
    loading,
    showModal,
    description,
    category,
    rights,
    selectedFile,
    mintType,
    uniquenessResponse,
    showConfirm,
    initialMetadata,
    finalMetadata,
    mint,
    setName,
    setFileUrl,
    setShowModal,
    setDescription,
    setSelectedFile,
    setCategory,
    setRights,
    setMintType,
    handleRemint,
    confirmMint,
    setThumbnail,
    setLoading,
  } = useMintNft();

  const remint = type === MINT_TYPE.RE_MINT;
  const [nameError, setNameError] = React.useState('');
  const [categoryForRemint, setCategoryForRemint] = React.useState('');

  const isFormValid = () => {
    if (mintType === MINT_TYPE.MINT || mintType === MINT_TYPE.LAZY_MINT) {
      return selectedFile && name?.length && name.length <= 100 && category;
    }
    if (mintType === MINT_TYPE.RE_MINT) {
      return name && category;
    }
    return true;
  };

  const isFieldDisabled = loading || showConfirm;
  const isBtnDisabled = !isFormValid() || loading || !network || !category;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateData = () => {
    if (nftTypeData?.metadata) {
      setDescription(nftTypeData.metadata.description);
      setName(nftTypeData.metadata.name);
      setMintType(MINT_TYPE.RE_MINT);

      if (nftTypeData.metadata.rights && RIGHTS_LIST.includes(nftTypeData.metadata.rights?.[0])) {
        setRights(nftTypeData?.metadata?.rights?.[0]);
      }
    }
  };

  const handleSubmit = () => {
    if (remint) return handleRemint();
    if (showConfirm && initialMetadata && finalMetadata)
      confirmMint(ASSET_TYPE.IMAGE, initialMetadata as NftMetadata, finalMetadata as finalMetadataType);
    else if (mintType && !showConfirm) mint();
  };

  const closePrompt = (e: BeforeUnloadEvent) => {
    if (isFieldDisabled) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  React.useEffect(() => {
    const getCategory = async () => {
      try {
        setLoading(true);
        if (nftTypeData?.metadata.animation_url || nftTypeData?.metadata.image) {
          const mintedFileType = (await getUrlContentType(nftTypeData?.metadata.animation_url || nftTypeData?.metadata.image)) as Asset;
          setCategoryForRemint(mintedFileType);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        errorHandler(err);
      } finally {
        setLoading(false);
      }
    };

    if (remint) {
      updateData();
      getCategory();
    }

    // Add listener if user tries to refresh/close tab while minting
    window.addEventListener('beforeunload', closePrompt);

    // remove listener on unmount
    return () => {
      setNftTypeData(null);
      window.removeEventListener('beforeunload', closePrompt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePrompt('Changes that you made may not be saved.', isFieldDisabled);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-12 md:grid-cols-7 lg:grid-cols-10'>
      <div className='mt-10 mb-40 sm:col-span-10 sm:col-start-2 md:col-span-5 md:col-start-2 lg:col-span-6 lg:col-start-3'>
        <Card heading={showTitle(mintType)} className='rounded-none sm:rounded-2xl'>
          {remint ? (
            <div className='mt-5 text-base font-semibold'>{name}</div>
          ) : (
            <Heading type='base' text='Upload Asset' className='mt-10' />
          )}

          {remint ? (
            <AssetViewer
              image={nftTypeData?.metadata.image}
              animation_url={nftTypeData?.metadata.animation_url}
              draggable={false}
              fixedHeight
            />
          ) : (
            <DropZoneField
              fileUrl={fileUrl}
              category={category}
              selectedFile={selectedFile}
              setFileUrl={setFileUrl}
              setSelectedFile={setSelectedFile}
              setThumbnail={setThumbnail}
              disabled={isFieldDisabled}
            />
          )}
          {remint ? null : <Checkbox type={mintType} setType={setMintType} disabled={isFieldDisabled} />}
          {remint ? null : (
            <>
              <Heading type='base' text='Name Item *' className='mt-6' />
              <FormInput
                type='text'
                placeholder='e. g “Your item name will place here”'
                onChange={e => {
                  setName(e.target.value);
                  if (e.target.value.length > 100) {
                    setNameError('Name of the asset must not exceed 100 characters');
                  } else if (nameError) {
                    setNameError('');
                  }
                }}
                disabled={isFieldDisabled}
                value={name}
                error={nameError}
              />
            </>
          )}

          <Heading type='base' text='Description' className='mt-6' />
          <FormTextarea
            placeholder='Your asset description'
            onChange={e => setDescription(e.target.value)}
            disabled={isFieldDisabled || remint}
            value={description}
          />

          <Heading type='base' text='Select Category *' className='mt-6' />
          {CATEGORY_LIST && CATEGORY_LIST.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
              {CATEGORY_LIST.map(item => (
                <CategoryCard
                  key={item.title}
                  title={item.title}
                  active={category === item.title}
                  src={item.image}
                  onClick={() => (!loading && !showConfirm ? setCategory(item.title) : undefined)}
                  selectedFileType={selectedFile?.type || categoryForRemint}
                />
              ))}
            </div>
          ) : null}

          <Heading type='base' text='Select Right' className='mt-10 ' />
          <Select options={RIGHTS_LIST} value={RIGHTS_LIST[rights]} onChange={setRights} disabled={isFieldDisabled} />

          {uniquenessResponse ? <Graphs data={uniquenessResponse} /> : null}

          <div
            className={classnames('flex items-center mt-5', {
              'justify-between': network && !remint,
              'justify-end': !network || remint,
            })}
          >
            {network && !remint && mintType === MINT_TYPE.MINT ? (
              <div className='mr-5'>This asset will be deployed on the {network} network.</div>
            ) : null}
            {mintType === MINT_TYPE.LAZY_MINT ? <div className='mr-5'>This asset will be deployed on Heera Digital Platform.</div> : null}

            {/* hard coded image minted only for testing purpose */}
            {error ? null : (
              <Button
                bold
                gradient
                loading={loading}
                disabled={isBtnDisabled}
                btnText={btnText}
                onClick={handleSubmit}
                className='w-40 whitespace-nowrap'
              />
            )}
          </div>
          {progress > -1 ? (
            <>
              <StepsProgress
                steps={mintType === MINT_TYPE.MINT ? MINT_STEPS : mintType === MINT_TYPE.RE_MINT ? REMINT_STEPS : GASLESS_MINT_STEPS}
                index={progress}
              />
              {progress === 2 ? <LoadingText textArray={LOADING_UNIQUENESS_ARRAY} /> : null}
            </>
          ) : null}
          {error && error !== ALREADY_MINTED_ON_PLATFORM_ERROR ? (
            <div
              className={classnames('flex items-center gap-5 text-red-500 text-xs mt-5', {
                'justify-between': network,
                'justify-end': !network,
              })}
            >
              <div>
                <p>Something went wrong with the uniqueness check service. Do You want to proceed without uniqueness check?</p>
                <p>You can always come back and perform uniqueness checks from the asset details screen.</p>
              </div>
              <Button
                bold
                gradient
                loading={loading}
                disabled={isBtnDisabled}
                btnText={btnText}
                onClick={
                  mintType === MINT_TYPE.MINT
                    ? () => confirmMint(ASSET_TYPE.IMAGE, initialMetadata as NftMetadata, finalMetadata as finalMetadataType)
                    : handleSubmit
                }
                className='w-40 whitespace-nowrap'
              />
            </div>
          ) : null}
          {error && error === ALREADY_MINTED_ON_PLATFORM_ERROR ? (
            <div className='text-xs text-center text-red-500'>{ALREADY_MINTED_ON_PLATFORM_ERROR}</div>
          ) : null}
        </Card>
      </div>
      <MintConfirmModal
        mintedHashId={mintedHashId}
        show={showModal}
        type={mintedType}
        hashUrl={hashUrl}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default MintNftComponent;
