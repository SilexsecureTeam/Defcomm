import { QueryClient } from "@tanstack/react-query";

// Create a Query Client with global options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10, // Cache time before garbage collection
      retry: 2, // Retry failed queries 2 times
      refetchOnWindowFocus: false, // Prevent refetch on window focus
    },
  },
});
