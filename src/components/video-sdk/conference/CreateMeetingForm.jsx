import { FaSpinner } from "react-icons/fa";

const CreateMeetingForm = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  isCreatingMeeting,
  generateMeetingId,
  isGeneratingId,
  selectedGroup,
  openGroupSelector,
  isEditing = false
}) =>{

  return(
  <form onSubmit={handleSubmit(onSubmit)} className="w-full">
    <h2 className="text-2xl font-semibold mb-6">
      {isEditing ? "Update Meeting" : "Create a New Meeting"}
    </h2>
    {["subject", "title", "agenda"].map((field) => (
      <div key={field}>
        <label className="block mb-1 font-semibold capitalize">{field}</label>
        <input
          type="text"
          placeholder={field}
          {...register(field, { required: `${field} is required` })}
          className="p-3 border border-gray-300 bg-transparent rounded-md w-full mb-3 text-gray-300"
        />
        {errors[field] && <p className="text-red-500 mb-3">{errors[field].message}</p>}
      </div>
    ))}

    {/* Start Datetime */}
    <label className="block mb-1 font-semibold">Start Date & Time</label>
    <input
      type="datetime-local"
      {...register("startdatetime", { required: "Start datetime is required" })}
      className="p-3 border border-gray-300 bg-transparent rounded-md w-full mb-6 text-gray-300 placeholder:text-gray-300"
    />
    {errors.startdatetime && <p className="text-red-500 mb-3">{errors.startdatetime.message}</p>}

    {/* Group Selection */}
    {!isEditing && 
    <><label className="block mb-1 font-semibold">Select Group</label>
    <div className="flex items-center gap-2 mb-3">
      <button
        type="button"
        onClick={openGroupSelector}
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
      <p className="text-red-500 mb-3">{errors.group_user_id.message}</p>
    )}</>}

    {/* Meeting ID */}
    <label className="mb-1 font-semibold flex justify-between items-center">
      Meeting ID
      <button
        type="button"
        onClick={generateMeetingId}
        className="text-sm bg-[#5C7C2A] px-3 py-1 rounded-md hover:bg-[#4e6220] flex items-center gap-2"
      >
        Generate ID {isGeneratingId && <FaSpinner className="animate-spin text-xs" />}
      </button>
    </label>
    <input
      type="text"
      placeholder="Meeting ID"
      {...register("meeting_id", { required: "Meeting ID is required" })}
      className="p-3 border border-gray-300 bg-transparent rounded-md w-full mb-3 text-gray-300"
    />
    {errors.meeting_id && <p className="text-red-500 mb-3">{errors.meeting_id.message}</p>}

    <button
      type="submit"
      disabled={isCreatingMeeting}
      className="w-full bg-oliveGreen p-3 rounded-md font-semibold hover:bg-olive disabled:opacity-50 flex justify-center items-center gap-2"
    >
      {isEditing ? "Update Meeting" : "Create Meeting"}{" "}
      {isCreatingMeeting && <FaSpinner className="animate-spin" />}
    </button>
  </form>
);
}

export default CreateMeetingForm;
