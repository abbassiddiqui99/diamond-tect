import { useRecoilValue } from 'recoil';
import { walletAddress } from 'src/providers';
import { formatAddress } from 'src/utils/helpers';

const WalletDetails = () => {
  const address = useRecoilValue(walletAddress);

  return (
    <div className='flex items-center h-12 overflow-hidden text-sm font-semibold bg-gray-100 border-2 rounded-lg shadow select-none w-fit primary-gradient border-dark-800'>
      <div className='px-3 text-sm text-white'>
        <span>{formatAddress(address)}</span>
      </div>
    </div>
  );
};

export default WalletDetails;
