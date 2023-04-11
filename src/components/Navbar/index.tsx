import React from 'react';
import classnames from 'classnames/bind';
import { TiThMenu } from 'react-icons/ti';
import { MdLogout, MdLogin } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import Logo from 'src/components/Logo';
import Button from 'src/components/Button';
import Wallet from 'src/components/Wallet';
import Version from 'src/components/Version';
import { useAuthActions } from 'src/providers/auth';
import { authUser, isAuthenticated, walletAddress } from 'src/providers';
import { NAVBAR_LINKS } from 'src/constant/commonConstants';
import NotificationMenu from 'src/components/NotificationMenu';
import ProfileDropDown from 'src/components/Menu/ProfileDropdown';
import { PROTECTED_ROUTES, ROUTES } from 'src/constant/NavigationConstant';

const Navbar: React.FC = () => {
  const authActions = useAuthActions();
  const navigate = useNavigate();
  const [auth] = useRecoilState(authUser);
  const user = auth?.user;
  const address = useRecoilValue(walletAddress);
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const isAuth = useRecoilValue(isAuthenticated);

  const HamburgerIcon = ({ onClick }: { onClick?: () => void }) => (
    <div className='flex items-center p-2 rounded-full cursor-pointer md:hidden hover:bg-gray-300'>
      <TiThMenu size={24} onClick={onClick} />
    </div>
  );

  return (
    <nav className='px-4 mx-auto bg-white shadow-lg sm:px-8 sm:mt-10 sm:rounded-2xl sm:container'>
      <div className='flex justify-between'>
        {/* logo */}
        <Link to={PROTECTED_ROUTES.ROOT}>
          <Logo />
        </Link>

        {/* Right Items */}
        <div className='flex items-center gap-3'>
          {/* if auth is available it show all profile dropdown */}
          {auth && isAuth ? (
            <>
              <Wallet className={address ? 'hidden md:flex-center' : 'flex-center'} />
              <NotificationMenu />
              <ProfileDropDown user={user} className='hidden md:block' />
            </>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button icon={<MdLogin />} btnText='Login' gradient className='w-40' />
            </Link>
          )}
          {/* Hamburger on mobile */}
          <HamburgerIcon onClick={() => setMobileMenu(!mobileMenu)} />
        </div>
      </div>
      {/* mobile menu */}
      {mobileMenu ? (
        <div className='pb-3 mobile-menu md:hidden'>
          {NAVBAR_LINKS?.map(item => {
            const LinkIcon = item.icon;
            return (
              <div
                key={item.name}
                onClick={() => {
                  setMobileMenu(false);
                  navigate(item.link);
                }}
                className={classnames('flex gap-2 py-2 text-sm border-b-[1px] hover:bg-gray-200', {
                  'opacity-20 pointer-events-none': !auth?.user?.activePlan || (item.isPremium && authActions.isUserOnFreePlan),
                })}
              >
                <LinkIcon className='w-5 h-5 fill-secondary-purple' aria-hidden='true' />
                {item.name}
              </div>
            );
          })}
          {address ? <Wallet /> : null}
          <div onClick={authActions.logout} className='flex gap-2 py-2 text-sm cursor-pointer hover:bg-gray-200 '>
            <MdLogout className='w-5 h-5 fill-secondary-purple' aria-hidden='true' />
            Logout
          </div>
          <Version />
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
