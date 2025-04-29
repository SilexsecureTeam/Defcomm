import React, { useState } from 'react'
import Modal from '../modal/Modal';
import GroupSlide from "../GroupSlide";
import { FaCheck, FaSpinner } from 'react-icons/fa6';
import useGroups from '../../hooks/useGroup';
import useChat from '../../hooks/useChat';
import { useQuery } from '@tanstack/react-query';
const AddContactInterface = () => {
    const { useFetchGroups, useFetchGroupMembers, addContactMutation } = useGroups();
    const { fetchContacts } = useChat();
    // Fetch Contacts using React Query
    const { data: contacts, isLoading } = useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContacts,
        staleTime: 0,
    });

    //add member to contact
    const { data: groups, isLoading:groupLoading } = useFetchGroups();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});

    // Fetch group members when a group is selected
    const { data: groupMembers, isLoading: isGroupMembersLoading } = useFetchGroupMembers(selectedGroup?.group_id);

    const handleAddContact = async (member) => {
        setLoadingStates((prev) => ({ ...prev, [member?.id]: "adding" }));

        try {
            await addContactMutation.mutateAsync(member?.member_id_encrpt);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [member?.id]: null })); // ✅ Stops loader in all cases
        }
    };


    return (
        <div className="p-5 w-[80vw] md:w-[600px] min-h-32 max-h-[80vh] py-14 bg-oliveDark text-white">
            {/* Show loading indicator when groups are being fetched */}
            {groupLoading ? (
                <div className="flex justify-center">
                    <FaSpinner className="animate-spin text-white text-2xl" />
                </div>
            ) : groups?.length > 0 ? (
                <GroupSlide groups={groups} setSelectedGroup={setSelectedGroup} forceSingleView={true} />
            ) : (
                <div>No groups available</div>
            )}

            {/* Show group members when a group is selected */}
            {selectedGroup && (
                <div className="mt-3">
                    {isGroupMembersLoading ?
                        <div className="flex justify-center">
                            <FaSpinner className="animate-spin text-white text-2xl" />
                        </div>
                        : <>
                            <h3 className="text-lg font-bold"><strong>{selectedGroup?.group_name} -</strong> Members:</h3>
                            <ul className="mt-2 space-y-2">
                                {groupMembers?.map((member) => {
                                    if (!member?.member_name) return null
                                    const isAlreadyAdded = contacts?.some((c) => c.contact_id === member?.member_id);
                                    return (
                                        <li
                                            key={member?.id}
                                            onClick={() => handleAddContact(member)}
                                            className="bg-gray-700 p-3 rounded-md flex items-center justify-between gap-2 cursor-pointer"
                                            disabled={loadingStates[member?.id] === "adding"}
                                        >
                                            {member?.member_name || "Anonymous"}
                                            {isAlreadyAdded ? (
                                                <FaCheck className="text-green-400" />
                                            ) : loadingStates[member?.id] === "adding" ? (
                                                <FaSpinner className="animate-spin text-white" />
                                            ) : null}
                                        </li>
                                    )
                                })}
                            </ul>
                        </>}

                </div>
            )}
        </div>
    )
}

export default AddContactInterface