import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

const MessageSettings = () => {

  const { chatVisibility, setChatVisibility } = useContext(ChatContext);
  const [settings, setSettings] = useState({
    dragToRead: true,
    doubleClickToRead: true,
    pressAndHoldToRead: false,
    visibility: chatVisibility
  });

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
    if (setting === "visibility") {
      setChatVisibility(!chatVisibility);
    }
  };

  return (
    /* Message Settings */
    <div className="w-full">
      <h3 className="text-gray-700 font-bold mb-4">Message Setting</h3>

      {/* Setting Items */}
      <div className="space-y-4">
        {[
          { label: "Drag to read", key: "dragToRead" },
          { label: "Double Click to Read", key: "doubleClickToRead" },
          { label: "Press and Hold to Read", key: "pressAndHoldToRead" },
          { label: "Chat Visibility", key: "visibility" },
        ].map(({ label, key }) => (
          <div key={key} className="flex items-center gap-3 justify-between">
            <div>
              <h4 className="text-sm text-gray-800 font-medium">{label}</h4>
              <p className="text-gray-500 text-sm mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={settings[key as keyof typeof settings]}
                onChange={() => toggleSetting(key as keyof typeof settings)}
              />
              <div className={`w-10 h-6 flex items-center bg-gray-300 rounded-full transition-all ${settings[key as keyof typeof settings] ? "bg-oliveGreen" : "bg-gray-300"
                }`}>
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform ${settings[key as keyof typeof settings] ? "translate-x-5" : "translate-x-0"
                  } transition-all`}></div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSettings;
