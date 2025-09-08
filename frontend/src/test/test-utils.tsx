import React from 'react';
import { render } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';
import ToastContainer from '@/components/Toast/ToastContainer';

// Custom render function that includes the ToastProvider and ToastContainer
export function renderWithToastProvider(ui: React.ReactElement, options = {}) {
  return render(
    <ToastProvider>
      {ui}
      <ToastContainer />
    </ToastProvider>,
    options
  );
}

// Re-export everything else from @testing-library/react
export * from '@testing-library/react';
