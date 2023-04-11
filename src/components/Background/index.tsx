const Background = () => {
  return (
    <div className='fixed w-full h-full bg-gray-200 -z-20 blur-[300px]'>
      {/* Circle One */}
      <div className='-mt-40 -ml-24 rounded-full w-96 bg-secondary-cyan h-96 -z-10 ' />
      <div className='flex justify-between'>
        {/* Circle Two */}
        <div className='mt-20 -m-40 rounded-full w-80 bg-secondary-purple h-80 ' />
        {/* Circle Three */}
        <div className='w-56 h-56 ml-32 rounded-full bg-secondary-blue ' />
        {/* Circle Four */}
        <div className='rounded-full bg-secondary-cyan w-[30rem] h-[30rem] ' />
      </div>
    </div>
  );
};

export default Background;
