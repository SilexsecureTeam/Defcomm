import React, { useState, useContext, useEffect } from "react";
import { MeetingContext } from "../../context/MeetingContext";
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
   const { providerMeetingId, setProviderMeetingId } = useContext(MeetingContext);

  useEffect(() => {
    if (meetingId && !providerMeetingId) {
      setInitialMeetingId(null);
      setProviderMeetingId(meetingId);
    }
  }, [meetingId]);

  return (
    mode === "CONFERENCE" ? (
        <ConferenceContent meetingId={meetingId} setMeetingId={setMeetingId} />
      ) : (
        <CallComponentContent meetingId={meetingId} setMeetingId={setMeetingId} />
      )
  );
};

export default CallComponent;
