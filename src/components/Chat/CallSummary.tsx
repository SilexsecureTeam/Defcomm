import React from "react";

interface CallSummaryProps {
  callSummary: { caller: string; duration: number } | null;
}

function CallSummary({ callSummary }: CallSummaryProps) {
  if (!callSummary) return null;

  return (
    <div className="w-full mb-4 p-4 bg-gray-100 text-center rounded-md">
      <p className="text-gray-700 font-semibold">Call Summary</p>
      <p className="text-gray-600 text-sm">Caller: {callSummary.caller}</p>
      <p className="text-gray-600 text-sm">
        Duration: {new Date(callSummary.duration * 1000).toISOString().substr(14, 5)}
      </p>
    </div>
  );
}

export default CallSummary;
