'use client';

import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

// Enhanced loading component for lazy loaded components
const LoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div
    className="flex items-center justify-center p-8"
    role="status"
    aria-label="Loading"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    <span className="ml-2 text-gray-600">{text}</span>
    <span className="sr-only">Loading...</span>
  </div>
);

// Enhanced error boundary wrapper for lazy components
const LazyErrorBoundary = ({
  children,
  componentName = 'Component',
}: {
  children: React.ReactNode;
  componentName?: string;
}) => (
  <ErrorBoundary
    fallback={
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-600 text-2xl mb-2">⚠️</div>
        <h3 className="text-red-800 font-semibold mb-2">
          Failed to load {componentName}
        </h3>
        <p className="text-red-600 text-sm">
          Please refresh the page to try again
        </p>
      </div>
    }
    onError={(error, errorInfo) => {
      console.error(`Lazy ${componentName} error:`, error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

// Higher-order component for lazy loading with enhanced error handling
const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loadingText?: string;
    ssr?: boolean;
    componentName?: string;
  } = {}
) => {
  const { loadingText, ssr = false, componentName = 'Component' } = options;

  return dynamic(importFunc, {
    loading: () => (
      <LoadingSpinner text={loadingText || `Loading ${componentName}...`} />
    ),
    ssr,
  });
};

// Lazy loaded components with optimized loading and error handling
export const LazyIncidentList = withLazyLoading(
  () => import('@/components/IncidentList/IncidentList'),
  {
    ssr: false,
    componentName: 'Incident List',
  }
);

export const LazyIncidentForm = withLazyLoading(
  () => import('@/components/IncidentForm/IncidentForm'),
  {
    ssr: false,
    componentName: 'Incident Form',
  }
);

export const LazyIncidentEditForm = withLazyLoading(
  () => import('@/components/IncidentEditForm/IncidentEditForm'),
  {
    ssr: false,
    componentName: 'Edit Form',
  }
);

// Enhanced lazy wrapper component with Suspense and Error Boundary
export const LazyWrapper = ({
  children,
  fallback = <LoadingSpinner />,
  componentName = 'Component',
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}) => (
  <Suspense fallback={fallback}>
    <LazyErrorBoundary componentName={componentName}>
      {children}
    </LazyErrorBoundary>
  </Suspense>
);

// Pre-load functions for important routes
export const preloadComponents = {
  incidentList: () => import('@/components/IncidentList/IncidentList'),
  incidentForm: () => import('@/components/IncidentForm/IncidentForm'),
  incidentEditForm: () =>
    import('@/components/IncidentEditForm/IncidentEditForm'),
};

// Component for critical above-the-fold content (not lazy loaded)
export const CriticalContent = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="critical-content">{children}</div>;
