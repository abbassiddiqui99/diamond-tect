const NftView: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-lg animate-pulse bg-slate-100 ${className}`}>
    <div className='h-64 m-5 rounded-lg bg-slate-300' />
    <div className='p-4'>
      <div className='w-1/2 h-2 mb-3 rounded bg-slate-300' />
      <div className='w-2/3 h-2 rounded bg-slate-300' />
    </div>
  </div>
);

export default NftView;
