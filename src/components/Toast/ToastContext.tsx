import React, { createContext, memo, useCallback, useState } from 'react';

import ToastItem from './ToastItem';

const DEFAULT_DURATION = 3000;
const MemoToastItem = memo(ToastItem);

type ShowToastType = (
  message: string,
  type?: 'success' | 'error' | 'warning' | 'info' | 'notification',
  title?: string,
  duration?: number,
  autoHide?: boolean,
) => void;

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'notification';
  duration: number;
  title?: string;
  autoHide?: boolean;
};

export type ToastContextType = {
  showToast: ShowToastType;
  hideToast: (id: string) => void;
  hideAllToast: () => void;
};

export type ToastProviderType = { children: React.ReactNode };

let showToastRef: ShowToastType | null = null;

export const setShowToast = (fn: ShowToastType) => {
  showToastRef = fn;
};

export const showToast = (
  message: string,
  type?: 'success' | 'error' | 'warning' | 'info' | 'notification',
  title?: string,
  duration?: number,
  autoHide?: boolean,
) => {
  if (showToastRef) {
    showToastRef(message, type, title, duration, autoHide);
  } else {
    console.warn('showToast called before it was initialized');
  }
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const ToastProvider: React.FC<ToastProviderType> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' | 'notification' = 'info',
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

  React.useEffect(() => {
    setShowToast(showToast);
  }, [showToast]);

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
