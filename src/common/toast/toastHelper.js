import { toast } from 'react-toastify';

export const tSuccess = (id, message) => {
  toast.update(id, { render: message, type: 'success', isLoading: false, autoClose: 2500, closeOnClick: true, draggable: true });
};

export const tError = (id, message) => {
  toast.update(id, { render: message, type: 'error', isLoading: false, autoClose: 7500, closeOnClick: true, draggable: true });
};