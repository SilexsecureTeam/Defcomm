import React, { useContext, useEffect, useRef } from "react";
import { MeetingProvider as SDKMeetingProvider } from "@videosdk.live/react-sdk";
import { AuthContext } from "./AuthContext";
import { MeetingContext } from "./MeetingContext";
import { getAuthToken } from "../components/video-sdk/Api";

export const SDKProvider = ({ children, meetingId, conferenceData }) => {
  const { authDetails } = useContext(AuthContext);
  const {
    token,
    setToken,
    isTokenLoading,
    setIsTokenLoading,
    tokenError,
    setTokenError,
    isCreator,
    setIsCreator,
    providerMeetingId,
  } = useContext(MeetingContext);

  const tokenFetchedRef = useRef(false);

  useEffect(() => {
    if (!providerMeetingId || !authDetails?.user?.id) return;

    const fetchToken = async () => {
      if (tokenFetchedRef.current) return;

      try {
        setIsTokenLoading(true);
        const role = isCreator ? "host" : "guest";
        const response = await getAuthToken(authDetails.user.id, role);
        setToken(response?.token || response);
        tokenFetchedRef.current = true;
      } catch (error) {
        console.error("Token fetch error:", error);
        setTokenError(error.message || "Failed to fetch token");
        setToken(null);
      } finally {
        setIsTokenLoading(false);
      }
    };

    fetchToken();
  }, [providerMeetingId]);

  return (
    <SDKMeetingProvider
      key={`${token}-${providerMeetingId}`}
      config={{
        meetingId: providerMeetingId,
        name: authDetails?.user?.name || "Guest User",
        participantId: authDetails?.user?.id || `guest-${Date.now()}`,
        micEnabled: false,
        webcamEnabled: false,
        mode: "SEND_AND_RECV",
        chatEnabled: true,
        raiseHandEnabled: true,
        debugMode: true,
      }}
      token={token || "default"}
    >
      {children}
    </SDKMeetingProvider>
  );
};
