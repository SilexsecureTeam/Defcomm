import React, { useState, useContext, useEffect } from "react";
import { MeetingContext } from "../../context/MeetingContext";
import CallComponentContent from "./call/CallComponentContent";
import ConferenceRoom from "../../pages/ConferenceRoom";

type Props = {
  initialMeetingId?: string;
  setInitialMeetingId?: (id: string | null) => void;
  mode?: "CALL" | "CONFERENCE";
};

const CallComponent = ({ initialMeetingId, setInitialMeetingId }: Props) => {
  const [meetingId, setMeetingId] = useState(initialMeetingId || null);
  const { providerMeetingId, setProviderMeetingId } =
    useContext(MeetingContext);

  useEffect(() => {
    if (meetingId && !providerMeetingId) {
      // If initialMeetingId is provided, set it as the providerMeetingId
      if (initialMeetingId) {
        setProviderMeetingId(meetingId);
      }
    }
  }, [meetingId]);
  return (
    <CallComponentContent meetingId={meetingId} setMeetingId={setMeetingId} />
  );
};
export default CallComponent;
