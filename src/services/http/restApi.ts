import axios from 'axios';
import { endpoints } from 'src/services/http/endpoints';
import { instance } from 'src/services/http/interceptor';
import { SMALL_IMG_ERROR } from 'src/constant/commonConstants';

interface PaymentData {
  stripeToken: string;
  customerEmail: string;
  subscriptionPlanId: string;
  cardholderName: string;
}

interface OneTimePaymentData {
  stripeToken: string;
  assetId: string;
  customerEmail: string;
  cardholderName: string;
  lossPrevention: boolean;
  successionManagement: boolean;
}

export const getPlans = async () => {
  const response = await instance.get(endpoints.plans);
  return response;
};

export const subscriptionFreePlan = async () => {
  const response = await instance.get(endpoints.freePlan);
  return response;
};

export const stripePayment = async (data: PaymentData) => {
  return instance.post(endpoints.fiat, data);
};
export const stripeProtectionOneTimePayment = async (data: OneTimePaymentData) => {
  return instance.post(endpoints.protectionOneTimePayment, data);
};

export const checkUniqueness = async (imgArray: string[]) => {
  try {
    const response = await instance.post(`${endpoints.checkUniqueness}`, { imagesUrl: imgArray });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.response?.data?.error === SMALL_IMG_ERROR) {
      throw new Error(err?.response?.data?.error);
    }
    if (err?.response?.data?.status === 403 || err?.response?.data?.status === 401) {
      throw new Error(err?.response?.data?.status);
    }
    throw new Error(err);
  }
};

export const onDemandUniqueness = async (imgUrl: string, assetId: string) => {
  try {
    const response = await instance.get(`${endpoints.onDemandUniqueness}?assetUrl=${imgUrl}&assetId=${assetId}`);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.response?.data?.status === 403 || err?.response?.data?.status === 401) {
      throw new Error(err?.response?.data?.status);
    }
    throw new Error(err);
  }
};

export const getResolvedAssetUrl = async (animation_url: string): Promise<string> => {
  try {
    const response = await axios.get(animation_url);
    return response.request?.responseURL;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err);
  }
};
