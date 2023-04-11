import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { createLoadingToast, dismissToast, showToast, updateToast } from 'src/utils/Toast';

function useOnSubmit<TValues>(
  action: (values: TValues) => Promise<void> | Promise<AxiosResponse<unknown, unknown>>,
  onSuccess?: (data: unknown) => void,
  showLoadingToast?: boolean,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (values: TValues) => {
    let toastId = null;
    if (showLoadingToast) toastId = createLoadingToast();

    setLoading(true);
    setError('');

    try {
      const response = await action(values);
      onSuccess?.(response);
      if (toastId) dismissToast(toastId);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (process.env.NODE_ENV !== 'production') console.error(e?.message || e?.response?.data?.error);
      setError(e?.message || e?.response?.data?.error);
      if (toastId) {
        updateToast({ id: toastId, message: e?.response?.data?.error });
      } else {
        showToast({ message: e?.response?.data?.error, type: 'error' });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, onSubmit };
}

export default useOnSubmit;
