import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { DashboardContextProvider } from "./context/DashboardContext";
import { queryClient } from "./services/query-client";
import { ChatProvider } from "./context/ChatContext";
import { MeetingProvider } from "./context/MeetingContext";
import { BotProvider } from "./context/BotContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppRouter from "./router";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <MeetingProvider>
              <BotProvider>
                <DashboardContextProvider>
                  <BrowserRouter>
                    <AppRouter />
                  </BrowserRouter>
                  <ToastContainer
                    autoClose={2000}
                    draggable
                    className="z-[100000000000] mt-2"
                  />
                </DashboardContextProvider>
              </BotProvider>
            </MeetingProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>

      {import.meta.env.VITE_MODE === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="right" />
      )}
    </QueryClientProvider>
  );
};

export default App;
