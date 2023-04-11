import Heading from 'src/components/Heading';
import Tooltip from 'src/components/Tooltip';
import { MINT_TYPE } from 'src/constant/commonConstants';

interface CheckboxType extends React.ComponentProps<'input'> {
  type: MINT_TYPE;
  setType: React.Dispatch<React.SetStateAction<MINT_TYPE>>;
}

const Checkbox: React.FC<CheckboxType> = ({ disabled, type, setType }) => {
  return (
    <div className='mt-6'>
      <Heading type='base' text='Type' />
      <div className='block sm:gap-5 sm:flex'>
        <label className='flex items-center gap-2'>
          <input type='checkbox' onChange={() => setType(MINT_TYPE.MINT)} checked={type === MINT_TYPE.MINT} disabled={disabled} />
          <span>On-chain Mint</span>

          {/* Mint Tooltip */}
          <Tooltip text='You pay for on-chain transaction.' />
        </label>
        <label className='flex items-center gap-2'>
          <input type='checkbox' onChange={() => setType(MINT_TYPE.LAZY_MINT)} checked={type === MINT_TYPE.LAZY_MINT} disabled={disabled} />
          <span>Gasless Mint</span>

          {/* Gasless Mint Tooltip */}
          <Tooltip text='Buyer pays for on-chain transaction.' />
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
