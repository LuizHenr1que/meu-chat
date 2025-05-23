import { useEffect, useState } from 'react';

type ToastType = 'success' | 'info' | 'error';

interface ToastAlertProps {
  message: string;
  type?: ToastType;
  duration?: number; 
  onClose?: () => void;
}

const colors = {
  success: 'bg-green-200 text-green-800 border-green-300',
  info: 'bg-blue-200 text-blue-800 border-blue-300',
  error: 'bg-red-200 text-red-800 border-red-300',
};

export default function ToastAlert({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastAlertProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 max-w-xs px-4 py-3 rounded-md border
        shadow-md
        transform transition-all duration-300 ease-in-out
        ${colors[type]}
        ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
      `}
      role="alert"
    >
      {message}
    </div>
  );
}
