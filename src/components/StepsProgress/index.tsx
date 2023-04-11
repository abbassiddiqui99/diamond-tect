import classnames from 'classnames/bind';
interface StepsProgressType {
  steps: string[];
  index: number;
}

const StepsProgress: React.FC<StepsProgressType> = ({ steps, index }) => {
  return (
    <div className='p-4 space-y-2'>
      <h3 className='text-base font-semibold'>
        Step {index + 1}: {steps[index]}
      </h3>
      <div className='flex space-x-3'>
        {steps?.map((item, idx) => (
          <span
            key={`${item}_${idx}`}
            className={classnames('w-full h-2 rounded-sm', {
              'bg-gray-300': idx > index,
              'primary-gradient': idx < index,
              'primary-gradient animate-pulse': idx === index,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsProgress;
