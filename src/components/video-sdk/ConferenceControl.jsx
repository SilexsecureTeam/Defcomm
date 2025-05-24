import { useState, useContext, useEffect } from 'react'
import {
    FaPhone, FaMicrophoneSlash, FaMicrophone, FaVideoSlash,
    FaVideo, FaVolumeUp, FaCog, FaDesktop, FaStopCircle, FaHandPaper, FaRegHandPaper
} from "react-icons/fa";
import {
    useMeeting,
    useParticipant,
    usePubSub
} from "@videosdk.live/react-sdk";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

import { toast } from 'react-toastify';

const ConferenceControl = ({ handleLeaveMeeting, handleScreenShare, isScreenSharing, me }) => {
    const {
        toggleMic,
        toggleWebcam,
        presenterId,
    } = useMeeting();
    const { webcamOn, micOn } = useParticipant(me?.id ?? "", {});
    const { publish, messages } = usePubSub("HAND_RAISE");
    const [handRaised, setHandRaised] = useState(false);
    const { authDetails } = useContext(AuthContext);
    const { setShowSettings } = useContext(ChatContext)

    const handleRaiseHand = () => {
        const newRaiseState = !handRaised;
        publish({
            name: authDetails?.user?.name,
            id: me?.id,
            raised: newRaiseState,
            timestamp: new Date().toISOString(),
        });

        setHandRaised(newRaiseState);
    };

    useEffect(() => {
        if (messages.length) {
            const latest = messages[messages.length - 1];
            const { id, name, raised } = latest.message;

            if (id === me?.id) {
                setHandRaised(raised);
            } else if (raised) {
                toast.info(`${name || "Someone"} raised their hand ✋`);
            }
        }
    }, [messages, me?.id]);

    return (
        <div className="sticky bottom-0 bg-black/70 flex justify-center items-center gap-8 text-2xl py-4 z-10" >
            <button onClick={() => toggleMic()} aria-label="Toggle Microphone" className={`text-gray-500 hover:text-white ${micOn ? "text-white" : ""}`}>
                {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            <button onClick={() => toggleWebcam()} aria-label="Toggle Camera" className={`text-gray-500 hover:text-white ${webcamOn ? "text-white" : ""}`}>
                {webcamOn ? <FaVideo /> : <FaVideoSlash />}
            </button>

            <button
                disabled={presenterId && presenterId !== me?.id}
                className={`hidden md:block text-gray-500 hover:text-white ${isScreenSharing && presenterId === me?.id ? "text-green-400" : ""
                    } ${presenterId && presenterId !== me?.id ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleScreenShare}
                aria-label={isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
            >
                {isScreenSharing && presenterId === me?.id ? <FaStopCircle /> : <FaDesktop />}
            </button>

            <button onClick={handleLeaveMeeting} className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700" aria-label="Leave Meeting">
                <FaPhone />
            </button>

            {/* <button className="text-gray-500 hover:text-white" aria-label="Volume Control">
                <FaVolumeUp />
            </button> */}

            <button onClick={handleRaiseHand} aria-label="Raise Hand" className="text-yellow-400 hover:text-yellow-500">
                {!handRaised ? <FaRegHandPaper /> : <FaHandPaper />}
            </button>

            <button onClick={()=>setShowSettings(true)} className="text-gray-500 hover:text-white" aria-label="Settings">
                <FaCog />
            </button>
        </div>
    )
}

export default ConferenceControl