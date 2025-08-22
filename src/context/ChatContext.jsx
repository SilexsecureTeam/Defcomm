import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // Retrieve and parse stored boolean value
  const initialVisibility =
    JSON.parse(sessionStorage.getItem("chatVisibility")) ?? false;
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [callType, setCallType] = useState("audio"); // Default call type
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatVisibility, setChatVisibility] = useState(initialVisibility);
  const [showCall, setShowCall] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callMessage, setCallMessage] = useState("");
  const [messages, setMessages] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [typingUsers, setTypingUsers] = useState({}); // key = userId, value = true/false
  const [showContactModal, setShowContactModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const [modalTitle, setModalTitle] = useState("Defcomm");
  const [members, setMembers] = useState();

  // messageRefs container (will be set by GroupMessageList)
  const messageRefsRef = useRef(null);

  const registerMessageRefs = useCallback((refs) => {
    messageRefsRef.current = refs;
  }, []);

  // scroll helper: accepts the same stable key you use for refs: client_id ?? id_en ?? id_en
  const scrollToMessage = useCallback((key) => {
    try {
      const map = messageRefsRef.current?.current ?? null;
      if (!map) return false;
      const el = map.get(String(key));
      if (!el) return false;
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // optional highlight
      const prevTransition = el.style.transition;
      const prevBox = el.style.boxShadow;
      const prevBg = el.style.backgroundColor;

      el.style.transition =
        "box-shadow 320ms ease, background-color 320ms ease";
      el.style.boxShadow = "0 0 0 3px rgba(250,184,28,0.18)";
      el.style.backgroundColor = "rgba(250,184,28,0.06)";

      setTimeout(() => {
        el.style.boxShadow = prevBox || "";
        el.style.backgroundColor = prevBg || "";
        el.style.transition = prevTransition || "";
      }, 1200);

      return true;
    } catch (err) {
      return false;
    }
  }, []);

  // Store the boolean value correctly when it changes
  useEffect(() => {
    sessionStorage.setItem("chatVisibility", JSON.stringify(chatVisibility));
  }, [chatVisibility]);

  const initialShowToggleSwitch =
    JSON.parse(sessionStorage.getItem("showToggleSwitch")) ?? true;

  const [showToggleSwitch, setShowToggleSwitch] = useState(
    initialShowToggleSwitch
  );

  return (
    <ChatContext.Provider
      value={{
        selectedChatUser,
        setSelectedChatUser,
        setChatVisibility,
        chatVisibility,
        showCall,
        setShowCall,
        showSettings,
        setShowSettings,
        showContactModal,
        setShowContactModal,
        callMessage,
        setCallMessage,
        messages,
        setMessages,
        file,
        setFile,
        message,
        setMessage,
        callType,
        setCallType,
        typingUsers,
        setTypingUsers,
        modalTitle,
        setModalTitle,
        meetingId,
        setMeetingId,
        callDuration,
        setCallDuration,
        showToggleSwitch,
        setShowToggleSwitch,
        replyTo,
        setReplyTo,
        members,
        setMembers,
        messageRefsRef,
        registerMessageRefs,
        scrollToMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
