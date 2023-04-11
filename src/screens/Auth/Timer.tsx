import * as React from 'react';
import { useRecoilState } from 'recoil';
import classnames from 'classnames/bind';

import { resendTimer } from 'src/providers';

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

const Timer = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => {
  const [timer, setTimer] = useRecoilState(resendTimer);

  React.useEffect(() => {
    const interval = setInterval(() => setTimer(timer - 1), 1000);

    if (timer < 1) clearInterval(interval);
    return () => clearInterval(interval);
  }, [setTimer, timer]);

  const resetTimer = () => {
    onClick();
    setTimer(30);
  };

  const isDisabled = disabled || timer > 0;

  return (
    <div className='text-sm text-center'>
      00:{zeroPad(timer, 2)}{' '}
      <button
        onClick={resetTimer}
        disabled={isDisabled}
        className={classnames(` font-semibold ${isDisabled ? 'text-gray-500' : 'text-secondary-blue'} `)}
      >
        {' Re-Send Code'}
      </button>
    </div>
  );
};

export default Timer;
