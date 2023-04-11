import * as React from 'react';
import CONFIG from 'src/config.env';
import { useRecoilValue } from 'recoil';
import { MdLockOutline } from 'react-icons/md';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';

import OTP from 'src/components/OTP';
import { NFTDetails } from 'src/types';
import Button from 'src/components/Button';
import Timer from 'src/screens/Auth/Timer';
import { showToast } from 'src/utils/Toast';
import Heading from 'src/components/Heading';
import PopupModal from 'src/components/PopupModal';
import { authUser, walletAddress } from 'src/providers';
import { useProtectedNft } from 'src/hooks/useProtectedNft';
import { ProtectNftType } from 'src/constant/commonConstants';
import { ContractService } from 'src/services/ContractService';
import { PROTECTION_FIELDS } from 'src/constant/LocalConstant';
import { errorHandler, isCurrentOwner } from 'src/utils/helpers';
import PaymentModal from 'src/components/ProtectNft/PaymentModal';
import SuccessorAddress from 'src/components/ProtectNft/SuccessorAddress';

const PUBLIC_KEY = CONFIG.STRIPE_PUBLIC_KEY;
const stripeTestPromise = loadStripe(PUBLIC_KEY);

interface IFormInput {
  lossPrevention: boolean;
  successionManagement: boolean;
  counterfeitMonitoring: boolean;
}

const ListItem: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <>
    <Heading type='base' text={title} />
    <p className='mb-5'>{desc}</p>
  </>
);

