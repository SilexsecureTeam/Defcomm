import React, { useContext, useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import useGroups from "../../hooks/useGroup";
import useChat from "../../hooks/useChat";
import GroupSlide from "../GroupSlide";
import { ChatContext } from "../../context/ChatContext";
import useConference from "../../hooks/useConference";
import { toast } from "react-toastify";
import { onSuccess } from "../../utils/notifications/OnSuccess";

const AddUsersToMeeting = ({ selectedMeeting }) => {
  const { useFetchGroups, useFetchGroupMembers } = useGroups();
  const { fetchContacts } = useChat();
  const { addUserToMeetingMutation } = useConference();
  const { setModalTitle } = useContext(ChatContext);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  setModalTitle(
    `Add Users to Meeting: ${selectedMeeting?.title || "New Meeting"}`
  );

  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    staleTime: 0,
  });

  const { data: groups, isLoading: isLoadingGroups } = useFetchGroups();
  const { data: groupMembers, isLoading: isLoadingGroupMembers } =
    useFetchGroupMembers(selectedGroup?.group_id);

  const toggleUserSelection = (member) => {
    const exists = selectedUsers.find((u) => u.id === member.id);
    if (exists) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== member.id));
    } else {
      setSelectedUsers((prev) => [...prev, member]);
    }
  };

  const handleInvite = async () => {
    if (!selectedMeeting?.id) {
      toast.error("No meeting selected.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userIds = selectedUsers.map((u) => u.member_id_encrpt);

      await addUserToMeetingMutation.mutateAsync({
        meetings_id: selectedMeeting.id,
        users: JSON.stringify(userIds), // Array of encrypted IDs
      });

      // ✅ Trigger your custom success handler
      onSuccess?.({
        message: "User added to meeting!",
        success: `Successfully invited ${selectedUsers.length} user${
          selectedUsers.length === 1 ? "" : "s"
        }.`,
      });

      // ✅ Reset selection
      setSelectedUsers([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to invite users.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 w-[80vw] md:w-[600px] min-h-32 py-14 bg-oliveDark text-white">
      {/* Group List */}
      {isLoadingGroups ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-white text-2xl" />
        </div>
      ) : groups?.length > 0 ? (
        <div className="sticky top-0 z-10 bg-oliveDark">
          <GroupSlide
            groups={groups}
            setSelectedGroup={setSelectedGroup}
            forceSingleView={true}
          />
        </div>
      ) : (
        <div>No groups available</div>
      )}

      {/* Group Members */}
      {selectedGroup && (
        <div className="mt-3">
          {isLoadingContacts || isLoadingGroupMembers ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-white text-2xl" />
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2">
                <strong>{selectedGroup?.group_name}</strong> - Members:
              </h3>
              <ul className="space-y-2">
                {groupMembers?.map((member) => {
                  if (!member?.member_name) return null;

                  const isAlreadyContact = contacts?.some(
                    (c) => c.contact_id === member?.member_id
                  );

                  const isSelected = selectedUsers.some(
                    (u) => u.id === member.id
                  );

                  return (
                    <li
                      key={member?.id}
                      onClick={() => toggleUserSelection(member)}
                      className={`bg-gray-700 p-3 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-600 ${
                        isSelected ? "ring-2 ring-lime-400" : ""
                      }`}
                    >
                      <span>{member?.member_name || "Anonymous"}</span>
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

      {/* Invite Button */}
      {selectedUsers.length > 0 && (
        <div className="sticky bottom-2 mt-6 flex justify-end">
          <button
            onClick={handleInvite}
            disabled={isSubmitting}
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-4 py-2 rounded-md transition-all duration-150 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" /> Inviting...
              </>
            ) : (
              <>
                Invite {selectedUsers.length}{" "}
                {selectedUsers.length === 1 ? "user" : "users"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUsersToMeeting;
