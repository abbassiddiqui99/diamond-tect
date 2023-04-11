import * as React from 'react';
import { AxiosResponse } from 'axios';
import { useRecoilValue } from 'recoil';
import { useMutation } from '@apollo/client';

import { showToast } from 'src/utils/Toast';
import { Uniqueness } from 'src/types/graphs';
import { useAuthActions } from 'src/providers/auth';
import { checkUniqueness } from 'src/services/http/restApi';
import { ContractService } from 'src/services/ContractService';
import { MINT_NFT, REMINT_NFT } from 'src/graphql/mint.graphql';
import { nftTypeDataToRemint, walletAddress } from 'src/providers';
import { AddResult, Asset, finalMetadataType, NftMetadata } from 'src/types';
import { generateFrames, getGifFrame, uploadToIpfs } from 'src/services/MintService';
import {
  errorHandler,
  fileObjectForIPFS,
  getAssetType,
  getAssetTypeFromUrl,
  getIpfsUrl,
  getUrlContentType,
  uniquenessAccepted,
} from 'src/utils/helpers';
import {
  ASSET_TYPE,
  AssignedRights,
  CATEGORY,
  MINT_TYPE,
  NFT_PORT_API_ERROR,
  RIGHTS_LIST,
  SMALL_IMG_ERROR,
} from 'src/constant/commonConstants';

