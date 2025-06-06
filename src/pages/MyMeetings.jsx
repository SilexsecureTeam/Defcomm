import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import { MeetingContext } from "../context/MeetingContext";
import { useForm } from "react-hook-form";
import useConference from "../hooks/useConference";
import { useMeeting } from "@videosdk.live/react-sdk";
import { extractErrorMessage } from "../utils/formmaters";
import JoinMeetingForm from "../components/video-sdk/conference/JoinMeetingForm";
import MeetingList from "../components/video-sdk/conference/MeetingList";
import HeaderBar from "../components/video-sdk/conference/HeaderBar";
const MyMeetings = () => {
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const { setConference, setProviderMeetingId } = useContext(MeetingContext);
    const { join } = useMeeting();
    const { getMeetingByIdQuery, getMyMeetingsQuery, getMeetingInviteQuery } = useConference(); // <-- Make sure this exists in your hook
    const [showJoinForm, setShowJoinForm] = useState(false);
    const {
        register: registerJoin,
        handleSubmit: handleSubmitJoin,
        formState: { errors: errorsJoin },
    } = useForm({
        defaultValues: {
            meetingId: meetingId || "",
        },
    });
    const { data: meeting, isLoading } = getMeetingByIdQuery(meetingId)

    const { data: createdMeetings = [], isLoading: loadingCreated } = getMyMeetingsQuery;
    const { data: invitedMeetings = [], isLoading: loadingInvited } = getMeetingInviteQuery;
    const now = new Date();
    const labelMeetings = (meetings, source) =>
        meetings.map(m => ({ ...m, _source: source }));

    const allMeetings = useMemo(() => {
        return [
            ...labelMeetings(createdMeetings, "You"),
            ...labelMeetings(invitedMeetings, "Invited")
        ].sort((a, b) => new Date(b.startdatetime) - new Date(a.startdatetime)); // sort with latest first
    }, [createdMeetings, invitedMeetings]);
    return (
        <div className="space-y-6 max-w-3xl mx-auto text-white">
            <HeaderBar />
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
                <button
                    className="font-medium text-sm text-oliveDark bg-slate-100 hover:bg-slate-200 hover:underline p-2 rounded-lg"
                    onClick={() => setShowJoinForm(prev => !prev)}
                >
                    {showJoinForm
                        ? "Back to My Meetings"
                        : "Join Using Meeting ID"}
                </button>
            </div>

            {/* Upcoming Meeting List */}
            {!showJoinForm ? <MeetingList
                meetings={allMeetings}
                showCountdown={true}
                onMeetingClick={(meeting) => {
                    navigate(`/dashboard/conference/waiting/${meeting?.id}`)
                }}
                onEditMeeting={(meeting) => navigate('/dashboard/conference/create', { state: { data: meeting } })}
                showSource={true}
            /> : (
                <div className="mt-6 max-w-lg mx-auto">
                    <JoinMeetingForm
                        register={registerJoin}
                        errors={errorsJoin}
                        handleSubmit={handleSubmitJoin}
                        onSubmit={(data) => {
                            /*setConference({ meeting_id: data.meetingId });
                            setWaitingScreen({
                              meeting_id: data.meetingId,
                              title: "Joining...",
                              agenda: "",
                              startdatetime: new Date().toISOString(),
                            });*/
                            navigate(`/dashboard/conference/waiting/${data?.id}`);
                        }}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
};

export default MyMeetings;
