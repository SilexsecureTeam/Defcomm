import { createContext, useLayoutEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Read from sessionStorage on mount
  const [authDetails, setAuthDetails] = useState(() => {
    const storedUser = sessionStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Query for refetching auth details (optional)
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => Promise.resolve(authDetails),
    initialData: authDetails,
  });

  // Sync React Query updates to state
  useLayoutEffect(() => {
    if (data) setAuthDetails(data);
  }, [data]);

  return (
    <AuthContext.Provider value={{ authDetails, setAuthDetails, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
