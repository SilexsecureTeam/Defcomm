import React from "react";

function SvgTwo({ width = "250px" }) {
  return (
    <div style={{ width }}>
      <svg width="100%" height="auto" viewBox="0 0 309 69" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M64.203 50L63.7476 50.5959L63.9492 50.75H64.203V50ZM8 4C8 1.79086 6.20914 0 4 0C1.79086 0 0 1.79086 0 4C0 6.20914 1.79086 8 4 8C6.20914 8 8 6.20914 8 4ZM308.26 49.25H64.203V50.75H308.26V49.25ZM64.6583 49.4041L4.45535 3.40405L3.54465 4.59595L63.7476 50.5959L64.6583 49.4041Z"
          fill="#DDDDDD"
        />
      </svg>
    </div>
  );
}

export default SvgTwo;
