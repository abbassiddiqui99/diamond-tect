const FeedNFT: React.FC = () => (
  <div className={`h-400 animate-pulse bg-slate-100 p-10 rounded-3xl shadow-2xl`}>
    <div className='px-10'>
      <div className='flex gap-3 my-3 flex-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-slate-300' />
          <div className='h-2 rounded-full w-30 bg-slate-300' />
        </div>
        <div className='w-10 h-10 rounded-full bg-slate-300' />
      </div>
      <div className='w-2/1.5 h-40 mx-auto mt-10 rounded-2xl bg-slate-300' />
      <div className='flex-col gap-3 mt-10 flex-center'>
        <div className='w-20 h-2 rounded-full bg-slate-300' />
        <div className='w-32 h-2 rounded-full bg-slate-300' />
        <div className='w-20 h-2 rounded-full bg-slate-300' />
      </div>
    </div>
  </div>
);

export default FeedNFT;
