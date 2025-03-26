import React from "react";

interface ToggleSwitchProps {
  isChecked: boolean;
  onToggle: () => void;
  activeBg?: string;
  inactiveBg?: string;
  knobColor?: string;
}

function ToggleSwitch({
  isChecked,
  onToggle,
  activeBg = "bg-oliveGreen",
  inactiveBg = "bg-gray-300",
  knobColor = "bg-white",
}: ToggleSwitchProps) {
  return (
    <label className="flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only" checked={isChecked} onChange={onToggle} />
      <div
        className={`w-10 h-6 flex items-center rounded-full transition-all ${
          isChecked ? activeBg : inactiveBg
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full shadow-md transform transition-all ${
            isChecked ? "translate-x-5" : "translate-x-0"
          } ${knobColor}`}
        ></div>
      </div>
    </label>
  );
}

export default ToggleSwitch;
