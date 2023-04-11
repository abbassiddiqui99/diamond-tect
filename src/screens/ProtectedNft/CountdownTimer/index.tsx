import Countdown from 'react-countdown';

const TimerItem: React.FC<{ value: number; text: 'Day' | 'Hour' | 'Minute' | 'Second' }> = ({ value, text }) => (
  <div className='flex items-end gap-1'>
    <span className='text-2xl font-semibold'>{value}</span>
    <span className='text-sm'>{`${text}${value > 0 ? 's' : ''}`}</span>
  </div>
);

const CountdownTimer: React.FC<{ time: Date | string | number }> = ({ time }) => {
  return (
    <div className='gap-2 flex-center'>
      Succession will take place after{' '}
      <Countdown
        date={time}
        renderer={({ days, hours, minutes, seconds, completed }) => (
          <>
            {!completed ? (
              <div className='flex gap-2'>
                <TimerItem value={days} text='Day' />
                <TimerItem value={hours} text='Hour' />
                <TimerItem value={minutes} text='Minute' />
                <TimerItem value={seconds} text='Second' />
              </div>
            ) : (
              <div>DONE</div>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CountdownTimer;
