import { createContext, useState } from "react";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupUserTyping, setGroupUserTyping] = useState();

  return (
    <GroupContext.Provider
      value={{
        activeGroup,
        setActiveGroup,
        groupUserTyping,
        setGroupUserTyping,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
