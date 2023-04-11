const Dots: React.FC<{ className?: string }> = ({ className = '' }) => {
  const circleOne: React.CSSProperties = {
    animationDelay: '0.1s',
  };
  const circleTwo: React.CSSProperties = {
    animationDelay: '0.2s',
  };
  const circleThree: React.CSSProperties = {
    animationDelay: '0.3s',
  };
  return (
    <div className={`flex-center mt-10 gap-4 animate-pulse col-span-12 ${className}`}>
      <div style={circleOne} className='w-4 h-4 rounded-full bg-slate-400 animate-bounce' />
      <div style={circleTwo} className='w-4 h-4 rounded-full bg-slate-400 animate-bounce' />
      <div style={circleThree} className='w-4 h-4 rounded-full bg-slate-400 animate-bounce' />
    </div>
  );
};

export default Dots;
