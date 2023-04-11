import classnames from 'classnames/bind';
import { CATEGORY } from 'src/constant/commonConstants';
import { ACCEPTED_FILE_TYPES } from 'src/constant/DropzoneConstants';

interface CategoryCardType {
  title: CATEGORY;
  active?: boolean;
  src?: string;
  onClick?: () => void;
  selectedFileType?: string;
}

const CategoryCard: React.FC<CategoryCardType> = ({ title, active, src, onClick, selectedFileType }) => {
  const isClickable = ACCEPTED_FILE_TYPES[title].includes(selectedFileType ?? '');
  return (
    <div
      className={classnames('p-3 bg-gray-100 cursor-pointer rounded-3xl', {
        'primary-gradient text-white': active,
        'opacity-50 cursor-not-allowed': !isClickable,
      })}
      onClick={isClickable ? onClick : undefined}
    >
      <img src={src} className='w-full mb-3 rounded-2xl' draggable={false} />
      <div className='font-semibold'>{title}</div>
    </div>
  );
};

export default CategoryCard;
