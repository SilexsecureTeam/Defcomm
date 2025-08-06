import { createContext, useState } from "react";

export const CommContext = createContext();

export const CommProvider = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState(null);
  const [isCommActive, setIsCommActive] = useState(false);
  const [connectingChannelId, setConnectingChannelId] = useState(null);
  const [isOpenComm, setIsOpenComm] = useState(false);

  // Store walkie-talkie messages
  const [walkieMessages, setWalkieMessages] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  // 🆕 Renamed liveSpeaker -> currentSpeaker
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const leaveChannel = () => {
    // cleanup state
    setIsCommActive(false);
    setActiveChannel(null);
    setCurrentSpeaker(null);
    // optional: tell backend you disconnected
  };

  return (
    <CommContext.Provider
      value={{
        activeChannel,
        setActiveChannel,
        isCommActive,
        setIsCommActive,
        connectingChannelId,
        setConnectingChannelId,
        isOpenComm,
        setIsOpenComm,
        walkieMessages,
        setWalkieMessages,
        recentMessages,
        setRecentMessages,
        currentSpeaker,
        setCurrentSpeaker,
        leaveChannel,
      }}
    >
      {children}
    </CommContext.Provider>
  );
};
