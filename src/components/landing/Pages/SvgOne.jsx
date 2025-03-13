import React from "react";

function SvgOne({ width = "250px" }) {
  return (
    <div style={{ width }}>
      <svg width="100%" height="auto" viewBox="0 0 309 69" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M218.897 68L219.347 68.6001L219.147 68.75H218.897V68ZM300.26 4C300.26 1.79086 302.051 0 304.26 0C306.469 0 308.26 1.79086 308.26 4C308.26 6.20914 306.469 8 304.26 8C302.051 8 300.26 6.20914 300.26 4ZM0.259766 67.25H218.897V68.75H0.259766V67.25ZM218.448 67.3999L303.81 3.39993L304.71 4.60007L219.347 68.6001L218.448 67.3999Z"
          fill="#DDDDDD"
        />
      </svg>
    </div>
  );
}

export default SvgOne;
