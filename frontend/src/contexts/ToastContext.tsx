'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { ApiError } from '@/lib/api-error';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  retryAction?: () => void;
  retryLabel?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showError: (error: unknown, context?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration (default 5 seconds)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback(
    (error: unknown, context?: string) => {
      let title = 'Error';
      let message = 'An unexpected error occurred';
      let retryAction: (() => void) | undefined;
      let retryLabel: string | undefined;
      let duration = 4000; // Longer duration for errors (12 seconds instead of 8)

      if (error instanceof ApiError) {
        message = error.getUserFriendlyMessage();

        if (error.isRateLimit) {
          title = 'Rate Limit Exceeded';
          if (error.isAuth) {
            title = 'Account Temporarily Locked';
          }
          duration = 0; // Don't auto-dismiss rate limit errors
        } else if (error.isAuth) {
          title = 'Authentication Error';
        } else if (error.isUpload) {
          title = 'Upload Error';
        } else if (error.isCors) {
          title = 'Connection Error';
        }

        // Add retry functionality for retryable errors
        if (error.retryAfter && error.retryAfter > 0) {
          retryLabel = `Retry in ${error.retryAfter}s`;
          duration = 0; // Don't auto-dismiss
        }
      } else if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      if (context) {
        title = `${title} - ${context}`;
      }

      addToast({
        type: 'error',
        title,
        message,
        duration,
        retryAction,
        retryLabel,
      });
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message: string, title = 'Success') => {
      addToast({
        type: 'success',
        title,
        message,
        duration: 4000,
      });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message: string, title = 'Warning') => {
      addToast({
        type: 'warning',
        title,
        message,
        duration: 6000,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, title = 'Info') => {
      addToast({
        type: 'info',
        title,
        message,
        duration: 5000,
      });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showError,
        showSuccess,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
