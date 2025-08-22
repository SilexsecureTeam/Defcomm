import React, { useContext } from "react";
import MentionDropdown from "./MentionDropdown";
import { MdAttachFile, MdOutlineEmojiEmotions } from "react-icons/md";
import { ChatContext } from "../../context/ChatContext";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

const InputBox = ({
  insertMentionChip,
  mentionIndex,
  sendMessageMutation,
  editorRef,
  onInput,
  onKeyDown,
  onFocus,
  onBlur,
  handleSendMessage,
  messageData,
  showMentionMenu,
  mentionSuggestions,
}) => {
  const { file, setFile } = useContext(ChatContext) as any;
  return (
    <div className="relative flex items-center gap-2">
      <label htmlFor="fileUpload" className="cursor-pointer">
        <MdAttachFile size={24} className="flex-shrink-0" />
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      <MdOutlineEmojiEmotions size={24} className="flex-shrink-0" />

      {/* contentEditable input */}
      <div
        ref={editorRef}
        role="textbox"
        aria-label="Write a message"
        contentEditable
        spellCheck
        onInput={onInput}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className="flex-1 p-2 bg-transparent border-none outline-none leading-snug min-h-[24px] max-h-40 overflow-auto"
        style={{ whiteSpace: "pre-wrap" }}
        placeholder="Write a message..."
        data-placeholder="Write a message..."
      />

      <button
        className="bg-oliveDark text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
        onClick={handleSendMessage}
        disabled={sendMessageMutation.isPending}
      >
        {sendMessageMutation.isPending ? (
          <FaSpinner size={20} className="animate-spin" />
        ) : (
          <FaPaperPlane size={20} />
        )}
      </button>

      {/* Mention dropdown */}
      {messageData.chat_user_type === "group" &&
        showMentionMenu &&
        mentionSuggestions.length > 0 && (
          <MentionDropdown
            insertMentionChip={insertMentionChip}
            mentionSuggestions={mentionSuggestions}
            mentionIndex={mentionIndex}
          />
        )}
    </div>
  );
};

export default InputBox;
