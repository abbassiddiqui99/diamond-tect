import * as React from 'react';

let i = 0;
const LoadingText: React.FC<{ textArray: string[]; delay?: number }> = ({ textArray, delay = 6000 }) => {
  const [currentLoadingText, setCurrentLoadingText] = React.useState('');

  React.useEffect(() => {
    setInterval(() => {
      if (i !== textArray.length) {
        setCurrentLoadingText(textArray[i]);
        i += 1;
      } else {
        i = 0;
      }
    }, delay);

    return () => {
      clearInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p className='text-sm text-center'>{currentLoadingText}</p>;
};

export default LoadingText;
