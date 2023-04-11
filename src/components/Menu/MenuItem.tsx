import * as React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';

interface MenuItemProps {
  to?: string;
  title?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ to, title, children }) => {
  return (
    <Menu.Item as={React.Fragment}>
      {({ active }) => (
        <div className='flex-center'>
          {children || (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <Link to={to!} className={`${active ? 'text-black text-center' : 'opacity-50 text-black text-center'}`}>
              {title}
            </Link>
          )}
        </div>
      )}
    </Menu.Item>
  );
};

export default MenuItem;
