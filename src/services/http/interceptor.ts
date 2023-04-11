import axios from 'axios';

import config from 'src/config.env/index';
import { showToast } from 'src/utils/Toast';
import { LOCAL_CONSTANT } from 'src/constant/LocalConstant';

export const axiosObj = {
  baseURL: `${config.BASE_URL}`,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const instance = axios.create(axiosObj);

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(LOCAL_CONSTANT.USER);
    const userToken = token ? JSON.parse(token) : null;
    if (config && config.headers) {
      config.headers.Authorization = userToken?.accessToken ? `Bearer ${userToken?.accessToken}` : '';
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => response,
  error => {
    switch (error.response?.status) {
      case 401: {
        localStorage.clear();
        window.location.reload();
        localStorage.setItem('sessionMessage', 'Your session has expired. Please sign-in again.');
        return Promise.reject(error);
      }
      case 403: {
        setTimeout(() => {
          showToast({ type: 'warning', message: 'You have reached the limit of this Plan, For queries visit payment plan page' });
        }, 100);
        return Promise.reject(error);
      }
      default: {
        return Promise.reject(error);
      }
    }
  },
);