const ProtectNft: React.FC<{ asset: NFTDetails; isProtected: boolean }> = ({ asset, isProtected }) => {
  const auth = useRecoilValue(authUser);

  const address = useRecoilValue(walletAddress);
  const [loading, setLoading] = React.useState(false);
  const [showOTP, setShowOTP] = React.useState(false);
  const [data, setData] = React.useState<IFormInput>();
  const [showModal, setShowModal] = React.useState(false);
  const [assetProtected, setAssetProtected] = React.useState(false);
  const [successorAddress, setSuccessorAddress] = React.useState({
    loss: { address: '' },
    succession: { address: '', days: 90 },
  });
  const [showPaymentForm, setShowPaymentForm] = React.useState(false);
  const [showSuccessionModal, setShowSuccessionModal] = React.useState(false);

  const { protectNft, requestProtectNFT, loadingProtectNFT } = useProtectedNft();
  const { control, handleSubmit, getValues, watch, reset } = useForm<IFormInput>();

  const contractService = React.useMemo(() => new ContractService(), []);

  watch(['lossPrevention', 'counterfeitMonitoring', 'successionManagement']);

  const isFormValid = () => {
    const vals = getValues();
    if (Object.keys(vals).length !== 0) {
      return !vals.lossPrevention && !vals.successionManagement;
    }
    return false;
  };

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    setData(data);
    setShowModal(false);
    setTimeout(() => {
      setShowPaymentForm(true);
    }, 500);
  };

  const VerifyAndProtect = async (otp: number) => {
    try {
      setLoading(true);
      const protection = [];
      if (data?.lossPrevention) {
        const temp = {
          ownerAddress: address,
          successorAdress: successorAddress.loss.address,
          type: ProtectNftType.LOSS,
        };
        protection.push(temp);
      }
      if (data?.successionManagement) {
        const temp = {
          ownerAddress: address,
          successorAdress: successorAddress.succession.address,
          successionEndDays: 90,
          type: ProtectNftType.SUCCESSION,
        };
        protection.push(temp);
      }
      await contractService.safeSetApprovalForAll();
      await protectNft({
        variables: {
          payload: {
            assetId: asset.id,
            otp,
            protection,
          },
        },
      });
      reset();
      setAssetProtected(true);
      const messageArr = [];
      if (data?.lossPrevention) messageArr.push('Loss Prevention');
      if (data?.successionManagement) messageArr.push('Succession Management');
      const message = messageArr.join(' & ');
      showToast({ message: `Asset successfully setup for ${message}`, type: 'success' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setShowOTP(false);
      setLoading(false);
    }
  };

  const submit = async (data: { successorWallet?: string; successorForLossWallet?: string; successionEndDays?: number }) => {
    try {
      // address checks can be removed when we get the current user's wallet address from the backend
      if (!address) {
        showToast({ message: 'Please connect your wallet to proceed', type: 'info' });
        return;
      }

      if (
        (data?.successorWallet || data?.successorForLossWallet) &&
        (address !== data?.successorWallet || address !== data?.successorForLossWallet)
      ) {
        const temp = { ...successorAddress };
        temp.loss.address = data.successorForLossWallet || '';
        temp.succession.address = data.successorWallet || '';
        temp.succession.days = data.successionEndDays || 90;
        setSuccessorAddress(temp);
        setLoading(true);
        await requestProtectNFT(); // sends OTP to email
        setShowSuccessionModal(false);
        setTimeout(() => {
          setShowOTP(true);
        }, 500);
      } else {
        showToast({ message: 'Cannot enter your own wallet', type: 'info' });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const onPaymentSuccess = () => {
    setShowPaymentForm(false);
    if (data?.lossPrevention || data?.successionManagement) {
      setTimeout(() => {
        setShowSuccessionModal(true);
      }, 500);
    }
  };

  return (
    <>
      {isProtected || assetProtected ? (
        <div className='pointer-events-none'>
          <Button btnText='Protected' className='!rounded-lg my-0' gradient preAppendIcon icon={<MdLockOutline />} />
        </div>
      ) : null}
      {!isProtected && !assetProtected && isCurrentOwner(asset.creator, asset.owner, auth?.user) ? (
        <>
          {/* address checks can be removed when we get the current user's wallet address from the backend */}
          <Button
            type='button'
            btnText={address ? 'Protect your NFT' : 'Connect your wallet'}
            className='!rounded-lg my-0'
            disabled={!address}
            onClick={() => setShowModal(true)}
          />
          <PopupModal
            show={showModal}
            onClose={() => setShowModal(false)}
            title='Protect your NFT'
            closeBtn={!loading}
            persistent={loading}
          >
            <ListItem
              title='Succession Management'
              desc='Enable the automatic transfer of your asset to a predefined account upon the inability to reactivate a set timer'
            />
            <ListItem title='Loss Prevention' desc='Ability to claim the asset at the designated wallet address' />
            <ListItem
              title='Counterfeit Monitoring'
              desc='Get notified of copy-cat NFTs and take them down through our expedited DCMA takedown request process'
            />
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
              {Object.keys(PROTECTION_FIELDS).map(key => (
                <Controller
                  key={key}
                  name={key as keyof IFormInput}
                  control={control}
                  defaultValue={true}
                  render={({ field: { name, value, onChange } }) => (
                    <label className='flex items-center gap-2'>
                      <input name={name} type='checkbox' checked={value} onChange={onChange} disabled={loading} />
                      <span>{PROTECTION_FIELDS[key as keyof typeof PROTECTION_FIELDS]}</span>
                    </label>
                  )}
                />
              ))}
              <Controller
                name='counterfeitMonitoring'
                control={control}
                defaultValue={true}
                render={({ field: { name } }) => (
                  <label className='flex items-center gap-2'>
                    <input name={name} type='checkbox' checked disabled />
                    <span>Counterfeit Monitoring</span>
                  </label>
                )}
              />
              <div className='flex gap-4 mt-5'>
                <Button type='submit' btnText='Pay with Fiat' full disabled={isFormValid() || loading} loading={loading} />
              </div>
            </form>
          </PopupModal>
          <PopupModal show={showOTP} onClose={() => setShowModal(false)} title='Verify OTP' persistent>
            <OTP onSave={VerifyAndProtect} disabled={loading} />
            <Timer
              disabled={loading || loadingProtectNFT}
              onClick={async () => {
                await requestProtectNFT();
              }}
            />
          </PopupModal>
          <SuccessorAddress
            data={data}
            show={showSuccessionModal}
            onClose={() => setShowSuccessionModal(false)}
            loading={loading}
            onSubmit={submit}
          />
          <Elements stripe={stripeTestPromise}>
            <PaymentModal
              show={showPaymentForm}
              onClose={() => setShowPaymentForm(false)}
              formData={data}
              assetId={asset.id}
              onSuccess={onPaymentSuccess}
            />
          </Elements>
        </>
      ) : null}
    </>
  );
};

export default ProtectNft;
