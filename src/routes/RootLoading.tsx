import Skeleton from 'src/components/Skeleton';
import Header from 'src/components/Skeleton/Header';

const RootLoading: React.FC = () => {
  return (
    <>
      <Header />
      <div className='container mx-auto my-10'>
        {/* Mint Cards */}
        <div className='grid grid-cols-12 gap-4 mt-10 mb-10 md:grid-cols-8 lg:grid-cols-10'>
          <div className='h-full col-span-10 col-start-2 md:col-span-4 md:col-start-1 lg:col-span-4 lg:col-start-2'>
            <Skeleton type='MintCard' />
          </div>
          <div className='h-full col-span-10 col-start-2 md:col-span-4 lg:col-span-4'>
            <Skeleton type='MintCard' />
          </div>
        </div>
        {/* Feed */}
        <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Skeleton type='NftView' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
        </div>
      </div>
    </>
  );
};

export default RootLoading;
