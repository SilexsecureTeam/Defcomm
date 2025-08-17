import { useEffect, useState } from "react";
import { queryClient } from "../../services/query-client";

// Global "safe mode" flag
let isSafe = true;

export default function SecureAccessGuard({ children }) {
  const [safe, setSafe] = useState(true);
  const [ready, setReady] = useState(false); // Wait for initial security check
  const [reason, setReason] = useState("");

  // Trigger security block
  const triggerBlock = (cause = "Unauthorized action detected") => {
    if (!isSafe) return;
    isSafe = false;
    setSafe(false);
    setReason(cause);
    queryClient.clear();
    console.clear();
    console.log(
      "%c⚠️ SECURITY BREACH DETECTED",
      "color: red; font-size: 20px;"
    );
  };

  // Synchronous DevTools check
  const immediateDevToolsCheck = () => {
    const start = performance.now();
    debugger;
    const timeTaken = performance.now() - start;
    if (timeTaken > 100) triggerBlock("Debugger / Console Inspection Detected");
  };

  useEffect(() => {
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    const rootElement = document.documentElement.cloneNode(true);

    immediateDevToolsCheck();

    // Harden Fetch
    window.fetch = async (...args) => {
      if (!isSafe)
        return Promise.reject(new Error("Blocked by Security Guard"));
      return originalFetch(...args);
    };

    // Harden XHR
    function BlockedXHR() {
      const xhr = new originalXHR();
      if (!isSafe) setTimeout(() => xhr.onerror?.(new Error("Blocked")), 0);
      return xhr;
    }
    window.XMLHttpRequest = BlockedXHR;

    // Key detection
    const handleKeyEvents = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key))
      ) {
        e.preventDefault();
        triggerBlock("Developer Tools Shortcut Pressed");
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        triggerBlock("Print Attempt Detected (Ctrl+P)");
      }
      if (e.key.toLowerCase().includes("printscreen")) {
        e.preventDefault();
        triggerBlock("Screenshot Attempt Detected (PrintScreen Key)");
      }
    };
    document.addEventListener("keydown", handleKeyEvents);

    // Before print detection
    const handleBeforePrint = (e) => {
      e.preventDefault();
      triggerBlock("Print Dialog Triggered");
    };
    window.addEventListener("beforeprint", handleBeforePrint);

    // Resize detection
    const resizeInterval = setInterval(() => {
      const opened =
        window.outerHeight - window.innerHeight > 160 ||
        window.outerWidth - window.innerWidth > 160;
      if (opened) triggerBlock("Possible DevTools Opened (Window Resize)");
    }, 500);

    // Console detection
    const consoleInterval = setInterval(() => {
      const start = performance.now();
      debugger;
      const timeTaken = performance.now() - start;
      if (timeTaken > 100)
        triggerBlock("Debugger / Console Inspection Detected");
    }, 2000);

    // Disable Right Click / Selection / Drag
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);
    document.addEventListener("dragstart", prevent);

    // Block Copy/Paste
    const handleCopy = (e) => {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", "⚠️ Copy Disabled by DefComm");
      triggerBlock("Copy Attempt Detected");
    };
    const handlePaste = (e) => {
      e.preventDefault();
      triggerBlock("Paste Attempt Detected");
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    // Anti-iframe
    if (window.top !== window.self) triggerBlock("Framing Attempt Detected");

    // DOM integrity check
    const integrityCheck = setInterval(() => {
      try {
        if (
          document.documentElement.innerHTML.length <
          rootElement.innerHTML / 2
        )
          triggerBlock("DOM Integrity Breach Detected");
      } catch {
        triggerBlock("DOM Tampering Detected");
      }
    }, 3000);

    // Mark ready
    setTimeout(() => setReady(true), 50);

    return () => {
      document.removeEventListener("keydown", handleKeyEvents);
      window.removeEventListener("beforeprint", handleBeforePrint);
      clearInterval(resizeInterval);
      clearInterval(consoleInterval);
      clearInterval(integrityCheck);
      window.fetch = originalFetch;
      window.XMLHttpRequest = originalXHR;
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // Wait for security setup
  if (!ready) return null;

  if (!safe) {
    // Military-style instructions based on reason
    let instructions = "Close any suspicious tools and reload the page.";
    if (reason.includes("Developer Tools"))
      instructions = "Close Developer Tools immediately and reload.";
    else if (reason.includes("Debugger"))
      instructions = "Disable debugger/console inspection and reload.";
    else if (reason.includes("Print"))
      instructions = "Cancel printing and reload.";
    else if (reason.includes("Screenshot"))
      instructions = "Stop taking screenshots and reload.";
    else if (reason.includes("Copy"))
      instructions = "Do not attempt to copy content. Reload.";
    else if (reason.includes("Paste"))
      instructions = "Do not attempt to paste content. Reload.";
    else if (reason.includes("Framing"))
      instructions = "Open the page directly in a browser tab.";
    else if (reason.includes("DOM"))
      instructions = "DOM has been tampered. Reload immediately.";

    return (
      <div className="fixed inset-0 bg-black text-lime-400 flex flex-col items-center justify-center font-mono z-[999999]">
        <div className="border-4 border-lime-400 p-8 rounded-lg text-center max-w-lg animate-pulse bg-gray-900 shadow-lg">
          <h1 className="text-4xl font-bold mb-4">
            ⚠️ SECURITY BREACH DETECTED ⚠️
          </h1>
          <p className="text-xl mb-4">
            Cause: <span className="text-red-500">{reason}</span>
          </p>
          <p className="mb-4 font-bold text-lg">MISSION INSTRUCTIONS:</p>
          <p className="mb-6">{instructions}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-lime-500 text-black px-6 py-2 rounded font-bold hover:bg-lime-400 transition tracking-widest shadow-md"
          >
            RE-INITIALIZE SESSION
          </button>
        </div>
      </div>
    );
  }

  return <div className="relative">{children}</div>;
}
