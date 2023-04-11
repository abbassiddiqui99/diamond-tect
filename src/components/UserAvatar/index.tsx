import { BsFillPersonFill } from 'react-icons/bs';

interface UserAvatarType {
  source?: string;
}

const UserAvatar: React.FC<UserAvatarType> = ({ source }) => {
  return (
    <div className='overflow-hidden bg-white border border-gray-300 rounded-full avatar'>
      {source ? (
        <img className='object-cover w-full h-full rounded-full' src={source} alt='Avatar' />
      ) : (
        <BsFillPersonFill size='100%' className='mt-1.5 fill-gray-500' />
      )}
    </div>
  );
};

export default UserAvatar;
