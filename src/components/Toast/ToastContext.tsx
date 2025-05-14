import React, { createContext, memo, useCallback, useState } from 'react';

import ToastItem from './ToastItem';

const DEFAULT_DURATION = 3000;
const MemoToastItem = memo(ToastItem);

export type ToastContextType = {
  showToast: (
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    title?: string,
    duration?: number,
    autoHide?: boolean,
  ) => void;
  hideToast: (id: string) => void;
  hideAllToast: () => void;
};

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  title?: string;
  autoHide?: boolean;
};

export type ToastProviderType = { children: React.ReactNode };

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const ToastProvider: React.FC<ToastProviderType> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      title?: string,
      duration = DEFAULT_DURATION,
      autoHide = true,
    ) => {
      const newToast: Toast = {
        id: Math.random().toString(36),
        message,
        type,
        duration,
        autoHide,
        title,
      };
      setToasts(current => [newToast, ...current]);
    },
    [],
  );

  const hideToast = useCallback((id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  const hideAllToast = useCallback(() => {
    setToasts([]);
  }, []);

  const renderItem = (toast: Toast, index: number) => (
    <MemoToastItem
      key={toast.id}
      index={index}
      duration={toast.duration}
      title={toast.title}
      message={toast.message}
      type={toast.type}
      onHide={() => hideToast(toast.id)}
    />
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAllToast }}>
      {children}
      {toasts.map(renderItem)}
    </ToastContext.Provider>
  );
};
