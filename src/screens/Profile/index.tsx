import { Tab } from '@headlessui/react';
import classNames from 'classnames/bind';

import Card from 'src/components/Card';
import Heading from 'src/components/Heading';
import Password from 'src/screens/Profile/Password';
import Settings from 'src/screens/Profile/Settings';
import ProfileScreen from 'src/screens/Profile/ProfileSection';
import EditProfile from 'src/screens/Profile/EditProfile';

const ProfileTabs = [
  {
    title: 'Profile',
    component: <ProfileScreen />,
  },
  {
    title: 'Edit Profile',
    component: <EditProfile />,
  },
  {
    title: 'Change Password',
    component: <Password />,
  },
  {
    title: 'Settings',
    component: <Settings />,
  },
];

const Profile: React.FC = () => {
  return (
    <div className='container mx-auto'>
      <div className='w-full max-w-5xl px-2 py-8 mx-auto sm:px-0'>
        <Tab.Group>
          <Tab.List className='flex p-1 space-x-1 bg-white rounded-xl'>
            {ProfileTabs?.map(item => (
              <Tab
                key={item.title}
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 sm:text-sm text-xs leading-5 text-white rounded-lg',
                    'focus:outline-none focus:ring-2 ring-opacity-60',
                    {
                      'primary-gradient shadow font-semibold': selected,
                      'text-slate-500 font-medium hover:bg-gray-200/40': !selected,
                    },
                  )
                }
              >
                {item.title}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className='mt-2'>
            {ProfileTabs?.map(item => (
              <Tab.Panel key={item.title}>
                <Card className='px-2 sm:p-10 '>
                  <div className='mx-5'>
                    <Heading text={item.title} className='text-center sm:text-left' />
                    {item.component}
                  </div>
                </Card>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Profile;
