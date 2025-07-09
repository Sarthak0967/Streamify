import React from 'react'
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser.jsx';
import { getStreamToken } from '../lib/api';
import { toast } from 'react-hot-toast';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import PageLoader from '../components/PageLoader.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const navigate = useNavigate();

  const { authUser, isLoading } = useAuthUser();


  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!callId || callId === ':' || callId.trim() === '') {
      toast.error("Invalid or missing call ID.");
      navigate('/');
    }
  }, [callId, navigate]);

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId || callId === ':') {
        console.warn("Missing or invalid callId:", callId);
        return;
      }


      try {
        console.log("Initializing Stream Video Call...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        })

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        console.log("Call initialized successfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing Stream Video Call:", error);
        toast.error("Could not connect to video call. Please try again later.");
      } finally {
        setIsConnecting(false);
      }

    };

    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;