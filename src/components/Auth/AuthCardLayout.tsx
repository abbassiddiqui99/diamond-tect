import Card from 'src/components/Card';
import Heading from 'src/components/Heading';
import { ReactComponent as Logo } from 'src/assets/svgs/HeeraLogo.svg';

const AuthCardLayout: React.FC<{ heading: string }> = ({ children, heading }) => {
  return (
    <div className='mt-10 auth-grid'>
      <div className='auth-grid-col'>
        <Card>
          <Logo className='mx-auto w-52 sm:m-0' />
          <Heading text={heading} className='mt-10 text-center sm:text-left' />
          {children}
        </Card>
      </div>
    </div>
  );
};

export default AuthCardLayout;
