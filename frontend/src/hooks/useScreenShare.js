import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useScreenShare = (call) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if screen sharing is supported
  const isScreenShareSupported = () => {
    const supported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
    console.log('Screen sharing supported:', supported);
    return supported;
  };

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    console.log('Starting screen share...');
    
    if (!call) {
      console.log('No call instance available');
      toast.error('Call not initialized');
      return false;
    }

    if (!isScreenShareSupported()) {
      toast.error('Screen sharing is not supported in this browser');
      return false;
    }

    setIsLoading(true);

    try {
      console.log('Requesting display media...');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: false // Disable audio for now to avoid conflicts
      });

      console.log('Display media stream obtained:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      console.log('Audio tracks:', stream.getAudioTracks());

      // For now, we'll just store the stream and show a success message
      // The actual publishing will be handled differently
      setScreenShareStream(stream);
      setIsScreenSharing(true);
      
      toast.success('Screen sharing started (Preview mode)');
      
      // Handle when user stops sharing via browser UI
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.addEventListener('ended', () => {
        console.log('Video track ended, stopping screen share');
        stopScreenShare();
      });

      return true;

    } catch (error) {
      console.error('Screen sharing error:', error);
      
      let errorMessage = 'Failed to start screen sharing';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Screen sharing permission denied';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Screen sharing not supported in this browser';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No screen or window selected';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Could not access screen content';
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [call]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    console.log('Stopping screen share...');
    
    if (!isScreenSharing || !screenShareStream) return;

    try {
      // Stop all tracks in the stream
      screenShareStream.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });

      setScreenShareStream(null);
      setIsScreenSharing(false);
      
      toast.success('Screen sharing stopped');
    } catch (error) {
      console.error('Error stopping screen share:', error);
      toast.error('Error stopping screen sharing');
    }
  }, [isScreenSharing, screenShareStream]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    console.log('Toggling screen share, current state:', isScreenSharing);
    
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screenShareStream]);

  return {
    isScreenSharing,
    isLoading,
    isScreenShareSupported: isScreenShareSupported(),
    startScreenShare,
    stopScreenShare,
    toggleScreenShare
  };
}; 