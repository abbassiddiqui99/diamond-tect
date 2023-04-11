import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';

import Timer from './Timer';
import OTP from 'src/components/OTP';
import Card from 'src/components/Card';
import { authUser } from 'src/providers';
import useOnSubmit from 'src/hooks/useOnSubmit';
import { RESEND_EMAIL_TYPE } from 'src/types/auth';
import { useAuthActions } from 'src/providers/auth';
import { ROUTES } from 'src/constant/NavigationConstant';

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const authActions = useAuthActions();
  // get it from auth
  const auth = useRecoilValue(authUser);
  const { onSubmit: verifyOTP, loading } = useOnSubmit(authActions.verifyOTP);
  const { onSubmit: verifyTwoFA, loading: verifyTwoFALoading } = useOnSubmit(authActions.verifyTwoFA);
  const { onSubmit: onResendEmail, loading: resendEmailLoading } = useOnSubmit(authActions.resendEmail);

  // authUser
  const disabled = loading || verifyTwoFALoading || resendEmailLoading;

  const onSubmit = async (otp: number) => {
    if (auth?.require2FA) {
      await verifyTwoFA(otp);
    } else {
      const success = await verifyOTP(otp);
      if (success) navigate(ROUTES.RESET_PASSWORD);
    }
  };

  const resendEmail = async () => {
    if (auth?.require2FA) {
      await onResendEmail(RESEND_EMAIL_TYPE.Login2FA);
    } else {
      await onResendEmail(RESEND_EMAIL_TYPE.ResetPassword);
    }
  };

  return (
    <div className='mt-10 auth-grid'>
      <div className='auth-grid-col'>
        <Card title='Verify'>
          <OTP onSave={onSubmit} disabled={disabled} />
          <Timer
            disabled={disabled}
            onClick={() => {
              resendEmail();
            }}
          />
          <Link
            to={ROUTES.LOGIN}
            className={classNames('text-sm text-gray-500 flex-center hover:text-gray-800', {
              'pointer-events-none': disabled,
            })}
          >
            Back to Login
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;
