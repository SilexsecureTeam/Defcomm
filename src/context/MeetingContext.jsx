import React, { createContext, useState } from "react";
// Create the context
export const MeetingContext = createContext();

// Provider component
export const MeetingProvider = ({ children }) => {
   const [conference, setConference] = useState(false);
   const [me, setMe] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [providerMeetingId, setProviderMeetingId] = useState(null);
  const [showConference, setShowConference] = useState(false);
  const [conferenceId, setConferenceId] = useState(null);
  return (
    <MeetingContext.Provider value={{ 
        conference, setConference, me, setMe, isScreenSharing,
        setIsScreenSharing, providerMeetingId, setProviderMeetingId,
        showConference, setShowConference,
    conferenceId, setConferenceId}}>
      {children}
    </MeetingContext.Provider>
  );
};
