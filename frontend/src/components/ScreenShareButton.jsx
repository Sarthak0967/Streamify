import React from 'react';
import { MonitorIcon, MonitorOffIcon } from 'lucide-react';
import { useScreenShare } from '../hooks/useScreenShare';

const ScreenShareButton = ({ call }) => {
  const {
    isScreenSharing,
    isLoading,
    isScreenShareSupported,
    toggleScreenShare
  } = useScreenShare(call);

  if (!isScreenShareSupported) {
    return (
      <button
        disabled
        className="btn btn-sm btn-disabled opacity-50"
        title="Screen sharing not supported in this browser"
      >
        <MonitorIcon className="size-5" />
        <span className="ml-2">Not Supported</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleScreenShare}
      disabled={isLoading}
      className={`btn btn-sm ${
        isScreenSharing 
          ? 'btn-error text-white' 
          : 'btn-primary text-white'
      } ${isLoading ? 'loading' : ''}`}
      title={isScreenSharing ? 'Stop Screen Sharing' : 'Start Screen Sharing'}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : isScreenSharing ? (
        <MonitorOffIcon className="size-5" />
      ) : (
        <MonitorIcon className="size-5" />
      )}
      {!isLoading && (
        <span className="ml-2">
          {isScreenSharing ? 'Stop' : 'Share'}
        </span>
      )}
    </button>
  );
};

export default ScreenShareButton; 