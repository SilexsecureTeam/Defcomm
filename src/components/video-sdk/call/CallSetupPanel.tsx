import React, { useContext, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import { MeetingContext } from "../../../context/MeetingContext";
import { sendMessageUtil } from "../../../utils/chat/sendMessageUtil";
import { createMeeting } from "../Api";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { useSendMessageMutation } from "../../../hooks/useSendMessageMutation";
import CallSummary from "../../Chat/CallSummary";
import { axiosClient } from "../../../services/axios-client";
import useChat from "../../../hooks/useChat";
import audioController from "../../../utils/audioController";
import { formatCallDuration } from "../../../utils/formmaters";

const CallSetupPanel = ({
  meetingId,
  setMeetingId,
  setCallDuration,
  callDuration,
  join,
  showSummary = false,
  setShowSummary = () => {},
  isInitiator,
  setIsInitiator,
}: any) => {
  const { selectedChatUser, callMessage, setCallMessage } =
    useContext(ChatContext);
  const { updateCallLog } = useChat();
  const { authDetails } = useContext(AuthContext);
  const { setProviderMeetingId } = useContext(MeetingContext);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messageData = selectedChatUser?.chat_meta;
  const client = axiosClient(authDetails?.access_token);
  const sendMessageMutation = useSendMessageMutation(client);

  const handleCreateMeeting = async () => {
    setIsCreatingMeeting(true);
    try {
      const newMeetingId = await createMeeting();
      setProviderMeetingId(newMeetingId);
      setMeetingId(newMeetingId);
      setIsInitiator(true);
      setShowSummary(false);
      setCallDuration(0);
    } catch (error) {
      onFailure({ message: "Meeting Creation Failed", error: error.message });
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  // Start Call (for initiator)
  const handleStartCall = async () => {
    if (!meetingId) {
      onFailure({
        message: "Meeting ID Error",
        error: "Meeting ID is missing.",
      });
      return;
    }

    setIsLoading(true);
    try {
      sendMessageUtil({
        client,
        message: `CALL_INVITE:${meetingId}`,
        file: null,
        chat_user_type: messageData.chat_user_type,
        chat_user_id: messageData.chat_user_id,
        chat_id: messageData.chat_id,
        mss_type: "call",
        sendMessageMutation,
      });

      join();
    } catch (error: any) {
      setIsLoading(false);
      onFailure({
        message: "Meeting Join Failed",
        error:
          error.message || "Something went wrong while joining the meeting.",
      });
    }
  };

  // Join Meeting (for invited participant)
  const handleJoinMeeting = async () => {
    if (!meetingId) {
      onFailure({
        message: "Meeting ID Error",
        error: "Meeting ID is missing.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await updateCallLog.mutateAsync({
        mss_id: callMessage?.id,
        recieve_user_id: callMessage?.user_id,
        duration: formatCallDuration(callDuration),
      } as any);

      join();
      audioController.stopRingtone();
    } catch (error) {
      onFailure({ message: "Call Log Update Failed", error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 w-72 md:w-96 rounded-lg flex flex-col items-center">
      {showSummary && (
        <CallSummary
          callSummary={{
            duration: callDuration,
            caller: isInitiator ? "You" : selectedChatUser?.contact_name,
            receiver: !isInitiator ? "You" : selectedChatUser?.contact_name,
          }}
        />
      )}
      {!meetingId ? (
        <button
          onClick={handleCreateMeeting}
          disabled={isCreatingMeeting}
          className="bg-oliveLight hover:bg-oliveDark text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2"
        >
          Initiate Call{" "}
          {isCreatingMeeting && <FaSpinner className="animate-spin" />}
        </button>
      ) : isInitiator ? (
        <button
          onClick={handleStartCall}
          className="bg-green-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2"
        >
          Start Call {isLoading && <FaSpinner className="animate-spin" />}
        </button>
      ) : (
        <button
          onClick={handleJoinMeeting}
          className="bg-green-600 text-white p-2 rounded-full mt-4 min-w-40 font-bold flex items-center justify-center gap-2"
        >
          Join Call {isLoading && <FaSpinner className="animate-spin" />}
        </button>
      )}
    </div>
  );
};

export default CallSetupPanel;
