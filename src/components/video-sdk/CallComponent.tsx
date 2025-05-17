import React, { useState, useContext, useEffect } from "react";
import { createMeeting, getAuthToken } from "./Api";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import CallComponentContent from './CallComponentContent';
import ConferenceContent from './ConferenceContent';

type Props = {
  initialMeetingId?: string;
  setInitialMeetingId: (id: string | null) => void;
  mode?: "CALL" | "CONFERENCE";
};

const CallComponent = ({
  initialMeetingId,
  setInitialMeetingId,
  mode = "CALL", // default to direct call
}: Props) => {
  const [meetingId, setMeetingId] = useState(initialMeetingId || null);
  const [providerMeetingId, setProviderMeetingId] = useState(null);
  const { authDetails } = useContext(AuthContext);
  const { callType } = useContext(ChatContext);

  useEffect(() => {
    if (meetingId && !providerMeetingId) {
      setInitialMeetingId(null);
      setProviderMeetingId(meetingId);
    }
  }, [meetingId]);

  return (
    <MeetingProvider
      config={{
        meetingId: providerMeetingId!,
        name: authDetails?.user?.name || "You",
        participantId: authDetails?.user?.id,
        micEnabled: true,
        webcamEnabled: callType === "video",
        mode: "SEND_AND_RECV",
        debugMode: true // ✅ Required field — set to true for development
      }}
      token={getAuthToken()}
    >
      {mode === "CONFERENCE" ? (
        <ConferenceContent meetingId={meetingId} setMeetingId={setMeetingId} />
      ) : (
        <CallComponentContent meetingId={meetingId} setMeetingId={setMeetingId} />
      )}
    </MeetingProvider>
  );
};

export default CallComponent;
