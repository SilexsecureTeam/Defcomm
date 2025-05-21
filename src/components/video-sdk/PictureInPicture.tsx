import { useContext } from "react";
import ParticipantVideo from "./ParticipantVideo";
import { MeetingContext } from "../../context/MeetingContext";
import { AuthContext } from "../../context/AuthContext";

const PictureInPicture = () => {
  const { conference } = useContext(MeetingContext);
  const { authDetails } = useContext(AuthContext);

  if (!conference || !authDetails?.user) return null;

  // Show local participant video or active speaker
  const localParticipantId = String(authDetails.user.id);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 200,
        height: 200,
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: 8,
        zIndex: 10000000,
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <ParticipantVideo participantId={localParticipantId} label="You (PiP)" key={localParticipantId} />
    </div>
  );
};

export default PictureInPicture;
