import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/group/GroupCard";
import useGroups from "../hooks/useGroup";
import { FaCog } from "react-icons/fa";
import { ChatContext } from "../context/ChatContext";

export default function GroupChatPage() {
  const { useFetchGroups } = useGroups();
  const { setShowSettings } = useContext(ChatContext);
  const { data: groups, isLoading, isError, error } = useFetchGroups();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Filter groups by search term
  const filteredGroups = groups?.filter((group) =>
    group.group_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Groups</h1>

        {/* Search bar skeleton */}
        <div className="h-10 rounded-lg bg-gray-800 animate-pulse mb-4"></div>
        {/* Group list skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-800 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-1/3 bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-2/3 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-center text-white">
        <p className="text-red-400 mb-3">
          Failed to load groups: {error?.message || "Unknown error"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold mb-4">Groups</h1>
        <button
          onClick={() => {
            setShowSettings(true);
          }}
        >
          <FaCog size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search groups..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Groups List */}
      <div className="space-y-3 mt-4">
        {filteredGroups?.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))
        ) : (
          <p className="text-gray-500 italic">No groups found.</p>
        )}
      </div>
    </div>
  );
}
