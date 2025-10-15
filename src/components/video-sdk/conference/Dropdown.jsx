import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaEdit, FaUserPlus, FaTrash, FaTimes } from "react-icons/fa";

const Dropdown = ({
  parentRef,
  meeting,
  onEditMeeting,
  handleAddUsers,
  close,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const DROPDOWN_WIDTH = 140;

  useLayoutEffect(() => {
    if (!parentRef) return;
    const rect = parentRef.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Calculate position with boundary detection
    let left = rect.right + window.scrollX - DROPDOWN_WIDTH;
    let top = rect.bottom + window.scrollY + 4;

    // Ensure dropdown stays within viewport
    if (left + DROPDOWN_WIDTH > viewport.width) {
      left = viewport.width - DROPDOWN_WIDTH - 8;
    }
    if (left < 0) {
      left = 8;
    }
    if (top + 120 > viewport.height) {
      top = rect.top + window.scrollY - 120;
    }

    setPosition({ top, left });
  }, [parentRef]);

  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
    close();
  };

  const menuItems = [
    {
      label: "Edit Meeting",
      icon: FaEdit,
      action: () => onEditMeeting(meeting),
      color: "text-blue-400",
    },
    {
      label: "Add Users",
      icon: FaUserPlus,
      action: (e) => handleAddUsers(e, meeting),
      color: "text-green-400",
    },
    {
      label: "Delete",
      icon: FaTrash,
      action: close,
      color: "text-red-400",
      separator: true,
    },
  ];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />

      {/* Dropdown Menu */}
      <div
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          width: DROPDOWN_WIDTH,
          zIndex: 50,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <span className="text-xs font-medium text-gray-300 truncate">
            {meeting?.title || "Meeting"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <FaTimes className="text-gray-400 text-xs" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-1">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              {item.separator && (
                <div className="border-t border-gray-700 my-1" />
              )}
              <button
                onClick={(e) => handleAction(e, item.action)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-800 hover:scale-[1.02] ${item.color}`}
              >
                <item.icon className="text-xs flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Dropdown;
