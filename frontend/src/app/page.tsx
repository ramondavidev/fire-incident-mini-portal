'use client';

import { useState, useCallback, useMemo, Suspense } from 'react';
import {
  LazyIncidentForm,
  LazyIncidentList,
} from '@/components/LazyComponents';

// Loading component for better UX
const TabContentLoading = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleIncidentCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('list');
  }, []);

  const handleTabChange = useCallback((tab: 'create' | 'list') => {
    setActiveTab(tab);
  }, []);

  // Memoize tab navigation items
  const tabItems = useMemo(
    () => [
      {
        key: 'list' as const,
        label: 'View Incidents',
        isActive: activeTab === 'list',
      },
      {
        key: 'create' as const,
        label: 'Report Incident',
        isActive: activeTab === 'create',
      },
    ],
    [activeTab]
  );

  // Memoize tab content
  const tabContent = useMemo(() => {
    if (activeTab === 'list') {
      return (
        <Suspense fallback={<TabContentLoading />}>
          <LazyIncidentList key={refreshKey} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<TabContentLoading />}>
        <LazyIncidentForm onIncidentCreated={handleIncidentCreated} />
      </Suspense>
    );
  }, [activeTab, refreshKey, handleIncidentCreated]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🔥 Fire Incident Portal
      </h1>

      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabItems.map(({ key, label, isActive }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content with Lazy Loading */}
        {tabContent}
      </div>
    </div>
  );
}
