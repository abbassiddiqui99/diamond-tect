import { BsX } from 'react-icons/bs';
import { getFileSizeinMB } from 'src/utils/helpers';

interface SelectedFileCardType {
  file: File;
  onClick?: () => void;
  disabled?: boolean;
}

const SelectedFileCard: React.FC<SelectedFileCardType> = ({ file, disabled, onClick }) => (
  <div className='px-5 py-3 mt-5 bg-gray-100 rounded-full flex-between'>
    {file.name} - {getFileSizeinMB(file.size)}
    {!disabled ? <BsX size={24} className='cursor-pointer' onClick={onClick} /> : null}
  </div>
);

export default SelectedFileCard;
