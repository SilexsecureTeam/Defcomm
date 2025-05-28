import { useContext, useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MeetingContext } from "../../../context/MeetingContext";
import useConference from "../../../hooks/useConference";
import { useMeeting } from "@videosdk.live/react-sdk";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { extractErrorMessage } from "../../../utils/formmaters";
import { createMeeting } from "../Api";

import HeaderBar from "./HeaderBar";
import JoinMeetingForm from "./JoinMeetingForm";
import CreateMeetingForm from "./CreateMeetingForm";
import GroupSelectorModal from "../../dashboard/GroupSelectorModal";
import MyMeetingsSlider from "./MyMeetingsSlider";
import WaitingScreen from "./WaitingScreen";
import MeetingList from "./MeetingList";

const InitConference = ({ meetingId, setMeetingId }) => {
  const { conference, setConference } = useContext(MeetingContext);
  const [mode, setMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [waitingScreen, setWaitingScreen] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const {
    createMeetingMutation,
    getMyMeetingsQuery,
    updateMeetingMutation,
    getMeetingInviteQuery
  } = useConference();
  const { data: createdMeetings = [], isLoading: loadingCreated } = getMyMeetingsQuery;
  const { data: invitedMeetings = [], isLoading: loadingInvited } = getMeetingInviteQuery;
  const { join } = useMeeting();
  const now = new Date();
  const labelMeetings = (meetings, source) =>
    meetings.map(m => ({ ...m, _source: source }));

  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    return [
      ...labelMeetings(createdMeetings.filter(m => new Date(m.startdatetime) > now), "You"),
      ...labelMeetings(invitedMeetings.filter(m => new Date(m.startdatetime) > now), "Invited")
    ].sort((a, b) => new Date(a.startdatetime) - new Date(b.startdatetime));
  }, [createdMeetings, invitedMeetings]);

  const loading = loadingCreated || loadingInvited;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      meeting_id: "",
      subject: "",
      title: "",
      agenda: "",
      startdatetime: "",
      group_user_id: "",
    },
  });
  const {
    register: registerJoin,
    handleSubmit: handleSubmitJoin,
    formState: { errors: errorsJoin },
  } = useForm({
    defaultValues: {
      meetingId: meetingId || "",
    },
  });
  const formatDateTimeForBackend = (datetimeLocal) => {
    if (!datetimeLocal) return "";
    const dateObj = new Date(datetimeLocal);
    return dateObj.toISOString().slice(0, 19).replace("T", " ");
  };
  const generateMeetingId = async () => {
    setIsGeneratingId(true);
    try {
      const randomId = await createMeeting();
      setValue("meeting_id", randomId);
    } catch (e) {
      onFailure({ message: "Failed to generate ID" });
    } finally {
      setIsGeneratingId(false);
    }
  };
  const onCreateMeeting = (data) => {
    setIsCreatingMeeting(true);
    const payload = editingMeeting ? {
       ...data,
       startdatetime: formatDateTimeForBackend(data.startdatetime)
    }:{
      ...data,
      meeting_link: "https://cloud.defcomm.ng",
      group_user_id: selectedGroup?.group_id || "",
      group_user: "group",
      startdatetime: formatDateTimeForBackend(data.startdatetime),
    };

    const mutation = editingMeeting
      ? updateMeetingMutation.mutate // You'll need to implement update logic
      : createMeetingMutation.mutate;

    mutation(payload, {
      onSuccess: () => {
        reset();
        setSelectedGroup(null);
        setEditingMeeting(null);
        setMode(null);
        setIsCreatingMeeting(false);
      },
      onError: (error) => {
        onFailure({
          message: editingMeeting ? "Update Failed" : "Creation Failed",
          error: extractErrorMessage(error),
        });
        setIsCreatingMeeting(false);
      },
    });
  };

  const confirmJoinMeeting = async () => {
    if (!waitingScreen?.meeting_id) {
      onFailure({ message: "Meeting ID is missing" });
      return;
    }
    setIsLoading(true);
    try {
      //setMeetingId(waitingScreen.meeting_id);
      setConference(waitingScreen)
      await join();
    } catch (error) {
      onFailure({
        message: "Meeting Error",
        error: extractErrorMessage(error) || "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setWaitingScreen(null);
    setMeetingId(null);
    setConference(null);
  };
  useEffect(()=>{
    setSelectedGroup(editingMeeting ? {group_id: editingMeeting?.id}: null)
  },[editingMeeting])
  return (
    <div className="min-h-screen p-6 text-white bg-transparent">
      {/* Full View Meeting Detail (Zoom-style) */}
      {waitingScreen ? (
        <WaitingScreen
          waitingScreen={waitingScreen}
          onJoin={() => confirmJoinMeeting(waitingScreen)}
          onCancel={handleCancel} />
      ) : (
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
                    setWaitingScreen(meeting);
                    setMeetingId(meeting.meeting_id);
                  }}

                  onEditMeeting={(meeting) => {
                    setEditingMeeting(meeting);
                    setMode("create");
                    reset({
                      ...meeting,
                      startdatetime: new Date(meeting.startdatetime).toISOString().slice(0, 16),
                    });
                  }}
                  loading={loading}
                  showSource={true}
                />
              )}
            </div>
          )}
          {mode === null &&
            <div className="max-w-lg mx-auto flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-extrabold mb-2 text-center tracking-tight">Welcome to the Conference Room</h1>
              <p className="mb-6 text-gray-300 max-w-xl mx-auto leading-relaxed text-center">
                Connect, collaborate, and create with ease. Here you can view your upcoming sessions,
                join a meeting using an ID, or host a new one tailored to your needs.
              </p>
              <div className="flex gap-6 w-full max-w-md">
                <button
                  className="flex-1 bg-[#5C7C2A] p-4 rounded-md font-semibold hover:bg-[#4e6220]"
                  onClick={() => setMode("join")}
                >
                  View My Meetings
                </button>
                <button
                  className="flex-1 bg-oliveGreen p-4 rounded-md font-semibold hover:bg-olive"
                  onClick={() => {setMode("create"); setEditingMeeting(null); setSelectedGroup(null)}}
                >
                  Create Meeting
                </button>
              </div>
            </div>
          }

          {mode === "join" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
                <button
                  className="font-medium text-sm text-oliveDark bg-slate-100 hover:bg-slate-200 hover:underline p-2 rounded-lg"
                  onClick={() => setShowJoinForm(prev => !prev)}
                >
                  {showJoinForm
                    ? "Join Using Meeting ID"
                    : "Back to My Meetings"}
                </button>
              </div>

              {/* Upcoming Meeting List */}
              {!showJoinForm ? <MeetingList
                meetings={upcomingMeetings}
                showCountdown={true}
                onMeetingClick={(meeting) => {
                  setWaitingScreen(meeting);
                  setMeetingId(meeting.meeting_id);
                }}
                onEditMeeting={(meeting) => {
                    setEditingMeeting(meeting);
                    setMode("create");
                    reset({
                      ...meeting,
                      startdatetime: new Date(meeting.startdatetime).toISOString().slice(0, 16),
                    });
                  }}
                showSource={true}
              /> : (
                <div className="mt-6 max-w-lg mx-auto">
                  <JoinMeetingForm
                    register={registerJoin}
                    errors={errorsJoin}
                    handleSubmit={handleSubmitJoin}
                    onSubmit={(data) => {
                      setConference({ meeting_id: data.meetingId });
                      setWaitingScreen({
                        meeting_id: data.meetingId,
                        title: "Joining...",
                        agenda: "",
                        startdatetime: new Date().toISOString(),
                      });
                    }}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          )}

          {mode === "create" && (
            <div className="mt-6 max-w-lg mx-auto">
              <CreateMeetingForm
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onCreateMeeting}
                isCreatingMeeting={isCreatingMeeting}
                generateMeetingId={generateMeetingId}
                isGeneratingId={isGeneratingId}
                selectedGroup={selectedGroup}
                openGroupSelector={() => setIsGroupModalOpen(true)}
                isEditing={!!editingMeeting}
              />
            </div>
          )}

          <GroupSelectorModal
            selectedGroup={selectedGroup}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              setValue("group_user_id", group?.group_id, { shouldValidate: true });
            }}
            isOpen={isGroupModalOpen}
            onClose={() => setIsGroupModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default InitConference;
