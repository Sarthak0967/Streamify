import React from 'react';
import { CallControls } from '@stream-io/video-react-sdk';
import ScreenShareButton from './ScreenShareButton';

const CustomCallControls = ({ call }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Custom Screen Share Button */}
      <div className="flex justify-center">
        <ScreenShareButton call={call} />
      </div>
      
      {/* Default Stream.io Call Controls */}
      <CallControls />
    </div>
  );
};

export default CustomCallControls; 