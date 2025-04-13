import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import ToggleSwitch from "../ToggleSwitch";

function MessageSettings() {
  const { chatVisibility, setChatVisibility } = useContext(ChatContext);
  const [settings, setSettings] = useState({
    dragToRead: true,
    doubleClickToRead: true,
    pressAndHoldToRead: false,
    visibility: chatVisibility,
  });

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
    if (setting === "visibility") {
      setChatVisibility(!chatVisibility);
    }
  };

  return (
    <div className="w-full p-3 md:p-6 ">
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
            <ToggleSwitch
              isChecked={settings[key as keyof typeof settings]}
              onToggle={() => toggleSetting(key as keyof typeof settings)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageSettings;