const useMintNft = () => {
  const authActions = useAuthActions();

  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const address = useRecoilValue(walletAddress);
  const [fileUrl, setFileUrl] = React.useState('');
  const [hashUrl, setHashUrl] = React.useState('');
  const [progress, setProgress] = React.useState(-1);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const nftTypeData = useRecoilValue(nftTypeDataToRemint);
  const [description, setDescription] = React.useState('');
  const [mintedNftId, setMintedNftId] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState<File>();
  const [mintedHashId, setMintedHashId] = React.useState('');
  const [category, setCategory] = React.useState<CATEGORY>();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [currentNFTMint, setCurrentNFTMint] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File>();
  const [rights, setRights] = React.useState(AssignedRights.None);
  const [frames, setFrames] = React.useState<(string | undefined)[]>();
  const [mintType, setMintType] = React.useState<MINT_TYPE>(MINT_TYPE.MINT);
  const [initialMetadata, setInitialMetadata] = React.useState<NftMetadata>();
  const [finalMetadata, setFinalMetadata] = React.useState<finalMetadataType>();
  const [mintedType, setMintedType] = React.useState<MINT_TYPE>(MINT_TYPE.MINT);
  const [uniquenessResponse, setUniquenessResponse] = React.useState<Uniqueness>();

  const [mintNftMutation] = useMutation(MINT_NFT);
  const [remintNftMutation] = useMutation(REMINT_NFT);

  const contractService = React.useMemo(() => new ContractService(), []);
  const remintSubmitText = React.useMemo(() => {
    if (!address) {
      return 'Connect Wallet';
    }
    if (progress < 1) {
      return 'Remint NFT';
    }
    return 'Confirm Remint';
  }, [address, progress]);

  const handleChangeRights = (value: string) => {
    setRights(RIGHTS_LIST.findIndex(val => val === value));
  };

  const makeMetadata = React.useCallback(
    async (contentId?: string, contentThumbnail?: string) => {
      const metaData: {
        name: string;
        description: string;
        image: string;
        animation_url: string;
        rights: string[];
      } = {
        name: nftTypeData?.metadata?.name || name || '',
        description: nftTypeData?.metadata?.description || description || '',
        image: nftTypeData?.metadata?.image ?? '',
        animation_url: nftTypeData?.metadata?.animation_url ?? '',
        rights: [],
      };
      if (contentId) {
        const assetUrl = getIpfsUrl(contentId);
        let thumbnailUrl = '';
        if (contentThumbnail) {
          thumbnailUrl = getIpfsUrl(contentThumbnail);
        }
        const contentType = (await getUrlContentType(assetUrl)) as Asset;
        metaData.image = contentType === Asset.IMAGE ? assetUrl : thumbnailUrl;
        metaData.animation_url = contentType !== Asset.IMAGE ? assetUrl : '';
      }
      return metaData;
    },
    [
      description,
      name,
      nftTypeData?.metadata?.animation_url,
      nftTypeData?.metadata?.description,
      nftTypeData?.metadata?.image,
      nftTypeData?.metadata?.name,
    ],
  );

  const graph = async (token: string, type: MINT_TYPE, assetType: ASSET_TYPE, metadata: NftMetadata) => {
    try {
      const mintNft = {
        ipfsToken: token,
        ipfsMetaData: metadata,
        type,
        frames: frames || null,
        assetType,
        scoreId: uniquenessResponse?.id || '',
      };
      return await mintNftMutation({
        variables: {
          mintNft,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err?.message);
    }
  };

  const resetStates = () => {
    setName('');
    setLoading(false);
    setDescription('');
    setShowConfirm(false);
    setCategory(undefined);
    setThumbnail(undefined);
    setRights(AssignedRights.None);
    setSelectedFile(undefined);
    setMintType(MINT_TYPE.MINT);
    setUniquenessResponse(undefined);
    setCurrentNFTMint('');
  };

  const handleMintApi = async (assetType: ASSET_TYPE, metadata: NftMetadata, finalData: finalMetadataType) => {
    try {
      setProgress(4);
      const response = await graph(finalData.cid.toString(), mintType, assetType, metadata); // Token for metadata
      if (response?.data?.initializeMint?.id) {
        setMintedHashId(response?.data?.initializeMint?.hashId);
        setMintedType(response?.data?.initializeMint.type);
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err?.message });
    }
  };

  const handleContractInteraction = async (ipfsUri: string) => {
    if (mintType === MINT_TYPE.MINT) {
      setProgress(5);
      const hash = await contractService.askContractToMintNft(ipfsUri, address);
      setHashUrl(hash);
    }
  };

  const confirmMint = async (assetType: ASSET_TYPE, metadata: NftMetadata, finalData: finalMetadataType) => {
    try {
      setError('');
      setLoading(true);
      // did for the case if mint on wallet was canceled by user and user again requested mint
      // So we are here checking if the the asset minted on backend but for some reason failed on wallet
      if (!currentNFTMint) {
        await handleMintApi(assetType, metadata, finalData);
      }
      await handleContractInteraction(finalData.path);
      setShowModal(true);
      setProgress(-1);
      resetStates();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || 'Something went Wrong!');
      showToast({ message: err?.message, type: 'error' });
    }
    setLoading(false);
  };

  const mint = async () => {
    try {
      setShowConfirm(false);
      setLoading(true);
      setError('');
      setProgress(0);
      if (selectedFile) {
        let addedThumbnail: AddResult | undefined;
        if (thumbnail) {
          addedThumbnail = await uploadToIpfs(fileObjectForIPFS(thumbnail));
        }
        const addedFile = await uploadToIpfs(fileObjectForIPFS(selectedFile));
        const fileType = getAssetType(selectedFile);

        let videoFrames: (string | undefined)[] = [];
        if (fileType === ASSET_TYPE.VIDEO) {
          videoFrames = await generateFrames(selectedFile, 5);
          setFrames(videoFrames);
        }
        let gifThumbnail: string | undefined;
        if (fileType === ASSET_TYPE.GIF) {
          gifThumbnail = await getGifFrame(selectedFile);
          setFrames([gifThumbnail]);
        }

        setProgress(1);
        const metadata = await makeMetadata(addedFile.cid.toString(), addedThumbnail?.cid?.toString()); // Token for file
        const temp = JSON.parse(JSON.stringify(metadata));
        temp.rights.push(addedFile.cid.toString());
        const addedMetadata = await uploadToIpfs(JSON.stringify(temp));
        const newMetadata = JSON.parse(JSON.stringify(metadata));
        newMetadata.rights.push(`${rights}`);
        if (rights !== 0) {
          newMetadata.rights.push(addedMetadata.cid.toString());
        }
        if (uniquenessAccepted(selectedFile) && !authActions.isUserOnFreePlan) {
          setInitialMetadata(newMetadata);
          setFinalMetadata(addedMetadata);
          setProgress(2);
          showToast({ message: 'Uniqueness checks may take a while', type: 'info' });
          let res: AxiosResponse<Uniqueness, unknown>;
          if (fileType === ASSET_TYPE.VIDEO) {
            const imgArr: string[] = [];
            if (videoFrames && videoFrames[2]) {
              imgArr.push(videoFrames[2]);
            } // videoFrames.forEach(item => {       we will revert it back again to 5 images.
            //   if (item) {
            //     imgArr.push(item);
            //   }
            // });
            res = await checkUniqueness(imgArr);
          } else {
            res = await checkUniqueness([gifThumbnail || metadata.image]);
          }
          setUniquenessResponse(res as unknown as Uniqueness);
          setShowConfirm(true);
          setProgress(3);
          setLoading(false);
        } else {
          confirmMint(ASSET_TYPE.IMAGE, newMetadata, addedMetadata);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      if (errorHandler(err, false)) {
        setError(
          err?.message !== NFT_PORT_API_ERROR
            ? err?.message
            : 'Something went wrong with uniqueness check API. Please try again' || 'Something went Wrong!',
        );
        if (err?.message !== SMALL_IMG_ERROR)
          showToast({
            message: err?.message !== NFT_PORT_API_ERROR ? err?.message : 'Something went wrong with uniqueness check API',
            type: 'error',
          });
      }
    }
  };

  const getRemintType = async () => {
    if (nftTypeData?.metadata.animation_url || nftTypeData?.metadata.image) {
      return await getAssetTypeFromUrl(nftTypeData?.metadata?.animation_url || nftTypeData?.metadata?.image);
    }
  };

  const onRemint = React.useCallback(async () => {
    try {
      setShowConfirm(false);
      setLoading(true);
      setError('');
      setProgress(0);
      try {
        // get file type for remint
        const fileType = await getRemintType();

        // get frames for video
        let videoFrames: (string | undefined)[] = [];
        if (fileType === ASSET_TYPE.VIDEO && nftTypeData?.metadata?.animation_url) {
          videoFrames = await generateFrames(nftTypeData?.metadata?.animation_url, 5);
        }
        // get first frame for gif
        let gifThumbnail: string | undefined;
        if (fileType === ASSET_TYPE.GIF && nftTypeData?.metadata?.image) {
          gifThumbnail = await getGifFrame(nftTypeData?.metadata?.image);
        }

        let res: AxiosResponse<Uniqueness, unknown>;
        if (fileType === ASSET_TYPE.VIDEO) {
          const imgArr: string[] = [];

          if (videoFrames && videoFrames[2]) {
            imgArr.push(videoFrames[2]);
          }
          // videoFrames.forEach(item => {   we will revert it back again to 5 images.
          //   if (item) {
          //     imgArr.push(item);
          //   }
          // });
          showToast({ message: 'Uniqueness checks may take a while', type: 'info' });
          res = await checkUniqueness(imgArr);
          setUniquenessResponse(res as unknown as Uniqueness);
        } else if (fileType !== ASSET_TYPE.AUDIO && nftTypeData?.metadata?.image) {
          showToast({ message: 'Uniqueness checks may take a while', type: 'info' });
          res = await checkUniqueness([gifThumbnail || nftTypeData?.metadata?.image]);
          setUniquenessResponse(res as unknown as Uniqueness);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Todo, temporary fix need to fix it
        if (error?.message !== 'Image too simple or too small to create unique signature') {
          throw error;
        }
        setError(error?.message || 'Something went Wrong!');
      }
      setProgress(1);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (errorHandler(error)) {
        setLoading(false);
        setError(error?.message || 'Something went Wrong!');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemintApi = React.useCallback(async () => {
    setProgress(2);
    const metadata = await makeMetadata(''); // Token for file

    const { data: result, errors } = await remintNftMutation({
      variables: {
        assetType: ASSET_TYPE.IMAGE,
        ipfsMetaData: metadata,
        ipfsToken: nftTypeData?.ipfsToken ?? '',
        contractAdress: nftTypeData?.token_address ?? '',
        tokenId: nftTypeData?.token_id ?? '',
        scoreId: uniquenessResponse?.id ?? '',
      },
    });
    if (result?.data?.initializeRemint?.id) {
      setMintedNftId(result.data.initializeRemint.id);
      setCurrentNFTMint(result.data.initializeRemint.id);
    }
    if (errors?.length) {
      throw new Error(errors[0].message);
    }
  }, [makeMetadata, nftTypeData?.ipfsToken, nftTypeData?.token_address, nftTypeData?.token_id, remintNftMutation, uniquenessResponse?.id]);

  const handleRemintContractInteraction = React.useCallback(async () => {
    setProgress(3);
    await contractService.askToBurn(nftTypeData?.token_id ?? '');
    setProgress(4);
    const hash = await contractService.askContractToMintNft(nftTypeData?.ipfsToken ?? '', address);
    setHashUrl(hash);
  }, [address, contractService, nftTypeData?.ipfsToken, nftTypeData?.token_id]);

  const onConfirmRemint = React.useCallback(async () => {
    try {
      setShowConfirm(false);
      setLoading(true);
      setError('');
      if (!currentNFTMint) {
        await handleRemintApi();
      }
      await handleRemintContractInteraction();
      setShowModal(true);
      setProgress(-1);
      resetStates();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error?.message);
      showToast({ message: error?.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [handleRemintApi, handleRemintContractInteraction, currentNFTMint]);

  const handleRemint = React.useCallback(async () => {
    if (progress <= 0) {
      return await onRemint();
    }
    if (progress >= 1) return await onConfirmRemint();
  }, [onConfirmRemint, onRemint, progress]);

  return {
    mintedNftId,
    mintedHashId,
    mintedType,
    name,
    error,
    fileUrl,
    hashUrl,
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
    setName,
    setLoading,
    setFileUrl,
    setShowModal,
    setDescription,
    setCategory,
    setRights: handleChangeRights,
    setSelectedFile,
    setMintType,
    mint,
    handleRemint,
    confirmMint,
    setThumbnail,
    remintSubmitText,
  };
};

export default useMintNft;
