import { useLocation } from "react-router-dom";
import { getFormattedDate } from "../../utils/formmaters";
import ChatMessage from "./ChatMessage";

const ChatMessageList = ({ messages }) => {
  const location = useLocation();
  const chatUserData = location?.state;

  if (!messages?.data?.length)
    return <p className="text-gray-500 text-center">No messages yet.</p>;

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const dateKey = new Date(msg.updated_at).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages.data);

  return Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
    <div key={dateKey} className="relative">
      {/* Sticky date header for this day */}
      <div className="sticky top-40 flex justify-center py-1">
        <span className="px-3 py-1 text-xs rounded-full shadow-sm text-gray-700 border border-gray-300">
          {getFormattedDate(dayMessages[0].updated_at)}
        </span>
      </div>

      {/* Messages of this day */}
      <div className="space-y-4">
        {dayMessages.map((msg, index) => {
          const nextMsg = dayMessages[index + 1];

          const isLastMessageFromUser =
            msg.is_my_chat !== "yes" &&
            (!nextMsg || nextMsg.is_my_chat === "yes");

          return (
            <ChatMessage
              key={msg.id}
              msg={msg}
              selectedChatUser={chatUserData}
              isLastMessageFromUser={isLastMessageFromUser}
            />
          );
        })}
      </div>
    </div>
  ));
};

export default ChatMessageList;
