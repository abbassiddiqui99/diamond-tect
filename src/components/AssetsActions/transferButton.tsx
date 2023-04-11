import * as React from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { FaLocationArrow } from 'react-icons/fa';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';

import { NFTDetails } from 'src/types';
import Button from 'src/components/Button';
import Heading from 'src/components/Heading';
import { walletAddress } from 'src/providers';
import PopupModal from 'src/components/PopupModal';
import { useAuthActions } from 'src/providers/auth';
import AssetViewer from 'src/components/AssetViewer';
import LoadingText from 'src/components/LoadingText';
import { TRANSFER_ASSET } from 'src/graphql/mint.graphql';
import FormInput from 'src/components/InputField/FormInput';
import { ContractService } from 'src/services/ContractService';
import { errorHandler, formatAddress } from 'src/utils/helpers';
import { LOADING_TRANSFER_ARRAY } from 'src/constant/commonConstants';
import TransferConfirmModal from 'src/components/TransferConfirmModal';
import { TRANSFER_ASSET_STATUS, WALLET_ADDRESS_REGEX } from 'src/constant/commonConstants';

const TransferButton: React.FC<{
  asset: NFTDetails;
  refetch: (variables?: Partial<OperationVariables>) => Promise<
    ApolloQueryResult<{
      getMint: NFTDetails;
    }>
  >;
}> = ({ asset, refetch }) => {
  const navigate = useNavigate();
  const authActions = useAuthActions();
  const address = useRecoilValue(walletAddress);
  const [hashURL, setHashURL] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [finishStatus, setfinishStatus] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const { control, handleSubmit, reset } = useForm<{ transferAddress: string }>();

  const [transferAssetMutation] = useMutation(TRANSFER_ASSET);

  const contractService = React.useMemo(() => new ContractService(), []);

  const onBackButtonEvent = (event: PopStateEvent) => {
    event.preventDefault();
    if (!finishStatus && window.confirm('Do you want to go back? If yes you cannot transfer the asset.')) {
      setfinishStatus(true);
      navigate(-1);
    } else {
      window.history.pushState(null, '', window.location.pathname);
      setfinishStatus(false);
    }
  };

  const closePrompt = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = '';
  };

  React.useEffect(() => {
    if (showModal) {
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', onBackButtonEvent);
      window.addEventListener('beforeunload', closePrompt);
    }
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
      window.removeEventListener('beforeunload', closePrompt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const transferAsset: SubmitHandler<{ transferAddress: string }> = async data => {
    try {
      setLoading(true);
      await transferAssetMutation({
        variables: {
          walletAddress: data.transferAddress,
          mintId: asset.id,
          transferStatus: TRANSFER_ASSET_STATUS.PENDING,
        },
      });
      const hash = await contractService.safeTransferAsset(address, data.transferAddress, asset.tokenId);
      setHashURL(hash);
      await transferAssetMutation({
        variables: {
          walletAddress: data.transferAddress,
          mintId: asset.id,
          transferStatus: TRANSFER_ASSET_STATUS.SUCCESS,
        },
      });
      closeModal();
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
      reset();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  return (
    <>
      <div
        onClick={() => (!authActions.isUserOnFreePlan ? setShowModal(true) : null)}
        className={classNames('px-5 py-4 transition ease-in rounded-lg cursor-pointer hover:bg-slate-300 bg-slate-100', {
          'cursor-not-allowed': authActions.isUserOnFreePlan,
        })}
      >
        <FaLocationArrow />
      </div>

      <PopupModal large show={showModal} closeBtn={!loading} persistent title='Transfer' onClose={closeModal}>
        <AssetViewer
          image={asset.ipfsMetaData?.image}
          animation_url={asset.ipfsMetaData?.animation_url}
          effect='blur'
          className='flex-col w-2/3 p-5 mx-auto mt-10 shadow-xl md:w-1/4 bg-slate-200 rounded-xl flex-center'
          draggable={false}
        />

        <div className='px-0 mt-5 sm:px-28'>
          <Heading type='base' text='Wallet address' />
          <form onSubmit={handleSubmit(transferAsset)}>
            <Controller
              name='transferAddress'
              control={control}
              defaultValue=''
              rules={{
                required: 'This field is required',
                pattern: { value: WALLET_ADDRESS_REGEX, message: 'Invalid Wallet Address' },
                validate: {
                  matchAddress: (value?: string) => value !== address || 'Cannot transfer at your own address',
                },
              }}
              render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                <>
                  <FormInput
                    type='text'
                    placeholder='e.g. 0x1ed3...'
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    disabled={loading}
                  />
                  <p className='mt-5 text-sm text-center text-gray-500'>
                    Your item will be transferred to {!value ? '...' : <strong>{formatAddress(value)}</strong>}
                  </p>
                </>
              )}
            />
            <div className='flex-center'>
              <Button
                type='submit'
                className='w-1/3'
                gradient
                btnText={address ? 'Transfer' : 'Please Connect Wallet'}
                disabled={!address || loading}
                loading={loading}
              />
            </div>
          </form>
          {loading ? <LoadingText textArray={LOADING_TRANSFER_ARRAY} /> : null}
        </div>
      </PopupModal>
      <TransferConfirmModal
        id={asset.id || ''}
        show={showSuccessModal}
        hashUrl={hashURL}
        onClose={() => setShowSuccessModal(false)}
        refetch={refetch}
      />
    </>
  );
};

export default TransferButton;
