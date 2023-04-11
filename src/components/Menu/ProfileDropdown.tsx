import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import classNames from 'classnames/bind';
import { MdLogout } from 'react-icons/md';
import { HiChevronDown } from 'react-icons/hi';
import { Menu, Transition } from '@headlessui/react';

import { IUser } from 'src/types';
import { authUser } from 'src/providers';
import Version from 'src/components/Version';
import UserAvatar from 'src/components/UserAvatar';
import { useAuthActions } from 'src/providers/auth';
import { NAVBAR_LINKS } from 'src/constant/commonConstants';

interface ProfileDropdownType {
  user?: IUser;
  className?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownType> = ({ user, className = '' }) => {
  const authActions = useAuthActions();
  const [auth] = useRecoilState(authUser);
  const userAvatar = auth?.user?.avatar;
  return (
    <Menu as='div' className={`relative z-20 inline-block text-left ${className}`}>
      <div>
        <Menu.Button className='px-0 dropdown-menu'>
          <div className='flex-center'>
            <UserAvatar source={userAvatar} />
            <div className='gap-1 m-2 flex-center'>
              <p className='truncate max-w-5'>{user?.name || ''}</p>
              <HiChevronDown size={24} aria-hidden='true' />
            </div>
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 w-56 p-1 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          {NAVBAR_LINKS?.map(item => {
            const LinkIcon = item.icon;
            return (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <Link
                    to={item.link}
                    className={classNames('flex gap-2 rounded-md p-2 text-sm', {
                      'bg-secondary-purple text-white': active,
                      'opacity-20 pointer-events-none': !auth?.user?.activePlan || (item.isPremium && authActions.isUserOnFreePlan),
                    })}
                  >
                    <LinkIcon
                      className={classNames('w-5 h-5', { 'fill-white': active, 'fill-secondary-purple': !active })}
                      aria-hidden='true'
                    />
                    <span>{item.name}</span>
                  </Link>
                )}
              </Menu.Item>
            );
          })}
          <Menu.Item>
            {({ active }) => (
              <button
                className={classNames('flex gap-2 w-full rounded-md p-2 text-sm', {
                  'bg-secondary-purple text-white': active,
                })}
                onClick={authActions.logout}
              >
                <MdLogout
                  className={classNames('w-5 h-5', {
                    'fill-white': active,
                    'fill-secondary-purple': !active,
                  })}
                  aria-hidden='true'
                />
                <span>Logout</span>
              </button>
            )}
          </Menu.Item>
          <Version />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
