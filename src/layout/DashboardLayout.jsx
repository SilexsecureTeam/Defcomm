import { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashTabs from "../components/dashboard/DashTabs";
import { MeetingContext } from "../context/MeetingContext";
import SecureConference from "../pages/SecureConference";
import { CommContext } from "../context/CommContext";
import Modal from "../components/modal/Modal";
import { FiMic } from "react-icons/fi";
import CommInterface from "../components/walkietalkie/CommInterface";

const DashboardLayout = () => {
  const { showConference } = useContext(MeetingContext);
  const {
    isOpenComm,
    setIsOpenComm,
    isCommActive,
    activeChannel,
    currentSpeaker, // 🆕 comes from context
  } = useContext(CommContext);

  const { pathname } = useLocation();

  const isChatPage =
    pathname.startsWith("/dashboard/user/") || pathname.endsWith("/chat");

  const isWalkieTalkiePage = pathname.includes("/comm");

  // Auto open minimized modal if comm active but user not on walkie page
  useEffect(() => {
    if (!isWalkieTalkiePage && isCommActive && activeChannel) {
      setIsOpenComm(true);
    }
  }, [isWalkieTalkiePage, isCommActive, activeChannel]);

  return (
    <div className="bg-transparent">
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div
          className={`${isChatPage ? "lg:hidden" : "lg:flex"} mt-10 p-0 md:p-6`}
        >
          <DashTabs />
        </div>

        {/* Content Area */}
        <main
          className={`${
            isChatPage ? "lg:p-0" : "lg:p-6"
          } flex-1 p-0 py-3 md:p-6`}
        >
          <Outlet />

          {showConference && <SecureConference />}

          {(isOpenComm || (activeChannel && isCommActive)) && (
            <Modal
              isOpen={isOpenComm}
              closeModal={() => setIsOpenComm(false)}
              canMinimize={true}
              minimizedContent={
                <div className="flex items-center gap-3">
                  {/* Mic icon */}
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-green-600">
                    <FiMic size={16} className="text-white" />
                    {currentSpeaker && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </div>

                  {/* Text info */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {currentSpeaker
                        ? `Speaking: ${currentSpeaker.name}`
                        : "Walkie Talkie"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {activeChannel?.name || "No channel name"}
                    </span>
                  </div>
                </div>
              }
              title="Walkie Talkie Communication"
            >
              <CommInterface modal={true} />
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
