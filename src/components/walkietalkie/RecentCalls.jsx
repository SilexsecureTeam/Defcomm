import { useNavigate } from "react-router-dom";
import { MdQueueMusic, MdMoreVert } from "react-icons/md";
import { LuAudioLines } from "react-icons/lu";
import useComm from "../../hooks/useComm";
import { FaSpinner } from "react-icons/fa";
import LoaderCard from "./LoaderCard";
import EmptyState from "./EmptyState";

function RecentCalls() {
  const navigate = useNavigate();
  const { getInvitedChannelPending, updateChannelInviteStatus } = useComm();
  const { data, isLoading } = getInvitedChannelPending;
  const { isLoading: isMutating, variables } = updateChannelInviteStatus;

  const handleAccept = (sub_id) => {
    updateChannelInviteStatus.mutate({ sub_id, status: "active" });
  };

  const handleReject = (sub_id) => {
    updateChannelInviteStatus.mutate({ sub_id, status: "reject" });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <MdQueueMusic size={20} className="text-green-400" />
          <span>Recently Invited</span>
        </h2>
        <MdMoreVert size={20} className="text-gray-400 cursor-pointer" />
      </div>

      {isLoading ? (
        <LoaderCard />
      ) : data?.length === 0 ? (
        <EmptyState />
      ) : (
        data.map((call, index) => (
          <div
            key={index}
            className="flex gap-3 items-center mt-4 p-3 bg-gray-800 text-white rounded-md even:bg-oliveGreen even:text-gray-900 shadow-sm"
          >
            <figure className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />

            <section className="flex flex-col justify-center flex-1">
              <p className="font-semibold truncate">{call?.name}</p>
              <span className="text-sm opacity-60 truncate">
                {call?.frequency} – {call?.description || "No description"}
              </span>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAccept(call?.sub_id)}
                  disabled={isMutating && variables?.sub_id === call?.sub_id}
                  className={`text-xs px-3 py-1 rounded transition duration-150 ${
                    isMutating && variables?.sub_id === call?.sub_id
                      ? "bg-green-400 cursor-not-allowed opacity-70"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isMutating && variables?.sub_id === call?.sub_id ? (
                    <FaSpinner className="animate-spin inline-block mr-1" />
                  ) : null}
                  Accept
                </button>

                <button
                  onClick={() => handleReject(call?.sub_id)}
                  disabled={isMutating && variables?.sub_id === call?.sub_id}
                  className={`text-xs px-3 py-1 rounded transition duration-150 ${
                    isMutating && variables?.sub_id === call?.sub_id
                      ? "bg-red-400 cursor-not-allowed opacity-70"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isMutating && variables?.sub_id === call?.sub_id ? (
                    <FaSpinner className="animate-spin inline-block mr-1" />
                  ) : null}
                  Reject
                </button>
              </div>
            </section>

            <section className="flex flex-col items-end gap-1">
              <LuAudioLines className="size-4 md:size-6 text-gray-300" />
              <span className="text-xs font-medium">{call.time}</span>
            </section>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentCalls;
