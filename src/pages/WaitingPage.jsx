import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MeetingContext } from "../context/MeetingContext";
import useConference from "../hooks/useConference";
import { useMeeting } from "@videosdk.live/react-sdk";
import { onFailure } from "../utils/notifications/OnFailure";
import WaitingScreen from "../components/video-sdk/conference/WaitingScreen";
import { extractErrorMessage } from "../utils/formmaters";
import { FaSpinner } from "react-icons/fa"; // <- React icon for loader
import SEOHelmet from "../engine/SEOHelmet";
import { AuthContext } from "../context/AuthContext";
import { onPrompt } from "../utils/notifications/onPrompt";

const WaitingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const { isTokenLoading } = useContext(MeetingContext);
  const { setIsCreator, setConference, setProviderMeetingId } =
    useContext(MeetingContext);
  const { join } = useMeeting();
  const { getMeetingByIdQuery, joinMeeting } = useConference();

  const [isJoining, setIsJoining] = useState(false);

  const {
    data: meeting,
    isLoading,
    isError,
    error,
  } = getMeetingByIdQuery(meetingId);

  useEffect(() => {
    if (meeting?.meeting_id) {
      setProviderMeetingId(meeting.meeting_id);
      setIsCreator(meeting?.creator_id === authDetails?.user?.id);
      console.log(meeting?.creator_id === authDetails?.user?.id);
    }
  }, [meeting?.meeting_id]);

  const confirmJoinMeeting = async () => {
    if (isTokenLoading) {
      onPrompt({ message: "Please wait — initializing meeting token..." });
      return;
    }

    if (!meeting?.meeting_id) {
      onFailure({ message: "Meeting ID is missing" });
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

  const handleCancel = () => {
    navigate("/dashboard/conference");
  };

  if (isLoading || isTokenLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-white">
        <FaSpinner className="animate-spin text-5xl text-oliveHover mb-4" />
        <p className="text-lg">Fetching meeting details...</p>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-red-400 text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">Unable to load meeting</h2>
        <p className="mb-4">
          {extractErrorMessage(error) ||
            "Meeting not found or an unexpected error occurred."}
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
      {/* SEO Content */}
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
