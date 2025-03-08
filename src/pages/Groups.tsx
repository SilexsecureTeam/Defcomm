import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useGroups from "../hooks/useGroup";
import { motion } from "framer-motion";
import mainLogo from "../assets/logo-icon.png";
interface Group {
    id: string;
    name: string;
}

interface Invitation {
    id: string;
    groupName: string;
}


const fetchPendingInvitations = async () => {
    const { data } = await axios.get<Invitation[]>("/api/invitations/pending");
    return data;
};

const Groups = () => {
    const queryClient = useQueryClient();

    const { useFetchGroups, useFetchPendingGroups } = useGroups();

    // Fetch groups
    const { data: groups, isLoading, error } = useFetchGroups();
    // Fetch pending groups
    const { data: invitations, isLoading: loadingInvitations } = useFetchPendingGroups();


    // Accept invitation mutation
    const acceptMutation = useMutation({
        mutationFn: (invitationId: string) =>
            axios.post(`/api/invitations/${invitationId}/accept`),
        onSuccess: () => {
            queryClient.invalidateQueries(["groups"]);
            queryClient.invalidateQueries(["pendingInvitations"]);
        },
    });

    // Decline invitation mutation
    const declineMutation = useMutation({
        mutationFn: (invitationId: string) =>
            axios.post(`/api/invitations/${invitationId}/decline`),
        onSuccess: () => {
            queryClient.invalidateQueries(["pendingInvitations"]);
        },
    });

    return (
        <div className="p-6 text-white flex flex-col gap-4">
            <section>
                <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
                {isLoading ? (
                    <p>Loading groups...</p>
                ) : groups?.length ? groups?.map((group, index) => (
                    <motion.div
                        key={group?.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center gap-2 cursor-pointer hover:bg-oliveLight"
                        onClick={() => setSelectedGroupId(group?.id)} // Set selected group ID
                    >
                        <figure className="w-12 h-12 bg-olive/40 rounded-full overflow-hidden">
                            <img
                                src={group?.image || mainLogo}
                                alt="G"
                                className="w-full h-full object-cover"
                            />
                        </figure>
                        <section>
                            <p className="text-xl mt-1 font-medium">{group?.group_name}</p>
                            <p className="text-sm mt-1 font-medium">{group?.company_name}</p>
                        </section>
                    </motion.div>
                )) : (
                    <div>No groups found. </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Pending Invitations</h2>
                {loadingInvitations ? (
                    <p>Loading invitations...</p>
                ) : invitations?.length ? (
                    <ul>
                        {invitations?.map((inv) => (
                            <li key={inv?.id} className="p-2 border-b flex justify-between">
                                <span>{inv?.group_name}</span>
                                <div>
                                    <button
                                        onClick={() => acceptMutation.mutate(inv.id)}
                                        className="bg-green-500 text-white px-3 py-1 mr-2"
                                        disabled={acceptMutation.isLoading}
                                    >
                                        {acceptMutation.isLoading ? "Accepting..." : "Accept"}
                                    </button>
                                    <button
                                        onClick={() => declineMutation.mutate(inv.id)}
                                        className="bg-red-500 text-white px-3 py-1"
                                        disabled={declineMutation.isLoading}
                                    >
                                        {declineMutation.isLoading ? "Declining..." : "Decline"}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No pending invitations.</p>
                )}
            </section>
        </div>
    );
};

export default Groups;
