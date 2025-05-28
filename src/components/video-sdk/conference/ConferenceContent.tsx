import React, { useState, useMemo, useContext, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { AuthContext } from "../../../context/AuthContext";
import { MeetingContext } from "../../../context/MeetingContext";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { extractErrorMessage } from "../../../utils/formmaters";
import ParticipantVideo from "./ParticipantVideo";
import ScreenShareDisplay from "./ScreenShareDisplay";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import InitConference from './InitConference'
import PictureInPicture from './PictureInPicture'
import ConferenceControl from './ConferenceControl'

const ConferenceContent = ({ meetingId, setMeetingId }: { meetingId: string | null; setMeetingId: (id: string) => void }) => {
  const { pathname } = useLocation();
  const { authDetails } = useContext(AuthContext);
  const {
    conference, setConference,
    me, setMe, isScreenSharing,
    setIsScreenSharing,
    showConference
  } = useContext(MeetingContext);
  const [maximizedParticipantId, setMaximizedParticipantId] = useState(null);

  const {
    participants,
    leave,
    enableScreenShare,
    disableScreenShare,
    presenterId,
  } = useMeeting({
    onParticipantJoined: (participant) => {
      toast.info(`${participant.displayName || "A participant"} has joined the meeting`);
    },
    onParticipantLeft: (participant) => {
      toast.info(`${participant.displayName || "A participant"} just left the meeting`);
    },
    onError: (error) => {
      onFailure({
        message: "Technical Error",
        error: extractErrorMessage(error) || "An error occurred",
      });
    },
    onPresenterChanged: (presenterId) => {
      if (presenterId) {
        const presenter = participants.get(presenterId);
        const isSelf = Number(presenter?.id) === Number(me?.id);
        if (isSelf) {
          toast.info("You started sharing your screen.");
        } else {
          toast.info(`${presenter?.displayName || "A participant"} started sharing their screen.`);
        }
        setIsScreenSharing(true);
      } else {
        toast.info("Screen sharing stopped.");
        setIsScreenSharing(false);
      }
    },
  });

  const remoteParticipants = useMemo(() => {
    return [...participants.values()].filter(
      (p) => String(p.id) !== String(authDetails?.user?.id)
    );
  }, [participants, authDetails?.user?.id]);

  useEffect(() => {
    if (participants && conference) {
      const currentUser = [...participants.values()].find(
        (p) => String(p.id) === String(authDetails?.user?.id)
      );
      setMe(currentUser);
    }
  }, [participants, conference, authDetails?.user?.id]);

  const handleLeaveMeeting = () => {
    leave();
    setConference(false);
    setMeetingId("");
    setIsScreenSharing(false);
  };

  const handleScreenShare = async () => {
    if (!me?.id) return;

    // If someone else is presenting
    if (presenterId && presenterId !== me.id) {
      const presenter = participants.get(presenterId);
      toast.info(`${presenter?.displayName || "Another participant"} is currently sharing.`);
      return;
    }

    try {
      if (isScreenSharing && presenterId === me.id) {
        await disableScreenShare();
        setIsScreenSharing(false);
      } else {
        await enableScreenShare();
        setIsScreenSharing(true);
      }
    } catch (error: any) {
      onFailure({
        message: "Screen Share Error",
        error: error.message || "Could not start screen sharing.",
      });
    }
  };

  if (!conference && showConference) {
    return (
      <InitConference meetingId={meetingId} setMeetingId={setMeetingId} />
    );
  }
console.log(meetingId, conference)
  return (
    pathname === "/dashboard/conference" ? (
      <div className="flex flex-col flex-1 p-6 text-white bg-transparent min-h-screen relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 gap-2">
          <div>
            <p className="text-lg font-semibold">{conference?.title}</p>
            <p className="text-sm text-red-500 mt-1">● Recording 00:45:53</p>
            <p className="text-xs text-red-500 mt-1">{meetingId}</p>
          </div>
          <button className="bg-[#5C7C2A] text-white text-sm px-4 py-2 rounded-md">
            + Invite Member
          </button>
        </div>

        {/* Screen Share */}
        {presenterId && (
          <div className="w-full h-[60vh] mb-6 bg-black rounded-md p-2">
            <ScreenShareDisplay participantId={presenterId} isUser={Number(me?.id) === Number(presenterId)} />
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
          {me && <ParticipantVideo
            participantId={me.id}
            label="You"
            isMaximized={maximizedParticipantId === me.id}
            onToggleMaximize={() =>
              setMaximizedParticipantId((prev) => (prev === me.id ? null : me.id))
            }
          />}
          {remoteParticipants.length > 0 ? (
            remoteParticipants.map((participant) => (
              <ParticipantVideo
                participantId={participant.id}
                label={participant.displayName || "Guest"}
                isMaximized={maximizedParticipantId === participant.id}
                onToggleMaximize={() =>
                  setMaximizedParticipantId((prev) =>
                    prev === participant.id ? null : participant.id
                  )
                }
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400">
              Waiting for participants to join...
            </p>
          )}
        </div>

        <ConferenceControl handleLeaveMeeting={handleLeaveMeeting} handleScreenShare={handleScreenShare} isScreenSharing={isScreenSharing} me={me} />
      </div>
    ) : (
      <PictureInPicture maximizedParticipantId={maximizedParticipantId} me={me}
        remoteParticipants={remoteParticipants} handleLeaveMeeting={handleLeaveMeeting} />
    )

  );
};

export default ConferenceContent;
