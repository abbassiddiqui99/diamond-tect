import { useRecoilState } from 'recoil';
import classnames from 'classnames/bind';
import { BiWorld } from 'react-icons/bi';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdOutlineAccountBalanceWallet, MdPersonOutline } from 'react-icons/md';

import Card from 'src/components/Card';
import { authUser } from 'src/providers';
import Heading from 'src/components/Heading';
import { formatAddress, formatDate } from 'src/utils/helpers';

const SectionTitle = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <div className='flex items-center gap-2'>
    {icon}
    <Heading text={title} type='subheading' className='mb-0' />
  </div>
);

const SectionItem = ({ name, value }: { name: string; value?: string }) => (
  <div className='flex flex-col justify-between my-3 text-sm sm:flex-row'>
    <strong>{name}</strong>
    <div>{value}</div>
  </div>
);

const ProfileSection: React.FC = () => {
  const [auth] = useRecoilState(authUser);
  const user = auth?.user;

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
      {/* Left Card */}
      <div className='w-full col-auto md:col-span-5'>
        <Card className={classnames('p-5 border-t-4', { 'border-green-500': user?.isActive, 'border-red-500': !user?.isActive })}>
          <div className='w-40 h-40 mx-auto'>
            {user?.avatar ? (
              <img className='object-cover w-full h-full rounded-full' src={user?.avatar} alt='Profile image' />
            ) : (
              <BsFillPersonFill size='100%' color='gray' className='mt-1.5' />
            )}
          </div>
          <Heading text={user?.name || ''} type='subheading' className='text-center' />
          <div className='flex flex-col gap-3 p-3 text-sm bg-gray-200 rounded-lg'>
            <div className='gap-2 flex-between'>
              <span>Status</span>
              <span
                className={classnames('px-2 py-1 text-white bg-green-500 rounded', {
                  'bg-green-500': user?.isActive,
                  'bg-red-500': !user?.isActive,
                })}
              >
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {user?.createdAt ? (
              <div className='gap-2 flex-between'>
                <span>Member Since</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
            ) : null}
            {user?.activePlan ? (
              <div className='gap-2 flex-between'>
                <span>Subscription Plan</span>
                <span>{user.activePlan.name}</span>
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      {/* Right Card */}
      <div className='w-full col-auto md:col-span-7'>
        <Card className='h-full p-5'>
          {/* About */}
          <SectionTitle title='About' icon={<MdPersonOutline size={24} aria-hidden='true' />} />

          <SectionItem name='Name' value={user?.name} />
          <SectionItem name='Username' value={user?.username} />
          <SectionItem name='Email' value={user?.email} />

          {/* Wallet */}
          {user?.walletAddress ? (
            <>
              <SectionTitle title='Wallet' icon={<MdOutlineAccountBalanceWallet size={24} aria-hidden='true' />} />
              <SectionItem name='Address' value={formatAddress(user?.walletAddress)} />
            </>
          ) : null}

          {/* Social Media */}
          {user?.socialMedia?.some(item => item.link) ? (
            <>
              <SectionTitle title='Social Media Links' icon={<BiWorld size={24} aria-hidden='true' />} />
              {user.socialMedia.map(item => {
                return item.link ? <SectionItem key={`link${item.type}`} name={item.type} value={item.link} /> : null;
              })}
            </>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default ProfileSection;
