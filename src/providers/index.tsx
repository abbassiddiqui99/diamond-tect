import { atom, AtomEffect } from 'recoil';
import { LOCAL_CONSTANT } from 'src/constant/LocalConstant';
import { IToken, NFTType } from 'src/types';

const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key: string) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

// access token of verify otp forgotpassword flow
export const resetToken = atom({
  key: 'resetToken',
  default: null,
  effects: [localStorageEffect(LOCAL_CONSTANT.RESET_TOKEN)],
});

// timer save on local storage if user refresh we still get updated time
export const resendTimer = atom({
  key: 'resendTimer',
  default: 30,
  effects: [localStorageEffect(LOCAL_CONSTANT.RESEND_TIMER)],
});

export const authUser = atom<IToken | null>({
  key: 'user',
  default: null,
  // get initial state from local storage to enable user to stay logged in
  effects: [localStorageEffect(LOCAL_CONSTANT.USER)],
});

export const isAuthenticated = atom({
  key: 'isAuthenticated',
  default: false,
  effects: [localStorageEffect(LOCAL_CONSTANT.IS_AUTH)],
});

// temporary save email in local strorage for forgotpassword flow
export const Email = atom({
  key: 'Email',
  default: '',
  effects: [localStorageEffect(LOCAL_CONSTANT.EMAIL)],
});

export const walletAddress = atom({
  key: 'walletAddress',
  default: '',
});

export const walletNetwork = atom({
  key: 'walletNetwork',
  default: '',
});

export const walletChain = atom({
  key: 'walletChain',
  default: '',
});

export const notificationsBadge = atom({
  key: 'notificationsBadge',
  default: false,
});

// Save nft data when user clicks on any nft card
export const nftTypeDataToRemint = atom<NFTType | null>({
  key: 'nftTypeDataToRemint',
  default: null,
});
