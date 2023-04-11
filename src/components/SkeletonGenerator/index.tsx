import Card from 'src/components/Card';
import Loader from 'src/assets/svgs/Loader';
import Heading from 'src/components/Heading';
import Skeleton from 'src/components/Skeleton';
import { PROTECTED_ROUTES } from 'src/constant/NavigationConstant';

const SkeletonGenerator: React.FC<{ location: string }> = ({ location }) => {
  const currentRoute = `/${location.split('/')[1]}`;
  switch (currentRoute) {
    case PROTECTED_ROUTES.MINT_NFT:
      return <Skeleton type='MintForm' />;

    case PROTECTED_ROUTES.LIST_NFT:
      return (
        <div className='container mx-auto my-10'>
          <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Skeleton type='NftView' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
          </div>
        </div>
      );

    case PROTECTED_ROUTES.LOAD_NFT:
      return (
        <div className='container mx-auto my-10'>
          <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Skeleton type='NftView' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
          </div>
        </div>
      );

    case PROTECTED_ROUTES.PAYMENT:
      return (
        <div className='container mx-auto my-10'>
          <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Skeleton type='Plan' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
          </div>{' '}
        </div>
      );

    case PROTECTED_ROUTES.UPDATE_PAYMENT:
      return (
        <div className='container mx-auto my-10'>
          <div className='grid grid-cols-12 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Skeleton type='Plan' repeat={3} className='col-span-10 col-start-2 sm:col-auto' />
          </div>
        </div>
      );

    case PROTECTED_ROUTES.NOTIFICATION:
      return (
        <div className='grid grid-cols-12 sm:grid-cols-12 md:grid-cols-7 lg:grid-cols-10'>
          <div className='col-span-10 col-start-2 mt-10 mb-40 bg-white rounded-lg md:col-span-5 md:col-start-2 lg:col-span-6 lg:col-start-3'>
            <Heading type='subheading' text='Notifications' className='p-3 mb-0' />
            <div className='p-3 h-96'>
              <Skeleton type='Notification' repeat={3} />
            </div>
          </div>
        </div>
      );

    case `/${PROTECTED_ROUTES.TRADITIONAL.split('/')[1]}` || `/${PROTECTED_ROUTES.GASLESS.split('/')[1]}`:
      return (
        <div className='container mx-auto'>
          <Card className='mx-2 my-10'>
            <Skeleton type='Details' />
          </Card>
        </div>
      );
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <Loader color='white' />
    </div>
  );
};

export default SkeletonGenerator;
