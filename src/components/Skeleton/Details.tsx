import Skeleton from 'src/components/Skeleton';

const Details: React.FC = () => (
  <div className='grid grid-cols-1 gap-6 animate-pulse lg:grid-cols-2'>
    <div className='h-[30rem] rounded-2xl bg-slate-300' />
    <div className='lg:ml-9'>
      <div className='h-10 mb-3 rounded-full bg-slate-300' />
      <div className='w-1/3 h-10 rounded-full bg-slate-300' />

      <div className='h-4 mt-20 rounded-lg bg-slate-300' />
      <div className='flex gap-4 my-3'>
        <div className='w-2/3 h-4 rounded-lg bg-slate-300' />
        <div className='w-full h-4 rounded-lg bg-slate-300' />
      </div>
      <div className='w-1/2 h-4 my-3 rounded-lg bg-slate-300' />
      <Skeleton type='History' />
    </div>
  </div>
);

export default Details;
