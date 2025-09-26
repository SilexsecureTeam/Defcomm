import React, { createContext, useContext, useReducer } from "react";
import DashboardReducer from "../reducers/DashboardReducer";
import {
  dashboardOptions,
  utilOptions,
  dashboardTabs,
} from "../utils/constants";
import { useState } from "react";

// Create the context
export const DashboardContext = createContext();

// Provider component
export const DashboardContextProvider = ({ children }) => {
  const options = [...dashboardOptions, ...utilOptions, ...dashboardTabs];
  const [state, dispatch] = useReducer(DashboardReducer, options[0]);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <DashboardContext.Provider
      value={{ state, dispatch, isMinimized, setIsMinimized }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
