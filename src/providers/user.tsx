import { useSetRecoilState } from 'recoil';

import { endpoints } from 'src/services/http/endpoints';
import { instance } from 'src/services/http/interceptor';
import { authUser } from './index';

export { useUserActions };

function useUserActions() {
  const setAuth = useSetRecoilState(authUser);
  // const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuth);

  async function send2FAEmail() {
    return await instance.get(endpoints.Send2FA);
  }

  async function toggle2FA(data: { otp: number }) {
    return await instance.post(endpoints.Toggle2FA, data).then(data => {
      setAuth(currentValue => ({
        ...currentValue,
        require2FA: data.data.require2FA,
      }));
    });
  }

  async function uploadImage(data: FormData) {
    return await instance.post(endpoints.uploadImage, data);
  }

  return {
    send2FAEmail,
    toggle2FA,
    uploadImage,
  };
}
