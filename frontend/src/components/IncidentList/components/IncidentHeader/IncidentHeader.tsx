import React, { memo } from 'react';
import { WildfireIcon, RefreshIcon } from '../Icons';

interface IncidentHeaderProps {
  incidentCount: number;
  onRefresh: () => void;
}

const IncidentHeader = memo<IncidentHeaderProps>(
  ({ incidentCount, onRefresh }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <WildfireIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fire Incidents</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></span>
                {incidentCount} Total
              </span>
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          aria-label="Refresh incidents"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <RefreshIcon className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
    </div>
  )
);

IncidentHeader.displayName = 'IncidentHeader';

export default IncidentHeader;
