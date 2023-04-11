import { toast } from 'react-toastify';

interface toastType {
  id?: React.ReactText;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'default';
}

// Well this toast function is not perfect because i didn't whether we use it permanently or have make our own.
export const createLoadingToast = (message?: string) => {
  return toast.loading(message || 'Loading...');
};

export const dismissToast = (id: React.ReactText) => {
  toast.dismiss(id);
};

export const updateToast = (props: toastType) => {
  if (props.id) {
    toast.update(props.id, {
      render: props.message || 'Oh! something went wrong...',
      type: props.type || 'error',
      isLoading: false,
      closeOnClick: true,
      hideProgressBar: false,
      autoClose: 5000,
      closeButton: true,
    });
  }
};

export const showToast = (props: toastType) => {
  toast(props.message || 'Oh! something went wrong...', {
    type: props.type,
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton: true,
  });
};
