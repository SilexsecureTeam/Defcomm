import { useContext, useEffect, useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import useGroups from "../../hooks/useGroup";
import useChat from "../../hooks/useChat";
import useConference from "../../hooks/useConference";
import useComm from "../../hooks/useComm";

import GroupSlide from "../GroupSlide";
import { ChatContext } from "../../context/ChatContext";
import { onSuccess } from "../../utils/notifications/OnSuccess";

const AddUsersToMeeting = ({
  selectedMeeting = null,
  mode = "meeting", // meeting | channel | data
  onSelectUsers,
  onClose,
}) => {
  const { useFetchGroups, useFetchGroupMembers } = useGroups();
  const { fetchContacts } = useChat();
  const { addUserToMeetingMutation } = useConference();
  const { addUserToChannel } = useComm();
  const { setModalTitle } = useContext(ChatContext);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------------------- Modal Title -------------------- */
  useEffect(() => {
    if (mode === "channel") {
      setModalTitle(`Add Users to Channel: ${selectedMeeting?.name || ""}`);
    } else if (mode === "data") {
      setModalTitle("Select Users");
    } else {
      setModalTitle(`Add Users to Meeting: ${selectedMeeting?.title || ""}`);
    }
  }, [mode, selectedMeeting, setModalTitle]);

  /* -------------------- Data Fetching -------------------- */
  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    staleTime: 0,
  });

  const { data: groups, isLoading: groupLoading } = useFetchGroups();

  const { data: groupMembers, isLoading: isLoadingGroupMembers } =
    useFetchGroupMembers(selectedGroup?.group_id);

  /* -------------------- Selection Logic -------------------- */
  const toggleUserSelection = (member) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === member.id);
      return exists
        ? prev.filter((u) => u.id !== member.id)
        : [...prev, member];
    });
  };

  /* -------------------- Submit / Return Data -------------------- */
  const handleInvite = async () => {
    // DATA MODE → return selected users only
    if (mode === "data") {
      if (!selectedUsers.length) {
        toast.error("Please select at least one user");
        return;
      }

      onSelectUsers?.(selectedUsers);
      onClose?.();
      return;
    }

    // CHANNEL / MEETING MODE
    if (mode === "channel" && !selectedMeeting?.channel_id) {
      toast.error("No channel selected");
      return;
    }

    if (mode === "meeting" && !selectedMeeting?.id) {
      toast.error("No meeting selected");
      return;
    }

    setIsSubmitting(true);

    try {
      const userIds = selectedUsers.map((u) => u.member_id_encrpt);

      if (mode === "channel") {
        await addUserToChannel.mutateAsync({
          channel_id: selectedMeeting.channel_id,
          users: JSON.stringify(userIds),
        });

        onSuccess({
          message: "Users added to channel",
          success: `Invited ${selectedUsers.length} user${
            selectedUsers.length === 1 ? "" : "s"
          }`,
        });
      } else {
        await addUserToMeetingMutation.mutateAsync({
          meetings_id: selectedMeeting.id,
          users: JSON.stringify(userIds),
        });

        onSuccess({
          message: "Users added to meeting",
          success: `Invited ${selectedUsers.length} user${
            selectedUsers.length === 1 ? "" : "s"
          }`,
        });
      }

      setSelectedUsers([]);
      onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-5 w-[80vw] max-w-[600px] min-h-32 py-10 bg-oliveDark text-white">
      {/* Groups */}
      {groupLoading ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : groups?.length ? (
        <div className="sticky top-0 z-10 bg-oliveDark">
          <GroupSlide
            groups={groups}
            setSelectedGroup={setSelectedGroup}
            forceSingleView
          />
        </div>
      ) : (
        <p>No groups available</p>
      )}

      {/* Members */}
      {selectedGroup && (
        <div className="mt-4">
          {isLoadingContacts || isLoadingGroupMembers ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-2xl" />
            </div>
          ) : (
            <>
              <h3 className="font-bold mb-2">
                {selectedGroup.group_name} — Members
              </h3>

              <ul className="space-y-2">
                {groupMembers?.map((member) => {
                  if (!member?.member_name) return null;

                  const isSelected = selectedUsers.some(
                    (u) => u.id === member.id
                  );

                  const isAlreadyContact = contacts?.some(
                    (c) => c.contact_id === member.member_id
                  );

                  return (
                    <li
                      key={member.id}
                      onClick={() => toggleUserSelection(member)}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center
                        ${
                          isSelected
                            ? "bg-gray-600 ring-2 ring-lime-400"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                      <span>{member.member_name}</span>

                      {isSelected ? (
                        <FaCheck className="text-lime-400" />
                      ) : isAlreadyContact ? (
                        <span className="text-xs text-gray-300">Contact</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Action Button */}
      {selectedUsers.length > 0 && (
        <div className="sticky bottom-2 mt-6 flex justify-end">
          <button
            onClick={handleInvite}
            disabled={isSubmitting}
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : mode === "data" ? (
              `Select ${selectedUsers.length} user${
                selectedUsers.length === 1 ? "" : "s"
              }`
            ) : (
              `Invite ${selectedUsers.length}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUsersToMeeting;
