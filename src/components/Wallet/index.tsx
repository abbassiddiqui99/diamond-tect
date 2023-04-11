import * as React from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { IUser } from 'src/types';
import Button from 'src/components/Button';
import { convertToHex } from 'src/utils/helpers';
import { UPDATE_USER } from 'src/graphql/mutation';
import PopupModal from 'src/components/PopupModal';
import { GET_USER_QUERY } from 'src/graphql/query';
import ChangeNetwork from 'src/components/Wallet/ChangeNetwork';
import WalletDetails from 'src/components/Wallet/WalletDetails';
import { networkNames, OneNetworkName } from 'src/constant/WalletConstants';
import { authUser, walletAddress, walletChain, walletNetwork } from 'src/providers';

const ConnectToInjected = async () => {
  let provider = null;
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum;
    try {
      await provider.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      throw new Error('User Rejected');
    }
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else if (window.celo) {
    provider = window.celo;
  } else {
    throw new Error('No Web3 Provider found');
  }
  return provider;
};

const Wallet: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [getUserInfo] = useLazyQuery(GET_USER_QUERY);
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const setAuth = useSetRecoilState(authUser);
  const setChain = useSetRecoilState(walletChain);
  const [loading, setLoading] = React.useState(false);
  const [address, setAddress] = useRecoilState(walletAddress);
  const [network, setNetwork] = useRecoilState(walletNetwork);
  const [invalidWallet, setInvalidWallet] = React.useState(false);
  const [popUpText, setPopUpText] = React.useState('Please disconnect and Connect a wallet that is linked to your Heera account');

  // WalletConnect (commenting till its implementation is done)

  // const providerOptions = {
  //   walletconnect: {
  //     package: WalletConnectProvider, // required
  //     options: {
  //       infuraId: process.env.REACT_APP_INFURA_ID || 'INFURA_ID', // required
  //     },
  //   },
  // };

  const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    // providerOptions, // required   // (WalletConnect)
  });

  const updateWalletAddress = async (walletAddress: string) => {
    try {
      const { data } = await updateUserMutation({
        variables: {
          updateUserData: {
            walletAddress,
          },
        },
      });
      setAuth(currentValue => {
        if (!currentValue) return null;
        const user = currentValue.user && {
          ...currentValue.user,
          walletAddress: data?.updateUser?.walletAddress,
        };
        return {
          ...currentValue,
          user,
        };
      });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setPopUpText(error.message);
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscribeProvider = (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on('accountsChanged', () => {
      web3Modal.clearCachedProvider();
      setAddress('');
      setNetwork('');
    });
  };

  const walletAuthentication = async (address: string, userInfo: IUser) => {
    // check if user wallet address equal to metamask wallet address
    if (userInfo?.walletAddress === address) {
      return true;
    }
    // check if user dont have wallet then set wallet address
    if (userInfo && !userInfo?.walletAddress) {
      return await updateWalletAddress(address);
    }
    // check if user wallet address exist but not equal to metamask wallet address
    if (userInfo && userInfo?.walletAddress !== address) {
      return false;
    }

    return false;
  };

  const connect = async (cachedProviderName?: string) => {
    try {
      let instance;
      if (cachedProviderName) {
        if (cachedProviderName === 'injected') {
          instance = await ConnectToInjected();
        }
      } else {
        web3Modal.clearCachedProvider();
        instance = await web3Modal.connect();
      }
      subscribeProvider(instance);
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const { data: userInfo } = await getUserInfo();
      const walletValidation = await walletAuthentication(address, userInfo?.getUser);
      if (walletValidation) {
        setAddress(address);
        const network = await provider.getNetwork();
        networkChanged(convertToHex(network.chainId));
      } else {
        setInvalidWallet(true);
      }
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
    }
  };

  // runs everytime network is chained using our app or directly from MetaMask.
  const networkChanged = (chainId: OneNetworkName) => {
    setChain(chainId);
    const chainName = networkNames[chainId];
    if (chainName) {
      setNetwork(chainName);
    } else {
      setNetwork(chainId);
    }
  };

  // eventListener for network change using MetaMask extension
  React.useEffect(() => {
    const cachedProviderName = web3Modal.cachedProvider;
    if (cachedProviderName && window.ethereum) {
      connect(cachedProviderName);
    }
    if (window.ethereum) {
      window.ethereum.on('chainChanged', networkChanged);

      return () => {
        window.ethereum.removeListener('chainChanged', networkChanged);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addressAndNetwork = address !== undefined && network.length > 0 ? true : false;

  return (
    <>
      <div className={className}>
        {addressAndNetwork && window.ethereum ? (
          <div className='flex items-center'>
            <ChangeNetwork currentNetwork={network} />
            <WalletDetails />
          </div>
        ) : null}
        {!addressAndNetwork && window.ethereum ? (
          <Button onClick={() => connect()} btnText='Connect Wallet' gradient disabled={loading} loading={loading} className='w-40' />
        ) : null}
        {!window.ethereum ? (
          <a href='https://metamask.io/' target='_blank' rel='noreferrer'>
            <Button btnText='Install MetaMask' gradient />
          </a>
        ) : null}
      </div>
      <PopupModal
        show={invalidWallet}
        onClose={() => setInvalidWallet(false)}
        title='Invalid Wallet Address'
        text={popUpText}
        btnText='Got it!'
        persistent
      />
    </>
  );
};

export default Wallet;
