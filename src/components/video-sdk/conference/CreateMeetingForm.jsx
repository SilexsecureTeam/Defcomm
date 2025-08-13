import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

import { onFailure } from "../../../utils/notifications/OnFailure";
import {
  extractErrorMessage,
  formatDateTimeForBackend,
} from "../../../utils/formmaters";
import { createMeeting } from "../Api";
import { MeetingContext } from "../../../context/MeetingContext";
import GroupSelectorModal from "../../dashboard/GroupSelectorModal";
import useConference from "../../../hooks/useConference";
import HeaderBar from "./HeaderBar";

const CreateMeetingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location?.state?.data || null;
  const isEditing = !!editData;

  const { createMeetingMutation, updateMeetingMutation } = useConference();

  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

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
      subject: "",
      title: "",
      agenda: "",
      startdatetime: "",
      group_user_id: "",
    },
  });

  useEffect(() => {
    if (isEditing && editData) {
      reset({
        meeting_id: editData.meeting_id || "",
        subject: editData.subject || "",
        title: editData.title || "",
        agenda: editData.agenda || "",
        startdatetime: editData.startdatetime?.slice(0, 16) || "",
        group_user_id: editData.group_user_id || "",
      });

      if (editData.group) {
        setSelectedGroup({
          group_id: editData.group_user_id,
          group_name: editData.group?.group_name || "Selected Group",
        });
      }
    }
  }, [isEditing, editData, reset]);

  const generateMeetingId = async () => {
    setIsGeneratingId(true);
    try {
      const randomId = await createMeeting();
      setValue("meeting_id", randomId, { shouldValidate: true });
    } catch (e) {
      onFailure({ message: "Failed to generate ID" });
    } finally {
      setIsGeneratingId(false);
    }
  };

  const onCreateMeeting = (data) => {
    setIsCreatingMeeting(true);

    const payload = isEditing
      ? {
          id: editData?.id,
          ...data,
          startdatetime: formatDateTimeForBackend(data.startdatetime),
        }
      : {
          ...data,
          meeting_link: "https://cloud.defcomm.ng/dashboard/conference/waiting",
          group_user_id: selectedGroup?.group_id || "",
          group_user: "group",
          startdatetime: formatDateTimeForBackend(data.startdatetime),
        };

    const mutation = isEditing
      ? updateMeetingMutation.mutate
      : createMeetingMutation.mutate;

    mutation(payload, {
      onSuccess: () => {
        reset();
        navigate("/dashboard/conference/my-meetings", { replace: true });
      },
      onError: (error) => {
        onFailure({
          message: isEditing ? "Update Failed" : "Creation Failed",
          error: extractErrorMessage(error),
        });
        setIsCreatingMeeting(false);
      },
    });
  };

  return (
    <div>
      <HeaderBar />
      <form
        onSubmit={handleSubmit(onCreateMeeting)}
        className="w-full text-white"
      >
        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? "Update Meeting" : "Create a New Meeting"}
        </h2>

        {["subject", "title", "agenda"].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-semibold capitalize">
              {field}
            </label>
            <input
              type="text"
              placeholder={field}
              {...register(field, { required: `${field} is required` })}
              className="p-3 border border-gray-300 bg-transparent rounded-md w-full mb-3 text-gray-300"
            />
            {errors[field] && (
              <p className="text-red-500 mb-3">{errors[field].message}</p>
            )}
          </div>
        ))}

        {/* Start Datetime */}
        <label className="block mb-1 font-semibold">Start Date & Time</label>
        <input
          type="datetime-local"
          {...register("startdatetime", {
            required: "Start datetime is required",
          })}
          className="p-3 border border-gray-300 bg-transparent rounded-md w-full mb-6 text-gray-300 placeholder:text-gray-300"
        />
        {errors.startdatetime && (
          <p className="text-red-500 mb-3">{errors.startdatetime.message}</p>
        )}

        {/* Group Selection */}
        {!isEditing && (
          <>
            <label className="block mb-1 font-semibold">Select Group</label>
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setIsGroupModalOpen(true)}
                className="px-3 py-2 bg-[#5C7C2A] rounded-md"
              >
                {selectedGroup?.group_name || "Choose Group"}
              </button>
            </div>
            <input
              type="hidden"
              {...register("group_user_id", { required: "Group is required" })}
              value={selectedGroup?.group_id || ""}
            />
            {errors.group_user_id && (
              <p className="text-red-500 mb-3">
                {errors.group_user_id.message}
              </p>
            )}
          </>
        )}

        {/* Meeting ID */}
        <label className="mb-1 font-semibold flex justify-between items-center">
          Meeting ID
          <button
            type="button"
            onClick={generateMeetingId}
            className="text-sm bg-[#5C7C2A] px-3 py-1 rounded-md hover:bg-[#4e6220] flex items-center gap-2"
          >
            Generate ID{" "}
            {isGeneratingId && <FaSpinner className="animate-spin text-xs" />}
          </button>
        </label>
        <input
          type="text"
          placeholder="Meeting ID"
          {...register("meeting_id", { required: "Meeting ID is required" })}
          className="p-3 border border-gray-300 bg-transparent rounded-md w-full mb-3 text-gray-300"
        />
        {errors.meeting_id && (
          <p className="text-red-500 mb-3">{errors.meeting_id.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isCreatingMeeting}
          className="w-full bg-oliveGreen p-3 rounded-md font-semibold hover:bg-olive disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isEditing ? "Update Meeting" : "Create Meeting"}
          {isCreatingMeeting && <FaSpinner className="animate-spin" />}
        </button>
      </form>

      <GroupSelectorModal
        selectedGroup={selectedGroup}
        onSelectGroup={(group) => {
          setSelectedGroup(group);
          setValue("group_user_id", group?.group_id, { shouldValidate: true });
        }}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </div>
  );
};

export default CreateMeetingForm;
