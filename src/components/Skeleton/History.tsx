const History: React.FC = () => (
  <div className='flex p-4 space-x-4 animate-pulse'>
    <div className='w-10 h-10 rounded-full bg-slate-300' />
    <div className='flex-1 py-1 space-y-6'>
      <div className='space-y-3'>
        <div className='w-1/2 h-2 rounded bg-slate-300' />
        <div className='w-2/3 h-2 col-span-2 rounded bg-slate-300' />
      </div>
    </div>
  </div>
);

export default History;
