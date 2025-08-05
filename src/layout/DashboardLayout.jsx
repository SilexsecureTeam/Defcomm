import { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashTabs from "../components/dashboard/DashTabs";
import { MeetingContext } from "../context/MeetingContext";
import SecureConference from "../pages/SecureConference";
import { CommContext } from "../context/CommContext";
import Modal from "../components/modal/Modal";
import { FiPlus } from "react-icons/fi";
import CommInterface from "../components/walkietalkie/CommInterface";

const DashboardLayout = () => {
  const { showConference } = useContext(MeetingContext);
  const { isOpenComm, setIsOpenComm, isCommActive, activeChannel } =
    useContext(CommContext);

  const { pathname } = useLocation();

  const isChatPage = pathname.includes("/dashboard/chat");
  const isWalkieTalkiePage = pathname.includes("/comm");

  // Auto open modal if user navigates to /comm
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
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-sm font-semibold flex items-center gap-2">
                    <FiPlus size={20} /> Walkie Talkie
                  </span>
                  <span className="text-xs text-gray-400">Click to expand</span>
                </div>
              }
              title="Walkie Talkie Communication"
            >
              <CommInterface />
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
