import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa"; // default group icon

export default function GroupCard({ group }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard/group/${group?.group_id}/chat`)}
      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 transition"
    >
      {/* Avatar */}
      {group?.avatar ? (
        <img
          src={group.avatar}
          alt={group.group_name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
          <FaUsers size={20} />
        </div>
      )}

      {/* Group Details */}
      <div className="flex-1 border-b border-gray-700 pb-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-white">{group.group_name}</h2>
          <span className="text-xs text-gray-400">
            {group.lastMessageTime || ""}
          </span>
        </div>
        <p className="text-gray-400 text-sm truncate">
          {group.lastMessage || "No messages yet"}
        </p>
      </div>
    </div>
  );
}
