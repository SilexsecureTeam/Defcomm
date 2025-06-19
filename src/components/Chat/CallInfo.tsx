import React, { useContext } from "react";
import { formatCallDuration } from "../../utils/formmaters";
import { MeetingContext } from "../../context/MeetingContext";

interface CallInfoProps {
  participant: string;
  callDuration: number;
  isInitiator: boolean;
}

function CallInfo({ participant, callDuration, isInitiator }: CallInfoProps) {
  const { providerMeetingId } = useContext(MeetingContext);
  return (
    <>
      <p className="text-gray-700 text-center font-medium">
        Secure Call Initiated by <br />
        <small className="text-xs text-gray-500">
          {isInitiator ? "You" : participant}
        </small>
        <span className="text-xs text-gray-500">
          (Meeting ID: {providerMeetingId})
        </span>
      </p>
      <p className="text-gray-500">
        Call encrypted: {formatCallDuration(callDuration)}
      </p>
    </>
  );
}

export default CallInfo;
