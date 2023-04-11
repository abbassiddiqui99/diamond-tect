import Card from 'src/components/Card';

const MintForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-12 md:grid-cols-7 lg:grid-cols-10 '>
      <div className='mt-10 mb-40 sm:col-span-10 sm:col-start-2 md:col-span-5 md:col-start-2 lg:col-span-6 lg:col-start-3'>
        <Card className='roundednone sm:rounded-2xl'>
          <div className={`overflow-hidden rounded-2xl animate-pulse${className}`}>
            <div className='w-1/3 h-10 m\my-3 rounded-full bg-slate-300' />
            <div className='w-1/4 h-5 mt-12 rounded-full bg-slate-300' />
            <div className='h-48 mt-4 rounded-2xl bg-slate-300' />

            <div className='w-1/12 h-5 mt-10 rounded-full bg-slate-300' />

            <div className='flex mt-5'>
              <div className='w-1/4 h-5 rounded-full bg-slate-300' />
              <div className='w-1/4 h-5 ml-3 rounded-full bg-slate-300' />
            </div>

            <div className='w-1/5 h-5 mt-10 rounded-full bg-slate-300' />
            <div className='h-10 mt-6 rounded-full bg-slate-300' />

            <div className='w-1/5 h-5 mt-10 rounded-full bg-slate-300' />
            <div className='mt-6 h-36 rounded-2xl bg-slate-300' />

            <div className='grid grid-cols-2 gap-4 mt-5 h-96 md:grid-cols-3'>
              <div className='p-3 cursor-pointer bg-slate-300 rounded-3xl'></div>
              <div className='p-3 cursor-pointer bg-slate-300 rounded-3xl'></div>
              <div className='p-3 cursor-pointer bg-slate-300 rounded-3xl'></div>
              <div className='p-3 cursor-pointer bg-slate-300 rounded-3xl'></div>
              <div className='p-3 cursor-pointer bg-slate-300 rounded-3xl'></div>
              <div className='p-3 cursor-pointer bg-slate-300 rounded-3xl'></div>
            </div>

            <div className='w-1/5 h-5 mt-10 rounded-full bg-slate-300' />
            <div className='h-10 mt-6 rounded-full bg-slate-300' />

            <div className='flex justify-end mt-10'>
              <div className='w-1/6 h-10 ml-3 rounded-full bg-slate-300' />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MintForm;
