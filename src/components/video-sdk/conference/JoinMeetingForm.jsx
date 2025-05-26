import { FaSpinner } from "react-icons/fa";

const JoinMeetingForm = ({ register, errors, handleSubmit, onSubmit, isLoading }) => (
  <form onSubmit={handleSubmit(onSubmit)} className="w-full">
    <h2 className="text-2xl font-semibold mb-6">Join a Meeting</h2>
    <input
      type="text"
      placeholder="Enter Meeting ID"
      {...register("meetingId", { required: "Meeting ID is required" })}
      className="p-3 border border-gray-300 placeholder:text-gray-300 bg-transparent rounded-md w-full mb-4 text-white"
    />
    {errors.meetingId && (
      <p className="text-red-500 mb-4">{errors.meetingId.message}</p>
    )}

    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-[#5C7C2A] p-3 rounded-md font-semibold hover:bg-[#4e6220] flex justify-center items-center gap-2"
    >
      Join Meeting {isLoading && <FaSpinner className="animate-spin" />}
    </button>
  </form>
);

export default JoinMeetingForm;
