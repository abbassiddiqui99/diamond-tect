import classnames from 'classnames/bind';

interface ProgressBarType {
  progress: string | number;
  animate?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarType> = ({ progress, animate, className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}>
      <div
        className={classnames('bg-secondary-blue h-2.5 rounded-full', {
          'animate-pulse': animate,
        })}
        style={{ width: `${progress}%`, transition: 'width 1s' }}
      ></div>
    </div>
  );
};

export default ProgressBar;
