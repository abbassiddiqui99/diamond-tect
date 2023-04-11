import * as React from 'react';
import { useRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Menu, Transition } from '@headlessui/react';
import { MdOutlineNotifications } from 'react-icons/md';

import Heading from 'src/components/Heading';
import Skeleton from 'src/components/Skeleton';
import { notificationsBadge } from 'src/providers';
import { useNotifications } from 'src/hooks/useNotifications';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';
import NotificationBody from 'src/screens/Notifications/NotificationBody';

const NotificationMenu: React.FC = () => {
  const { loading, data, error, onUpdateStatus } = useNotifications();
  const notifications = data?.getNotifications;
  const [showNotificationBagde, setShowNotificationBagde] = useRecoilState(notificationsBadge);
  return (
    <Menu as='div' className='relative z-20 inline-block text-left'>
      {({ open }) => {
        if (open && showNotificationBagde) setShowNotificationBagde(false);
        return (
          <>
            <div
              className={classNames('p-2 transition rounded-full', {
                'bg-secondary-blue text-white': open,
                'bg-gray-100 hover:bg-secondary-blue/10': !open,
              })}
            >
              <Menu.Button className='flex'>
                <span className='relative inline-block'>
                  <MdOutlineNotifications size={24} aria-hidden='true' />
                  {/*  new notification dot */}
                  {showNotificationBagde ? (
                    <span className='absolute inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-blue top-2 right-2' />
                  ) : null}
                </span>
              </Menu.Button>
            </div>

            <Transition
              as={React.Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-72 sm:w-96 ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <Heading type='subheading' text='Notifications' className='p-3 mb-0' />
                <div className='overflow-y-auto max-h-96'>
                  {loading && !notifications?.length ? (
                    <div className='px-3'>
                      <Skeleton type='Notification' repeat={3} />
                    </div>
                  ) : null}
                  {!loading && notifications?.length ? (
                    <>
                      {notifications?.map((notification, idx) => (
                        <Menu.Item key={`${notification.id}_${idx}`}>
                          <NotificationBody notification={notification} loading={loading} onUpdateStatus={onUpdateStatus} menu />
                        </Menu.Item>
                      ))}
                    </>
                  ) : null}
                </div>
                {!loading && !notifications?.length ? <div className='p-3 text-sm text-center'>No new notifications</div> : null}
                <div className='p-3'>
                  <Link to={PROTECTED_ROUTES.NOTIFICATION} className='text-xs cursor-pointer text-secondary-blue hover:underline'>
                    View all notifications
                  </Link>
                </div>
                {error ? <div className='py-2 text-sm text-center text-red-500'>{error}</div> : null}
              </Menu.Items>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
};

export default NotificationMenu;
