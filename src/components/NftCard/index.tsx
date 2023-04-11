import classnames from 'classnames/bind';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface NftCardType {
  image: string;
  name: string;
  onClick?: () => void;
}

const NftCard: React.FC<NftCardType> = ({ image, name, onClick }) => {
  return (
    <div
      className={classnames('flex flex-col justify-between col-span-10 col-start-2 p-3 bg-white rounded-2xl sm:col-auto', {
        'cursor-pointer': onClick,
      })}
      onClick={onClick}
    >
      <LazyLoadImage alt={name} src={image} className='w-full mb-3 rounded-2xl' />
      <div className='mb-2 font-semibold'>{name}</div>
    </div>
  );
};

export default NftCard;
