import React from "react";
import GroupMessage from "./GroupMessage";

const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
  });
};

const GroupMessageList = ({ messages, participants }) => {
  return (
    <div className="flex flex-col px-4 py-4 space-y-1 hide-scrollbar relative">
      {messages.map((msg, index) => {
        const sender =
          participants.find(
            (p) => Number(p.member_id) === Number(msg.user_id)
          ) || {};
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];

        const sameDayAsPrev =
          prevMsg &&
          new Date(prevMsg.updated_at).toDateString() ===
            new Date(msg.updated_at).toDateString();

        const showDateSeparator = !sameDayAsPrev;

        const showAvatar =
          !prevMsg || Number(prevMsg.user_id) !== Number(msg.user_id);
        const isLastInGroup =
          !nextMsg || Number(nextMsg.user_to) !== Number(msg.user_to);

        return (
          <React.Fragment key={msg.id || index}>
            {showDateSeparator && (
              <div className="sticky top-0 z-10 flex justify-center my-3">
                <span
                  className="px-3 py-1 text-xs rounded-full shadow-sm"
                  style={{
                    backgroundColor: "#1E2A1E", // dark military green
                    color: "#C5D6C3", // soft muted green text
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {formatDateLabel(msg.updated_at)}
                </span>
              </div>
            )}

            <GroupMessage
              msg={msg}
              sender={sender}
              showAvatar={showAvatar}
              isLastInGroup={isLastInGroup}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default GroupMessageList;
