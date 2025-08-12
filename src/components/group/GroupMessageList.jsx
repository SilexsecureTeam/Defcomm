import React from "react";
import GroupMessage from "./GroupMessage";

const GroupMessageList = ({ messages, participants }) => {
  return (
    <div className="flex flex-col px-4 py-4 space-y-3 overflow-y-auto hide-scrollbar">
      {messages.map((msg, index) => {
        const sender = participants.find((p) => p.id === msg.sender_id) || {};
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];

        const showAvatar = !prevMsg || prevMsg.sender_id !== msg.sender_id;
        const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;

        const showDateSeparator =
          !prevMsg ||
          new Date(prevMsg.updated_at).toDateString() !==
            new Date(msg.updated_at).toDateString();

        return (
          <GroupMessage
            key={msg.id || index}
            msg={msg}
            sender={sender}
            showAvatar={showAvatar}
            isLastInGroup={isLastInGroup}
            showDateSeparator={showDateSeparator}
          />
        );
      })}
    </div>
  );
};

export default GroupMessageList;
