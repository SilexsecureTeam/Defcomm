import React, { createContext, useState, useEffect, useContext } from "react";
import { MeetingProvider as SDKMeetingProvider } from "@videosdk.live/react-sdk";
import { AuthContext } from "./AuthContext";
import { getAuthToken } from "../components/video-sdk/Api";

export const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const { authDetails } = useContext(AuthContext);

  const [conference, setConference] = useState(null);
  const [me, setMe] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [providerMeetingId, setProviderMeetingId] = useState(null);
  const [showConference, setShowConference] = useState(false);
  const [token, setToken] = useState(null);

  const defaultToken = import.meta.env.VITE_VIDEOSDK_TOKEN;

  // ✅ Automatically refetch token whenever user or conference changes
  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (authDetails?.user?.id) {
          const isMyMeeting = conference?.creator_id === authDetails?.user?.id;
          const role = isMyMeeting ? "host" : "guest";

          const response = await getAuthToken(authDetails.user.id, role);
          setToken(response?.token || response);
        } else {
          setToken(defaultToken);
        }
      } catch (error) {
        console.error("Failed to fetch VideoSDK token, using default:", error);
        setToken(defaultToken);
      }
    };

    fetchToken();
  }, [authDetails?.user?.id, conference?.id]); // 👈 refetch when user or conference changes

  return (
    <MeetingContext.Provider
      value={{
        conference,
        setConference,
        me,
        setMe,
        isScreenSharing,
        setIsScreenSharing,
        providerMeetingId,
        setProviderMeetingId,
        showConference,
        setShowConference,
        token,
      }}
    >
      {token && (
        <SDKMeetingProvider
          config={{
            meetingId:
              conference?.meeting_id || providerMeetingId || "test-meeting",
            name: authDetails?.user?.name || "Guest User",
            participantId: authDetails?.user?.id || `guest-${Date.now()}`,
            micEnabled: false,
            webcamEnabled: false,
            mode: "SEND_AND_RECV",
            chatEnabled: true,
            raiseHandEnabled: true,
            debugMode: true,
          }}
          token={token}
        >
          {children}
        </SDKMeetingProvider>
      )}
    </MeetingContext.Provider>
  );
};
