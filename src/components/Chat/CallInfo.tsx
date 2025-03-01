import React from "react";

interface CallInfoProps {
  participant: string;
  callDuration: number;
  isInitiator:boolean;
}

function CallInfo({ participant, callDuration, isInitiator }: CallInfoProps) {
  return (
    <>
      <p className="text-gray-700 text-center font-medium">
        Secure Call Initiated by <br />
        <small className="text-xs text-gray-500">{isInitiator ? "You" : participant}</small>
      </p>
      <p className="text-gray-500">
        Call encrypted: {new Date(callDuration * 1000).toISOString().substr(14, 5)}
      </p>
    </>
  );
}

export default CallInfo;
