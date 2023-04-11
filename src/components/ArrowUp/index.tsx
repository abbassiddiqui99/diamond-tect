import { AiOutlineArrowUp } from 'react-icons/ai';

const ArrowUp: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className='fixed z-40 inline-block p-2 bg-white border-2 rounded-full shadow-2xl cursor-pointer bottom-10 right-5 md:right-20 lg:right-10'
      onClick={scrollToTop}
    >
      <AiOutlineArrowUp height={28} width={30} />
    </div>
  );
};

export default ArrowUp;
