import { useContext, useMemo, useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  utilOptions,
  dashboardOptions,
  dashboardTabs,
} from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import { DashboardContext } from "../context/DashboardContext";
import { ChatContext } from "../context/ChatContext";
import { MeetingContext } from "../context/MeetingContext";
import useChat from "../hooks/useChat";
import DashboardLayout from "./DashboardLayout";

// Sidebar Components
import SideBar from "../components/dashboard/SideBar";
import AiSideBar from "../components/dashboard/AiSideBar";
import SideBarTwo from "../components/dashboard/SideBarTwo";
import SideBarItem from "../components/dashboard/SideBarItem";
import SideBarItemTwo from "../components/dashboard/SideBarItemTwo";
import NavBar from "../components/dashboard/NavBar";
import Modal from "../components/modal/Modal";
import CallComponent from "../components/video-sdk/CallComponent";
import Settings from "../pages/Settings";
import usePusherChannel from "../hooks/usePusherChannel";
import { FaPhone } from "react-icons/fa6";
import IncomingCallWidget from "../utils/IncomingCallWidget";
import audioController from "../utils/audioController";
import AddContactInterface from "../components/dashboard/AddContactInterface";
import useCommChannel from "../hooks/useCommChannel";
import { CommContext } from "../context/CommContext";
import useGroupChannel from "../hooks/useGroupChannel";
import { GroupContext } from "../context/GroupContext";

