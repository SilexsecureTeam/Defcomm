import React from "react";
import CountdownTime from "./CountdownTimer";
const MeetingList = ({ meetings = [], onMeetingClick, showCountdown = false, showSource = false }) => {
  if (!meetings.length) {
    return <p className="text-gray-400 text-center">No meetings available.</p>;
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => {
        const startDate = new Date(meeting.startdatetime);
        return (
          <div
            key={meeting.meeting_id}
            onClick={() => onMeetingClick?.(meeting)}
            className="cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-lg p-4 shadow transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{meeting.title || "Untitled Meeting"}</h3>
                <p className="text-sm text-gray-400">
                  {startDate.toLocaleString()}
                  {showSource && meeting._source && ` · ${meeting._source}`}
                </p>
              </div>
              {showCountdown && (
                <div className="text-right text-green-400 text-sm">
                  <CountdownTime startTime={startDate} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingList;
