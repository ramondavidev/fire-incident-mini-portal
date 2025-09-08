import React, { memo } from 'react';

// Loading State Component
export const LoadingState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200"></div>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent absolute top-0 left-0"></div>
    </div>
    <div className="mt-4 flex items-center text-gray-600">
      <svg
        className="w-5 h-5 mr-2 text-red-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-medium">Loading incidents...</span>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Error State Component
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = memo<ErrorStateProps>(({ message, onRetry }) => (
  <div className="text-center py-16">
    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-red-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">{message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
    >
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
          clipRule="evenodd"
        />
      </svg>
      Try Again
    </button>
  </div>
));

ErrorState.displayName = 'ErrorState';

// Empty State Component
export const EmptyState = memo(() => (
  <div className="text-center py-20">
    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
      <svg
        className="w-10 h-10 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      No incidents reported yet
    </h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
      When fire incidents are reported, they&apos;ll appear here. Stay safe and
      report any emergencies immediately.
    </p>
    <div className="inline-flex items-center text-sm text-gray-400">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      Monitoring for incidents...
    </div>
  </div>
));

EmptyState.displayName = 'EmptyState';
