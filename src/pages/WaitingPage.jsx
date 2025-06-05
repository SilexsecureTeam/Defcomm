import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MeetingContext } from "../context/MeetingContext";
import useConference from "../hooks/useConference";
import { useMeeting } from "@videosdk.live/react-sdk";
import { onFailure } from "../utils/notifications/OnFailure";
import WaitingScreen from "../components/video-sdk/conference/WaitingScreen";
import { extractErrorMessage } from "../utils/formmaters";

const WaitingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { setConference } = useContext(MeetingContext);
  const { join } = useMeeting();
  const { getMeetingByIdQuery } = useConference(); // <-- Make sure this exists in your hook
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (meetingId) {
      getMeetingByIdQuery(meetingId)
        .then((data) => {
          setMeeting(data);
          setConference(data); // important: sets global context
        })
        .catch(() => {
          onFailure({ message: "Invalid or expired meeting ID" });
          navigate("/dashboard/conference"); // or fallback route
        })
        .finally(() => setLoading(false));
    }
  }, [meetingId]);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await join();
    } catch (error) {
      onFailure({ message: "Join failed", error: extractErrorMessage(error) });
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/conference");
  };

  if (loading || !meeting) return <div className="text-center text-white mt-10">Loading meeting...</div>;

  return (
    <WaitingScreen
      waitingScreen={meeting}
      onJoin={handleJoin}
      onCancel={handleCancel}
      isJoining={isJoining}
    />
  );
};

export default WaitingPage;
