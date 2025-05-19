import React, { useMemo } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";

const ScreenShareDisplay = ({ participantId }: { participantId: string }) => {
  const { screenShareStream, isScreenShareOn } = useParticipant(participantId);

  const screenStream = useMemo(() => {
    if (isScreenShareOn && screenShareStream) {
      const stream = new MediaStream();
      stream.addTrack(screenShareStream.track);
      return stream;
    }
    return null;
  }, [isScreenShareOn, screenShareStream]);

  if (!screenStream) return null;

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        playing
        muted
        url={screenStream}
        width="100%"
        height="100%"
        className="object-contain"
      />
    </div>
  );
};

export default ScreenShareDisplay;
