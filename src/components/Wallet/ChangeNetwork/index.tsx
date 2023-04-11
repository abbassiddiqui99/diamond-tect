import React from 'react';

import Button from 'src/components/Button';
import { errorHandler } from 'src/utils/helpers';
import PopupModal from 'src/components/PopupModal';
import { ReactComponent as PolygonLogo } from 'src/assets/svgs/polygon-matic-logo.svg';
import { ReactComponent as EthereumLogo } from 'src/assets/svgs/ethereum-eth-logo.svg';
import { ETHEREUM_REQUEST_METHODS, networkDetails, networks } from 'src/constant/WalletConstants';

interface ChangeNetworkType {
  currentNetwork: string;
}

const ChangeNetwork: React.FC<ChangeNetworkType> = ({ currentNetwork }) => {
  const [showModal, setShowModal] = React.useState(false);

  const NetworkIcon = {
    [networkDetails.ethereum.title]: <EthereumLogo width={15} />,
    [networkDetails.polygon.title]: <PolygonLogo width={15} />,
  };

  const changeNetwork = async ({ networkName }: { networkName: string }) => {
    try {
      if (!window.ethereum) throw new Error('No crypto wallet found');
      if (networkName === networkDetails.ethereum.name) {
        await window.ethereum.request({
          method: ETHEREUM_REQUEST_METHODS.WALLET_SWITCHETHEREUM_CHAIN,
          params: [{ chainId: networkDetails.ethereum.chainId }],
        });
      } else {
        await window.ethereum.request({
          method: ETHEREUM_REQUEST_METHODS.WALLET_ADDETHEREUM_CHAIN,
          params: [
            {
              ...networks[networkName],
            },
          ],
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err);
    }
  };

  const handleNetworkSwitch = async (networkName: string) => {
    await changeNetwork({ networkName });
  };

  const NetworkListItem: React.FC<{ title: string; name: string; icon?: React.ReactNode; disabled?: boolean }> = ({
    title,
    name,
    icon,
    disabled,
  }) => (
    <Button
      full
      icon={icon}
      preAppendIcon
      btnText={title}
      className='flex-center'
      disabled={disabled}
      onClick={() => {
        handleNetworkSwitch(name);
        setShowModal(false);
      }}
    />
  );

  return (
    <>
      <Button
        preAppendIcon
        textSize='sm'
        onClick={() => setShowModal(true)}
        icon={NetworkIcon[currentNetwork]}
        className='px-3 mr-3 text-xs bg-gray-100 rounded-xl hover:bg-gray-200'
        btnText={!NetworkIcon[currentNetwork] ? currentNetwork : ''}
      />

      <PopupModal
        show={showModal}
        title='Select a Network'
        text={`You are currently on ${currentNetwork} network`}
        onClose={() => setShowModal(false)}
      >
        <div className='flex gap-2 mt-3'>
          <NetworkListItem
            title={networkDetails.ethereum.title}
            name={networkDetails.ethereum.name}
            icon={NetworkIcon[networkDetails.ethereum.title]}
          />
          <NetworkListItem
            title={networkDetails.polygon.title}
            name={networkDetails.polygon.name}
            icon={NetworkIcon[networkDetails.polygon.title]}
            disabled
          />
        </div>
      </PopupModal>
    </>
  );
};

export default ChangeNetwork;
