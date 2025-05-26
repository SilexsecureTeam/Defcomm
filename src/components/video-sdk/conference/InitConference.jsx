// InitConference.jsx
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { MeetingContext } from "../../../context/MeetingContext";
import useConference from "../../../hooks/useConference";
import { useMeeting } from "@videosdk.live/react-sdk";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { extractErrorMessage } from "../../../utils/formmaters";
import { createMeeting } from "../Api";

import HeaderBar from "./HeaderBar";
import JoinMeetingForm from "./JoinMeetingForm";
import CreateMeetingForm from "./CreateMeetingForm";

const InitConference = ({ meetingId, setMeetingId }) => {
  const { setConference } = useContext(MeetingContext);
  const [mode, setMode] = useState(null); // null | "join" | "create"
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);

  const { createMeetingMutation } = useConference();
  const { join } = useMeeting();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      meeting_id: "",
      subject: "new meeting",
      title: "ok",
      agenda: "in let",
      startdatetime: "",
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

    const payload = {
      ...data,
      meeting_link: "https://mail.google.com/",
      startdatetime: formatDateTimeForBackend(data.startdatetime),
    };

    createMeetingMutation.mutate(payload, {
      onSuccess: (response) => {
        const newMeetingId = response?.data?.meeting_id;
        if (newMeetingId) {
          setMeetingId(newMeetingId);
          reset();
          setMode("join");
        }
        setIsCreatingMeeting(false);
      },
      onError: (error) => {
        onFailure({
          message: "Meeting Creation Failed",
          error: extractErrorMessage(error),
        });
        setIsCreatingMeeting(false);
      },
    });
  };

  const onJoinMeeting = async (data) => {
    setIsLoading(true);
    setMeetingId(data.meetingId);

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
    <div className="max-w-lg mx-auto p-6 bg-transparent rounded-md text-white min-h-[60vh] flex flex-col">
      {mode && <HeaderBar onBack={() => setMode(null)} />}
      {!mode && (
        <div className="flex flex-col items-center justify-center text-center flex-grow">
          <h1 className="text-3xl font-bold mb-6">Welcome to the Conference Room</h1>
          <p className="mb-8 text-gray-300">
            Join an existing meeting with a Meeting ID or create a new conference to start collaborating.
          </p>
          <div className="flex gap-6 w-full">
            <button
              className="flex-grow bg-[#5C7C2A] p-4 rounded-md font-semibold hover:bg-[#4e6220]"
              onClick={() => setMode("join")}
            >
              Join Meeting
            </button>
            <button
              className="flex-grow bg-oliveGreen p-4 rounded-md font-semibold hover:bg-olive"
              onClick={() => setMode("create")}
            >
              Create Meeting
            </button>
          </div>
        </div>
      )}

      {mode === "join" && (
        <JoinMeetingForm
          register={registerJoin}
          errors={errorsJoin}
          handleSubmit={handleSubmitJoin}
          onSubmit={onJoinMeeting}
          isLoading={isLoading}
        />
      )}

      {mode === "create" && (
        <CreateMeetingForm
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onCreateMeeting}
          isCreatingMeeting={isCreatingMeeting}
          generateMeetingId={generateMeetingId}
          isGeneratingId={isGeneratingId}
        />
      )}
    </div>
  );
};

export default InitConference;
