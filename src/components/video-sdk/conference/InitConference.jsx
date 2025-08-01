import { useContext, useState, useMemo, useEffect } from "react";
import { MeetingContext } from "../../../context/MeetingContext";
import useConference from "../../../hooks/useConference";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import MyMeetingsSlider from "./MyMeetingsSlider";

const InitConference = ({ meetingId, setMeetingId }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const { getMyMeetingsQuery, getMeetingInviteQuery } = useConference();
  const { data: createdMeetings = [], isLoading: loadingCreated } =
    getMyMeetingsQuery;
  const { data: invitedMeetings = [], isLoading: loadingInvited } =
    getMeetingInviteQuery;
  const { join } = useMeeting();
  const now = new Date();
  const labelMeetings = (meetings, source) =>
    meetings.map((m) => ({ ...m, _source: source }));

  const allMeetings = useMemo(() => {
    return [
      ...labelMeetings(createdMeetings, "You"),
      ...labelMeetings(invitedMeetings, "Invited"),
    ].sort((a, b) => new Date(b.startdatetime) - new Date(a.startdatetime)); // sort with latest first
  }, [createdMeetings, invitedMeetings]);

  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    return [
      ...labelMeetings(
        createdMeetings.filter((m) => new Date(m.startdatetime) > now),
        "You"
      ),
      ...labelMeetings(
        invitedMeetings.filter((m) => new Date(m.startdatetime) > now),
        "Invited"
      ),
    ].sort((a, b) => new Date(a.startdatetime) - new Date(b.startdatetime));
  }, [createdMeetings, invitedMeetings]);

  const loading = loadingCreated || loadingInvited;

  return (
    <div className="min-h-screen p-6 text-white bg-transparent">
      {/* Full View Meeting Detail (Zoom-style) */}
      {
        <>
          {mode && <HeaderBar onBack={() => setMode(null)} />}
          {/* Show meeting sliders and actions if no meeting selected */}
          {mode === null && (
            <div className="space-y-8">
              {upcomingMeetings.length > 0 && (
                <MyMeetingsSlider
                  title="Upcoming Meetings"
                  meetings={upcomingMeetings}
                  showCountdown={true}
                  onMeetingClick={(meeting) => {
                    /*setWaitingScreen(meeting);
                    setMeetingId(meeting.meeting_id);*/
                    navigate(`/dashboard/conference/waiting/${meeting?.id}`);
                  }}
                  onEditMeeting={(meeting) => {
                    navigate("/dashboard/conference/create", {
                      state: { data: meeting },
                    });
                  }}
                  loading={loading}
                  showSource={true}
                />
              )}
            </div>
          )}
          {mode === null && (
            <div className="max-w-lg mx-auto flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-extrabold mb-2 text-center tracking-tight">
                Welcome to the Conference Room
              </h1>
              <p className="mb-6 text-gray-300 max-w-xl mx-auto leading-relaxed text-center">
                Connect, collaborate, and create with ease. Here you can view
                your upcoming sessions, join a meeting using an ID, or host a
                new one tailored to your needs.
              </p>
              <div className="flex gap-6 w-full max-w-md">
                <button
                  className="flex-1 bg-[#5C7C2A] p-4 rounded-md font-semibold hover:bg-[#4e6220]"
                  onClick={() => navigate("/dashboard/conference/my-meetings")}
                >
                  View My Meetings
                </button>
                <button
                  className="flex-1 bg-oliveGreen p-4 rounded-md font-semibold hover:bg-olive"
                  onClick={() => navigate("/dashboard/conference/create")}
                >
                  Create Meeting
                </button>
              </div>
            </div>
          )}
        </>
      }
    </div>
  );
};

export default InitConference;
