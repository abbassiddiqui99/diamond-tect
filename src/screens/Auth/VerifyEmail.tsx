import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { MdLogin } from 'react-icons/md';

import OTP from 'src/components/OTP';
import Card from 'src/components/Card';
import { authUser } from 'src/providers';
import useOnSubmit from 'src/hooks/useOnSubmit';
import { useAuthActions } from 'src/providers/auth';
import { RESEND_EMAIL_TYPE } from 'src/types/auth';
import Heading from 'src/components/Heading';
import Timer from 'src/screens/Auth/Timer';

const VerifyEmail = () => {
  const authActions = useAuthActions();
  const auth = useRecoilValue(authUser);
  const navigate = useNavigate();
  const { onSubmit } = useOnSubmit(authActions.verifyEmail);
  const { onSubmit: onResendEmail, loading } = useOnSubmit(authActions.resendEmail);

  const onBackToLogin = () => {
    authActions.logout();
    navigate('/login');
  };

  return (
    <div className='mt-10 auth-grid'>
      <div className='auth-grid-col'>
        <Card>
          <div onClick={onBackToLogin} className='flex items-center mb-5 cursor-pointer'>
            <div>
              <MdLogin />
            </div>
            <p className='ml-1 font-semibold'>Back to login</p>
          </div>

          <Heading text='Verify' />
          {auth?.user?.email ? (
            <p className='text-center'>
              We have sent an email on <span className='font-semibold'>{auth.user.email}</span>
            </p>
          ) : null}
          <OTP onSave={onSubmit} btnText='Verify Email' disabled={loading} />
          <Timer disabled={loading} onClick={() => onResendEmail(RESEND_EMAIL_TYPE.VerifyEmail)} />
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
