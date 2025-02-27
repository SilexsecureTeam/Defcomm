import React, { useState, useContext, useEffect } from "react";

import { createMeeting, getAuthToken } from "./Api";
import {
  MeetingProvider
} from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import CallComponentContent from './CallComponentContent'

const CallComponent = ({ initialMeetingId }: { initialMeetingId?: string }) => {
  const [meetingId, setMeetingId] = useState<string | null>(initialMeetingId || null);
  const [providerMeetingId, setProviderMeetingId] = useState<string | null>(null);
  const { authDetails } = useContext(AuthContext);
  useEffect(() => {
    if (meetingId && !providerMeetingId) { // Only set once
        setProviderMeetingId(meetingId);
    }
}, [meetingId]);
  return (
    <MeetingProvider
      config={{
        meetingId: providerMeetingId, // Use updated meetingId
        name: authDetails?.user?.name || "You",
        participantId: authDetails?.user?.role,
        micEnabled: true,
        webcamEnabled: false,
      }}
      token={getAuthToken()}
    >
      <CallComponentContent meetingId={meetingId} setMeetingId={setMeetingId} />
    </MeetingProvider>
  );

};


export default CallComponent;
