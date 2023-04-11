import * as React from 'react';
import { useQuery } from '@apollo/client';
import { createLoadingToast, dismissToast, updateToast } from 'src/utils/Toast';

import OTP from 'src/components/OTP';
import { PROFILE_TYPE } from 'src/types';
import Loader from 'src/assets/svgs/Loader';
import Heading from 'src/components/Heading';
import { GET_USER_QUERY } from 'src/graphql/query';
import PopupModal from 'src/components/PopupModal';
import { useUserActions } from 'src/providers/user';
import SwitchButton from 'src/components/SwitchButton';

const TwoFA: React.FC = () => {
  const { loading, data } = useQuery(GET_USER_QUERY, {
    fetchPolicy: 'network-only',
  });
  const userActions = useUserActions();
  const [showOTP, setShowOTP] = React.useState(false);
  const [is2FaEnabled, setIs2FaEnabled] = React.useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = React.useState(false);

  const getProfileSettingObj = (profileSetting: { type: string; status: string }[]) =>
    profileSetting.find(item => item.type === PROFILE_TYPE.TWO_FACTOR_AUTH);

  React.useEffect(() => {
    if (data) {
      const getStatus = getProfileSettingObj(data?.getUser?.profileSetting);
      setIs2FaEnabled(getStatus?.status === PROFILE_TYPE.ACTIVE);
    }
  }, [data]);

  const sendOTP = async () => {
    const toastId = createLoadingToast();
    try {
      setIsBtnDisabled(true);
      await userActions.send2FAEmail();
      dismissToast(toastId);
      setShowOTP(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      updateToast({ id: toastId, message: error?.response?.data?.error });
    } finally {
      setIsBtnDisabled(false);
    }
  };

  const onSubmit = async (otp: number) => {
    const toastId = createLoadingToast();
    try {
      await userActions.toggle2FA({ otp });
      dismissToast(toastId);
      setShowOTP(false);
      setIs2FaEnabled(!is2FaEnabled);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      updateToast({ id: toastId, message: error?.response?.data?.error });
    }
  };

  return (
    <>
      <div className='flex-between'>
        <Heading text='Two Factor Authentication' type='subheading' className='mb-0 text-center sm:text-left' />
        {loading ? <Loader /> : <SwitchButton disabled={isBtnDisabled} enabled={is2FaEnabled} onChange={sendOTP} />}
      </div>
      <PopupModal show={showOTP} closeBtn persistent onClose={() => setShowOTP(false)}>
        <OTP onSave={onSubmit} disabled={isBtnDisabled} />
      </PopupModal>
    </>
  );
};

export default TwoFA;
