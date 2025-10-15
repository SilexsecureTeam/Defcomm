import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useConference from "../hooks/useConference";
import MeetingList from "../components/video-sdk/conference/MeetingList";
import HeaderBar from "../components/video-sdk/conference/HeaderBar";

const MyMeetings = ({ all = false }) => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { getMyMeetingsQuery, getMeetingInviteQuery } = useConference();

  const { data: createdMeetings = [], isLoading: loadingCreated } =
    getMyMeetingsQuery;
  const { data: invitedMeetings = [], isLoading: loadingInvited } =
    getMeetingInviteQuery;

  const labelMeetings = (meetings, source) =>
    meetings.map((m) => ({ ...m, _source: source }));

  const meetingsToShow = useMemo(() => {
    if (all) {
      // All meetings: created + invited
      return [
        ...labelMeetings(createdMeetings, "You"),
        ...labelMeetings(invitedMeetings, "Invited"),
      ].sort((a, b) => new Date(b.startdatetime) - new Date(a.startdatetime));
    } else {
      // Only your meetings
      return labelMeetings(createdMeetings, "You").sort(
        (a, b) => new Date(b.startdatetime) - new Date(a.startdatetime)
      );
    }
  }, [all, createdMeetings, invitedMeetings]);
  const headerTitle = all ? "All Meetings" : "My Meetings";

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-white">
      <HeaderBar />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{headerTitle}</h2>
      </div>

      <MeetingList
        meetings={meetingsToShow}
        showCountdown={true}
        onMeetingClick={(meeting) => {
          navigate(`/dashboard/conference/waiting/${meeting?.id}`);
        }}
        loading={loadingCreated || loadingInvited}
        onEditMeeting={(meeting) =>
          navigate("/dashboard/conference/create", {
            state: { data: meeting },
          })
        }
        showSource={true}
      />
    </div>
  );
};

export default MyMeetings;
