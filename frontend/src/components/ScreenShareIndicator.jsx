import React from 'react';
import { MonitorIcon } from 'lucide-react';

const ScreenShareIndicator = ({ isScreenSharing, userName }) => {
  if (!isScreenSharing) return null;

  return (
    <div className="absolute top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
      <MonitorIcon className="size-5" />
      <span className="font-medium">
        {userName ? `${userName} is sharing screen` : 'Screen sharing active'}
      </span>
    </div>
  );
};

export default ScreenShareIndicator; 