import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MeetingContext } from "../context/MeetingContext";
import useConference from "../hooks/useConference";
import { onFailure } from "../utils/notifications/OnFailure";
import WaitingScreen from "../components/video-sdk/conference/WaitingScreen";
import { extractErrorMessage, loadingMessages } from "../utils/formmaters";
import { FaSpinner } from "react-icons/fa";
import SEOHelmet from "../engine/SEOHelmet";
import { AuthContext } from "../context/AuthContext";
import { onPrompt } from "../utils/notifications/onPrompt";

const WaitingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const {
    isTokenLoading,
    token,
    tokenError,
    setIsCreator,
    setConference,
    setProviderMeetingId,
  } = useContext(MeetingContext);
  const { getMeetingByIdQuery, joinMeeting } = useConference();
  const [isJoining, setIsJoining] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  const {
    data: meeting,
    isLoading,
    isError,
    error,
  } = getMeetingByIdQuery(meetingId);

  // cycle loading messages every few seconds
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setCurrentMessage(loadingMessages[i]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (meeting?.meeting_id) {
      setProviderMeetingId(meeting.meeting_id);
      setIsCreator(meeting?.creator_id === authDetails?.user?.id);
    }
  }, [meeting?.meeting_id]);

  const confirmJoinMeeting = async () => {
    if (isTokenLoading || !token) {
      onPrompt({ message: "Please wait — initializing secure connection..." });
      return;
    }

    if (tokenError) {
      onFailure({ message: tokenError });
      return;
    }

    try {
      setIsJoining(true);
      await joinMeeting(meeting?.id);
      setConference(meeting);
      navigate("/dashboard/conference/room");
    } catch (err) {
      onFailure({ message: extractErrorMessage(err) });
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancel = () => navigate("/dashboard/conference");

  if (isLoading || isTokenLoading || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-white transition-all">
        <FaSpinner className="animate-spin text-5xl text-oliveHover mb-4" />
        <p className="text-lg animate-pulse">{currentMessage}</p>
      </div>
    );
  }

  if (isError || tokenError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-red-400 text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">Unable to load meeting</h2>
        <p className="mb-4">
          {tokenError ||
            extractErrorMessage(error) ||
            "Meeting not found or token initialization failed."}
        </p>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet title={meeting?.title || "Meeting"} />
      <WaitingScreen
        waitingScreen={meeting}
        onJoin={confirmJoinMeeting}
        onCancel={handleCancel}
        isJoining={isJoining || isTokenLoading}
      />
    </>
  );
};

export default WaitingPage;
