import { TiThMenu } from 'react-icons/ti';
import Logo from 'src/components/Logo';

const Header: React.FC = () => (
  <div className='px-4 mx-auto bg-white shadow-lg sm:px-8 sm:mt-10 sm:rounded-2xl sm:container'>
    <div className='flex justify-between'>
      <Logo />
      <div className='flex justify-end w-full gap-2 my-5 animate-pulse'>
        <div className='w-1/3 rounded-full md:w-32 bg-slate-300' />
        <div className='hidden w-10 rounded-full md:block bg-slate-300' />
        <div className='hidden w-1/3 rounded-full md:flex md:w-32 flex-end bg-slate-300' />
        <div className='flex-center text-slate-300 md:hidden'>
          <TiThMenu size={24} />
        </div>
      </div>
    </div>
  </div>
);

export default Header;
