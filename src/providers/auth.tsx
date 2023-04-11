import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import { endpoints } from 'src/services/http/endpoints';
import { authInstance } from 'src/services/http/authApi';
import { IToken, PLAN_TYPE, SignUpData } from 'src/types';
import { IFormInput, RESEND_EMAIL_TYPE } from 'src/types/auth';
import { PROTECTED_ROUTES, ROUTES } from 'src/constant/NavigationConstant';
import { Email, authUser, resetToken, walletChain, walletNetwork, walletAddress, isAuthenticated, resendTimer } from 'src/providers/index';

export { useAuthActions };

function useAuthActions() {
  const navigate = useNavigate();
  const setTimer = useSetRecoilState(resendTimer);

  const [email, setEmail] = useRecoilState(Email);
  const [auth, setAuth] = useRecoilState(authUser);
  const [ResetToken, setResetToken] = useRecoilState(resetToken);
  // Set function only
  const setIsAuthenticated = useSetRecoilState(isAuthenticated);
  // Reset on condition
  const resetEmail = useResetRecoilState(Email);
  const resetTempToken = useResetRecoilState(resetToken);
  // Reset State on logOut
  const resetAuth = useResetRecoilState(authUser);
  const resetIsAuth = useResetRecoilState(isAuthenticated);
  const resetWalletChain = useResetRecoilState(walletChain);
  const resetWalletAddress = useResetRecoilState(walletAddress);
  const resetWalletNetwork = useResetRecoilState(walletNetwork);

  const isUserOnFreePlan = useMemo(() => auth?.user?.activePlan?.type === PLAN_TYPE.FREE, [auth?.user?.activePlan?.type]);

  async function login(obj: IFormInput) {
    return authInstance.post(endpoints.Login, obj).then(({ data }: { data: IToken }) => {
      setAuth(data);
      if (data.require2FA) {
        setTimer(30);
        navigate(ROUTES.VERIFY_OTP);
      } else if (!data.user?.isEmailVerified) {
        setTimer(30);
        navigate(ROUTES.VERIFY_EMAIL);
      } else {
        setIsAuthenticated(true);
        navigate(PROTECTED_ROUTES.ROOT);
      }
    });
  }

  // signup
  async function register(obj: SignUpData) {
    return authInstance.post(endpoints.Signup, obj).then(({ data }) => {
      setAuth(data);
    });
  }

  async function verifyEmail(otp: number) {
    return authInstance
      .post(endpoints.VerifyEmail, {
        email: auth?.user?.email,
        otp,
      })
      .then(() => {
        setIsAuthenticated(true);
      });
  }

  async function resendEmail(type: RESEND_EMAIL_TYPE) {
    authInstance.post(endpoints.resendEmail, {
      email: auth?.user?.email,
      type,
    });
  }

  async function forgotPassword(data: { email: string }) {
    return authInstance.post(endpoints.ForgotPassword, data).then(() => {
      // save the email in the local storage temporary for forgotpassword flow
      setEmail(data.email);
    });
  }

  async function verifyOTP(otp: number) {
    return authInstance
      .post(endpoints.VerifyOTP, {
        email,
        otp,
      })
      .then(({ data }) => {
        // set resetoken to sent back in reset password api
        setResetToken(data.accessToken);
        resetEmail();
      });
  }

  async function resetPassword(data: { newpassword: string }) {
    return authInstance
      .post(endpoints.ResetPassword, data, {
        headers: {
          Authorization: `Bearer ${ResetToken}`,
        },
      })
      .then(() => {
        resetTempToken();
      });
  }

  async function verifyTwoFA(otp: number) {
    return authInstance
      .post(
        endpoints.Login2FA,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        },
      )
      .then(({ data }) => {
        setAuth(data);
        setIsAuthenticated(true);
      });
  }

  function logout() {
    const cachedProviderName = JSON.parse(localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER') as string);
    if (cachedProviderName) {
      localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
    }
    resetAuth();
    resetIsAuth();
    resetWalletChain();
    resetWalletAddress();
    resetWalletNetwork();
  }

  return {
    login,
    logout,
    register, // signup
    verifyOTP,
    resendEmail,
    verifyTwoFA,
    verifyEmail,
    isUserOnFreePlan,
    resetPassword,
    forgotPassword,
  };
}
