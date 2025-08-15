import { useEffect } from "react";

export default function SecureAccessGuard() {
  useEffect(() => {
    // 1️⃣ Disable right-click
    const disableContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);

    // 2️⃣ Disable text selection & drag
    const disableSelect = (e) => e.preventDefault();
    document.addEventListener("selectstart", disableSelect);
    document.addEventListener("dragstart", disableSelect);

    // 3️⃣ Block Print Screen & DevTools shortcuts
    const handleKeyEvents = (e) => {
      // Prevent screenshots
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("Screenshots are disabled on this site");
        alert("Screenshots are disabled.");
      }
      // Block common DevTools shortcuts
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key))
      ) {
        e.preventDefault();
        alert("Developer tools are disabled.");
      }
    };
    document.addEventListener("keyup", handleKeyEvents);
    document.addEventListener("keydown", handleKeyEvents);

    // 4️⃣ Add transparent overlay to confuse some screenshot tools
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(255,255,255,0.01)",
      pointerEvents: "none",
      zIndex: "999999",
    });
    document.body.appendChild(overlay);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("selectstart", disableSelect);
      document.removeEventListener("dragstart", disableSelect);
      document.removeEventListener("keyup", handleKeyEvents);
      document.removeEventListener("keydown", handleKeyEvents);
      document.body.removeChild(overlay);
    };
  }, []);

  return null; // No UI — this is a guard
}
