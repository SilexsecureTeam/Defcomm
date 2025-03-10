import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import useGroups from "../hooks/useGroup";
import { motion } from "framer-motion";
import mainLogo from "../assets/logo-icon.png";
import GroupSlide from "../components/GroupSlide";

const Groups = () => {
    const { useFetchGroups, useFetchPendingGroups, acceptMutation, declineMutation, useFetchGroupMembers } = useGroups();
    const { data: groups, isLoading } = useFetchGroups();
    const { data: invitations, isLoading: loadingInvitations } = useFetchPendingGroups();

    // Track loading state for each invitation
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: string | null }>({});
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    
    const handleAccept = async (id: string) => {
        setLoadingStates((prev) => ({ ...prev, [id]: "accepting" }));
        await acceptMutation.mutateAsync(id);
        setLoadingStates((prev) => ({ ...prev, [id]: null }));
    };

    const handleDecline = async (id: string) => {
        setLoadingStates((prev) => ({ ...prev, [id]: "declining" }));
        await declineMutation.mutateAsync(id);
        setLoadingStates((prev) => ({ ...prev, [id]: null }));
    };

     // Fetch group members when a group is selected
     const { data: groupMembers, isLoading: isGroupMembersLoading } = useFetchGroupMembers(selectedGroup?.id);

    return (
        <div className="p-6 text-white flex flex-col gap-6">
            {/* Your Groups Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
                {isLoading ? (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="">
                        {groups?.length ? (
                            <GroupSlide groups={groups} setSelectedGroup={setSelectedGroup} />
                        ) : (
                            <p className="text-gray-400">No groups found.</p>
                        )}
                    </div>
                )}
            </section>

            {/* Group Members Section */}
            {selectedGroup && (
                <section className="bg-gray-800 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4"><strong>{selectedGroup?.group_name} -</strong> Group Members</h2>
                    {isGroupMembersLoading ? (
                        <div className="flex justify-center">
                            <FaSpinner className="animate-spin text-white text-2xl" />
                        </div>
                    ) : groupMembers?.length ? (
                        <ul className="space-y-2">
                            {groupMembers.map((member) => (
                                <li key={member.id} className="p-2 bg-gray-700 rounded-md">{member.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No members found.</p>
                    )}
                </section>
            )}

            {/* Pending Invitations Section */}
            <section className="bg-oliveGreen/60 p-5 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Pending Invitations</h2>
                {loadingInvitations ? (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : invitations?.length ? (
                    <ul className="space-y-4">
                        {invitations.map((inv) => (
                            <li key={inv.id} className="p-4 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-md gap-1">
                                <span className="text-sm md:text-lg font-medium">{inv.group_name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(inv.id)}
                                        className="bg-oliveLight hover:bg-oliveDark text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                        disabled={loadingStates[inv.id] === "accepting"}
                                    >
                                        {loadingStates[inv.id] === "accepting" && (
                                            <FaSpinner className="animate-spin text-white" />
                                        )}
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(inv.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                        disabled={loadingStates[inv.id] === "declining"}
                                    >
                                        {loadingStates[inv.id] === "declining" && (
                                            <FaSpinner className="animate-spin text-white" />
                                        )}
                                        Decline
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No pending invitations.</p>
                )}
            </section>
        </div>
    );
};

export default Groups;
