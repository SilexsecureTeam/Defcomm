import { useState, useContext } from 'react';
import { createMeeting } from "./Api";
import { onFailure } from "../../utils/notifications/OnFailure";
import { MeetingContext } from "../../context/MeetingContext";
import { extractErrorMessage } from "../../utils/formmaters";
import { useMeeting } from "@videosdk.live/react-sdk";
import { FaSpinner } from "react-icons/fa";
const InitConference = ({ meetingId, setMeetingId }) => {
    const { setConference } = useContext(MeetingContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);

    const { join } = useMeeting();
    const handleCreateMeeting = async () => {
        setIsCreatingMeeting(true);
        try {
            const newMeetingId = await createMeeting();
            if (!newMeetingId) throw new Error("No meeting ID returned.");
            setMeetingId(newMeetingId);
        } catch (error) {
            onFailure({ message: "Meeting Creation Failed", error: extractErrorMessage(error) });
        } finally {
            setIsCreatingMeeting(false);
        }
    };

    const handleJoinMeeting = async () => {
        setIsLoading(true);
        try {
            await join();
            setConference(true);
        } catch (error) {
            setConference(false);
            const message = extractErrorMessage(error) || "Unknown error occurred";
            onFailure({ message: "Meeting Error", error: message });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-transparent text-white p-6">
            <h2 className="text-2xl font-semibold mb-6">Enter Meeting ID to Join</h2>
            <input
                type="text"
                placeholder="Paste Meeting ID here"
                value={meetingId || ""}
                onInput={(e) => setMeetingId(e.target.value)}
                className="p-3 border border-gray-300 placeholder:text-gray-300 bg-transparent rounded-md w-full max-w-sm mb-4"
            />
            <div className="flex gap-4 text-sm">
                <button
                    onClick={handleJoinMeeting}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-[#5C7C2A] p-2 md:px-6 md:py-3 rounded-md text-white font-bold hover:bg-[#4e6220] disabled:opacity-50"
                >
                    Join Meeting {isLoading && <FaSpinner className="animate-spin mx-auto" />}
                </button>
                <button
                    onClick={handleCreateMeeting}
                    disabled={isCreatingMeeting}
                    className="flex items-center justify-center gap-2 bg-oliveGreen p-2 md:px-6 md:py-3 rounded-md text-white font-bold hover:bg-olive disabled:opacity-50"
                >
                    Start New Conference
                    {isCreatingMeeting && <FaSpinner className="animate-spin mx-auto" />}
                </button>
            </div>
        </div>
    )
}

export default InitConference;