const Plan: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`overflow-hidden rounded-2xl h-96 animate-pulse bg-slate-100 ${className}`}>
      <div className='h-20 bg-slate-300' />
      <div className='w-3/4 h-5 mx-auto my-3 rounded-full bg-slate-300' />
      <div className='px-10'>
        <div className='w-full h-2 mt-5 mb-3 rounded-full bg-slate-300' />
        <div className='w-3/4 h-2 my-3 rounded-full bg-slate-300' />
        <div className='w-1/3 h-2 mt-3 mb-5 rounded-full bg-slate-300' />
        <div className='flex items-center gap-3 my-3'>
          <div className='w-6 h-6 rounded-full bg-slate-300' />
          <div className='w-1/3 h-2 rounded-full bg-slate-300' />
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-6 h-6 rounded-full bg-slate-300' />
          <div className='w-1/3 h-2 rounded-full bg-slate-300' />
        </div>
        <div className='w-1/2 h-10 mx-auto mt-10 rounded-full bg-slate-300' />
      </div>
    </div>
  );
};

export default Plan;
