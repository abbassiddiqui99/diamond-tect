import Card from 'src/components/Card';

const MintCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Card className='h-full flex-center'>
    <div className={`flex-col gap-5 animate-pulse flex-center ${className}`}>
      <div className='w-20 h-20 rounded-full bg-slate-300' />
      <div className='w-64 h-4 rounded-full bg-slate-300' />
      <div className='w-40 h-10 mb-5 rounded-full bg-slate-300' />
    </div>
  </Card>
);

export default MintCard;
