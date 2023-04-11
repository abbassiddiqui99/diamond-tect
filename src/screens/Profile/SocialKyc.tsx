import * as React from 'react';
import { ethers } from 'ethers';
import { useRecoilState } from 'recoil';
import { useLazyQuery } from '@apollo/client';
import MetamaskOnboarding from '@metamask/onboarding';
import { Web3Provider } from '@ethersproject/providers';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { authUser } from 'src/providers';
import { SocialKycData } from 'src/types';
import Button from 'src/components/Button';
import { showToast } from 'src/utils/Toast';
import Heading from 'src/components/Heading';
import FormError from 'src/components/FormError';
import { client } from 'src/graphql/ApolloClient';
import PopupModal from 'src/components/PopupModal';
import FormInput from 'src/components/InputField/FormInput';
import { ETHEREUM_REQUEST_METHODS } from 'src/constant/WalletConstants';
import { DISCONNECT_TWITTER_QUERY, GET_USER_QUERY, VERIFY_TWEET_QUERY } from 'src/graphql/query';

const SocialKyc: React.FC = () => {
  const { control, handleSubmit } = useForm<SocialKycData>();
  const { isMetaMaskInstalled } = MetamaskOnboarding;
  const [auth] = useRecoilState(authUser);
  const user = auth?.user;

  const [errorMsg, setErrorMsg] = React.useState<string>('');
  const [twitterUserName, setTwitterUserName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [signature, setSignature] = React.useState<string | null>(null);
  const [verify, setVerify] = React.useState(false);
  const [ethersProvider, setEthersProvider] = React.useState<Web3Provider | undefined>();

  const [verifyUserTweet, { data, loading: verifyTweetLoading }] = useLazyQuery(VERIFY_TWEET_QUERY, {
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      client.cache.updateQuery({ query: GET_USER_QUERY }, dta => {
        return { getUser: { ...dta?.getUser, socialKyc: data?.verifyTweet?.socialKyc } };
      });
    },
  });
  const [disconnectTwitter, { loading: disconnectLoader, data: disconnectData }] = useLazyQuery(DISCONNECT_TWITTER_QUERY, {
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      client.cache.updateQuery({ query: GET_USER_QUERY }, dta => {
        return { getUser: { ...dta?.getUser, socialKyc: data?.disconnectTwitter?.socialKyc } };
      });
    },
  });

  React.useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    setEthersProvider(provider);
  }, []);

  React.useEffect(() => {
    if (data?.verifyTweet) {
      setShowModal(false);
      setVerify(false);
      if (data?.verifyTweet?.socialKyc?.verified && !verifyTweetLoading) {
        showToast({ message: 'Successfully verified the account', type: 'success' });
      } else if (!data?.verifyTweet?.socialKyc?.verified && !verifyTweetLoading) {
        showToast({
          message: 'Unable to find the tweet on the provided account. You may have not tweeted or You may have modified the tweet.',
          type: 'error',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyTweetLoading]);

  React.useEffect(() => {
    if (disconnectData?.disconnectTwitter && !disconnectData?.disconnectTwitter?.socialKyc) {
      showToast({ message: 'Successfully disconnected Twitter account', type: 'success' });
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnectLoader]);

  const getAddress = async () => {
    const signer = ethersProvider?.getSigner();
    return signer?.getAddress();
  };

  const onSubmit: SubmitHandler<{ socialKyc: string }> = async value => {
    setErrorMsg('');
    setTwitterUserName(value.socialKyc);
    try {
      if (user?.socialKyc?.verified) {
        setLoading(true);
        await disconnectTwitter();
      } else {
        if (isMetaMaskInstalled()) {
          setLoading(true);
          const address = await getAddress();
          if (address) {
            const msgParams = [
              {
                type: 'string',
                name: 'Message',
                value: `{"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"}],"Permit":[{"name":"username","type":"string"}]},"domain":{"name":"Heera Digital Verifier","version":"1"},"primaryType":"Permit","message":{"username":"${value.socialKyc}"}}`,
              },
            ];
            const from = address;
            const sign = await window.ethereum.request({
              method: ETHEREUM_REQUEST_METHODS.ETH_SIGN_TYPED_DATA,
              params: [msgParams, from],
            });
            setSignature(sign);
            setLoading(false);
            setShowModal(true);
          }
        } else {
          setErrorMsg('MetaMask not installed. Please install the MetaMask extension.');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      if (err?.message === 'unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION, version=providers/5.5.2)') {
        setErrorMsg('MetaMask not connected. Please connect Metamask first.');
      } else {
        setErrorMsg(err?.message);
      }
    }
  };

  const postToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Verifying my identity for %40heera_digital%0A%0Asig%3A${signature}%0A%0Ahttps%3A%2F%2Fheera.digital`,
    );
    setVerify(true);
  };

  const verifyTweet = async () => {
    try {
      verifyUserTweet({
        variables: {
          kycData: {
            signature,
            twitter_handle: twitterUserName,
          },
        },
      });
    } catch (err) {
      showToast({ message: 'Failed to verify the account', type: 'error' });
      console.error(err);
    }
  };

  return (
    <>
      <div className='flex-col mt-10 flex-center md:flex-row md:flex-between'>
        <div>
          <Heading type='subheading' text='Verify your identity' className='mb-0 text-center sm:text-left' />
          <p className='text-xs text-gray-500 tex-center'>
            Tired of being an anonymous wallet address? <br /> Link your Ethereum address to your Twitter account.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='gap-2 flex-center'>
          <Controller
            name='socialKyc'
            control={control}
            defaultValue=''
            rules={user?.socialKyc?.verified ? {} : { required: 'This field is required' }}
            render={({ field: { name, value, onChange }, fieldState: { error } }) => (
              <FormInput
                type='text'
                placeholder='Twitter handle'
                name={name}
                defaultValue=''
                value={user?.socialKyc?.twitter_handle || value}
                onChange={onChange}
                error={error?.message}
                disabled={user?.socialKyc?.verified}
              />
            )}
          />
          <Button
            btnText={user?.socialKyc?.verified ? 'Disconnect' : 'Link Twitter'}
            type='submit'
            className='w-28'
            textSize='sm'
            disabled={loading}
            loading={loading}
          />
        </form>
        <PopupModal
          show={showModal}
          title={'Verify Twitter'}
          text={verify ? 'Click below to verify your signature.' : 'Post a message on Twitter to prove you control your Ethereum address.'}
          onClose={() => {
            setShowModal(false);
            setVerify(false);
          }}
          closeBtn
          persistent
        >
          {verify ? (
            <div className='gap-4 flex-between'>
              <Button onClick={verifyTweet} btnText='Verify Tweet' full gradient disabled={false} loading={verifyTweetLoading} />
            </div>
          ) : (
            <>
              <div className='gap-4 flex-between'>
                <Button onClick={postToTwitter} btnText='Post to Twitter' full gradient disabled={false} loading={false} />
              </div>
              <div>
                <p className='text-sm text-gray-500'>Make sure your Twitter account is public and you do not change the tweet text.</p>
              </div>
            </>
          )}
        </PopupModal>
      </div>
      <FormError error={errorMsg} />
    </>
  );
};

export default SocialKyc;
