import React, { useState, useContext, useEffect } from "react";
import { MdAttachFile, MdOutlineEmojiEmotions } from "react-icons/md";
import { FaFileAlt, FaPaperPlane, FaSpinner, FaTimes } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../services/axios-client";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { sendMessageUtil } from "../../utils/chat/sendMessageUtil";
import { useSendMessageMutation } from "../../hooks/useSendMessageMutation";
import { parseHtml } from "../../utils/formmaters";

interface MessageData {
  chat_user_id: string;
  chat_user_type: string;
  chat_id: string;
}

interface SendMessageProps {
  messageData: MessageData;
  desktop: boolean;
}

function SendMessage({ messageData, desktop=false }: {SendMessageProps}) {
  const { authDetails } = useContext(AuthContext);
  const { 
    file, setFile,
    message, setMessage
   } = useContext(ChatContext);
 
  const queryClient = useQueryClient();
  const client = axiosClient(authDetails?.access_token);

  const clearMessageInput = () => {
    setMessage("");  // Clears the input field
    setFile(null);   // Clears the file selection
  };
  
  const sendMessageMutation = useSendMessageMutation(client, clearMessageInput);

  const handleSendMessage = () => {
    console.log("sending", file)
    sendMessageUtil({
      client,
      message,
      file,
      chat_user_type: messageData.chat_user_type,
      chat_user_id: messageData.chat_user_id,
      chat_id: messageData.chat_id,
      sendMessageMutation,
    });
  };
useEffect(()=>{
  console.log(desktop, file)
},[file])
  return (
    <div className={`${desktop ? "bg-white text-black":"bg-oliveLight text-white"} sticky bottom-0 w-full flex flex-col p-4 `}>
      {file && (
        <div className={`${desktop ?"bg-oliveGreen":"bg-oliveDark"} flex items-center gap-3 p-3 mb-2 rounded-lg shadow-md`}>
          <FaFileAlt className={`${desktop ? "text-oliveDark":"text-oliveGreen"}`} size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium w-[90%] truncate">{file.name}</p>
            <p className={`${desktop ? "text-gray-700":"text-gray-400"} text-xs`}>{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-500 transition">
            <FaTimes size={18} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor="fileUpload" className="cursor-pointer">
          <MdAttachFile size={24} className="flex-shrink-0" />
          <input type="file" id="fileUpload" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>

        <MdOutlineEmojiEmotions size={24} className="flex-shrink-0" />

        <textarea
          placeholder="Write a message..."
          className="flex-1 p-2 bg-transparent border-none outline-none resize-none leading-none text-base"
          value={parseHtml(message)}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
        />

        <button
          className="bg-oliveDark text-gray-200 px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
          onClick={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? <FaSpinner size={20} className="animate-spin" /> : <FaPaperPlane size={20} />}
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
