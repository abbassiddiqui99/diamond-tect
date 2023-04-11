const Notification: React.FC = () => {
  return (
    <div className='flex gap-3 mb-3 animate-pulse'>
      <div className='flex items-center w-full gap-5'>
        <div className='w-10 h-10 rounded-full min-w-max bg-slate-300' />
        <div className='w-2/3 h-3 rounded-full bg-slate-300' />
      </div>
    </div>
  );
};

export default Notification;
