import CONFIG from 'src/config.env';
import { openUrlInNewTab } from 'src/utils/helpers';

const RegistryButton: React.FC<{ mintHash: string }> = ({ mintHash }) => {
  return (
    <div
      onClick={() => openUrlInNewTab(`${CONFIG.REGISTRY_URL}/registry/hd-contract/${mintHash}`)}
      className='inline-flex items-baseline px-5 py-4 transition ease-in rounded-lg cursor-pointer hover:bg-slate-300 bg-slate-100'
    >
      View in Registry
    </div>
  );
};

export default RegistryButton;