const DashboardWrapper = ({ children }) => {
  const queryClient = useQueryClient();
  const { authDetails } = useContext(AuthContext);

  const userId = authDetails?.user?.id;

  const {
    conference,
    showConference,
    setShowConference,
    setProviderMeetingId,
  } = useContext(MeetingContext);

  const {
    setSelectedChatUser,
    setTypingUsers,
    showCall,
    setShowCall,
    showSettings,
    setShowSettings,
    showContactModal,
    setShowContactModal,
    setCallMessage,
    setMeetingId,
    meetingId,
    setCallDuration,
  } = useContext(ChatContext);
  const { activeGroup } = useContext(GroupContext);

  const { state, dispatch } = useContext(DashboardContext);
  const { activeChannel } = useContext(CommContext);
  const { fetchContacts } = useChat();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: state?.type === "CHAT",
    staleTime: 0,
  });

  // Group Channel
  useGroupChannel({
    groupId: activeGroup?.group_meta?.id,
    token: authDetails?.access_token,
  });

  // COMMUNICATION CHANNEL SETUP
  useCommChannel({
    channelId: activeChannel?.channel_id_un,
    token: authDetails?.access_token,
  });

  // PUSHER LISTENER
  usePusherChannel({
    userId: authDetails?.user?.id,
    token: authDetails?.access_token,
    onNewMessage: (newMessage) => {
      const senderId = newMessage?.data?.user_id;

      if (newMessage?.state === "is_typing") {
        setTypingUsers((prev) => {
          if (prev[newMessage?.sender_id]) return prev;
          return { ...prev, [newMessage?.sender_id]: true };
        });
        return;
      } else if (newMessage?.state === "not_typing") {
        setTypingUsers((prev) => {
          if (!prev[newMessage?.sender_id]) return prev;
          return { ...prev, [newMessage?.sender_id]: false };
        });
        return;
      }

      if (!senderId) return;

      const existingData = queryClient.getQueryData(["chatMessages", senderId]);

      if (newMessage?.state === "callUpdate") {
        if (newMessage?.mss?.id === callMessage?.msg_id) {
          setCallMessage((prev) => ({
            ...prev,
            ...newMessage?.mss,
            call_state: newMessage?.call?.call_state,
          }));

          setCallDuration(newMessage?.call?.call_duration || 0);
        }

        queryClient.setQueryData(
          ["chatMessages", newMessage?.sender?.id],
          (old) => {
            if (!old || !Array.isArray(old.data)) return old;
            return {
              ...old,
              data: old.data.map((msg) =>
                msg.id === newMessage?.mss?.id
                  ? {
                      ...msg,
                      call_state: newMessage?.call?.call_state,
                      call_duration: newMessage?.call?.call_duration,
                    }
                  : msg
              ),
            };
          }
        );

        // Handle missed call for receiver
        if (
          newMessage?.call?.call_state === "miss" &&
          newMessage?.call?.receiver_id === userId
        ) {
          setShowCall(false);
          setCallMessage(null);
          setProviderMeetingId(null);
          audioController.stopRingtone();
        }

        return;
      }

      if (!existingData) {
        queryClient.invalidateQueries(["chatMessages", senderId]);
        return;
      }

      queryClient.setQueryData(["chatMessages", senderId], (old) => {
        if (!old || !Array.isArray(old.data)) return old;
        const exists = old.data.some((msg) => msg.id === newMessage.data.id);
        const isMyChat = newMessage.data.user_id === authDetails?.user?.id;
        return exists
          ? old
          : {
              ...old,
              data: [
                ...old.data,
                {
                  ...newMessage.data,
                  message: newMessage?.message,
                  is_my_chat: isMyChat ? "yes" : "no",
                },
              ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
            };
      });
    },
  });

  const toggleIsOpen = () => setIsOpen((prev) => !prev);
  const isChatPage = pathname.includes("/dashboard/chat");

  const { SidebarComponent, SidebarItemComponent, optionList } = useMemo(() => {
    let Sidebar = SideBar;
    let SidebarItem = SideBarItem;
    let option = dashboardOptions;

    if (
      pathname === "/dashboard/isurvive/chat" ||
      pathname === "/dashboard/isurvive/voice"
    ) {
      Sidebar = AiSideBar;
      SidebarItem = null;
      option = [];
    } else if (isChatPage) {
      Sidebar = SideBarTwo;
      SidebarItem = SideBarItemTwo;
      option = contacts || [];
    }

    return {
      SidebarComponent: Sidebar,
      SidebarItemComponent: SidebarItem,
      optionList: option,
    };
  }, [pathname, state?.type, contacts]);

  useLayoutEffect(() => {
    const matchedOption = [
      ...dashboardOptions,
      ...utilOptions,
      ...dashboardTabs,
    ].find((opt) => pathname === opt.route);
    if (matchedOption) dispatch(matchedOption);
    if (!matchedOption || matchedOption?.type !== "CHAT")
      setSelectedChatUser(null);

    if (
      pathname !== "/dashboard/conference/room" &&
      showConference &&
      !conference
    ) {
      setShowConference(false);
    }
  }, [pathname]);
  if (authDetails?.user?.role !== "user") return null;

  return (
    <main
      className="h-screen w-screen relative flex overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, #36460A 10%, #000000 40%)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Sidebar */}
      <SidebarComponent
        authDetails={authDetails}
        toogleIsOpen={toggleIsOpen}
        isMenuOpen={isOpen}
        contacts={optionList}
        state={state}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
          </div>
        ) : (
          <ul className="flex flex-col gap-[10px]">
            {SidebarItemComponent &&
              optionList?.map((currentOption, idx) => (
                <SidebarItemComponent
                  key={idx}
                  data={currentOption}
                  dispatch={dispatch}
                  state={state}
                  setIsOpen={setIsOpen}
                />
              ))}
          </ul>
        )}

        <ul className="flex flex-col gap-[10px]">
          {SidebarItemComponent &&
            utilOptions?.map((currentOption) => (
              <SidebarItemComponent
                key={currentOption.type}
                data={currentOption}
                dispatch={dispatch}
                state={state}
                setIsOpen={setIsOpen}
              />
            ))}
        </ul>
      </SidebarComponent>

      {/* Main content */}
      <div className="flex-1 w-2/3 relative flex bg-transparent flex-col h-full">
        <NavBar
          title={state?.title}
          toogleIsOpen={toggleIsOpen}
          isMenuOpen={isOpen}
          user={authDetails?.user}
        />
        <div
          className={`${
            isChatPage ? "lg:!px-0 h-full" : "lg:px-4"
          } w-full h-[92%] overflow-y-auto px-2 lg:px-4 bg-transparent`}
        >
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
          {children}
        </div>
      </div>

      {showCall && (
        <Modal
          isOpen={showCall}
          closeModal={() => {
            setShowCall(false);
            setCallMessage(null);
            setProviderMeetingId(null);
            setMeetingId(null);
            setCallDuration(0);
            audioController.stopRingtone();
          }}
          canMinimize={true}
          minimizedContent={
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-sm font-semibold flex items-center gap-2">
                <FaPhone /> Secure Call
              </span>
            </div>
          }
        >
          <CallComponent
            initialMeetingId={meetingId}
            setInitialMeetingId={setMeetingId}
          />
        </Modal>
      )}
      {showSettings && (
        <Modal
          isOpen={showSettings}
          closeModal={() => setShowSettings(false)}
          minimizedContent="Settings"
        >
          <Settings />
        </Modal>
      )}
      {showContactModal && (
        <Modal
          isOpen={showContactModal}
          closeModal={() => setShowContactModal(false)}
        >
          <AddContactInterface />
        </Modal>
      )}
      <IncomingCallWidget />
    </main>
  );
};

export default DashboardWrapper;
