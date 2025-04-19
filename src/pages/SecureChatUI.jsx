import Sidebar from "../components/Chat/desktop/Sidebar";
import ChatList from "../components/Chat/desktop/ChatList";
import ChatHeader from "../components/Chat/desktop/ChatHeader";
import MessageArea from "../components/Chat/desktop/MessageArea";
import RightPanel from "../components/Chat/desktop/RightPanel";
import Modal from '../components/modal/Modal'
import CallComponent from '../components/video-sdk/CallComponent'
import Settings from '../pages/Settings'
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export default function SecureChatUI() {
    const {
        showCall, setShowCall,
        showSettings, setShowSettings,
        meetingId, setMeetingId } = useContext(ChatContext);
    return (
        <div className="flex h-screen text-white bg-gradient-to-b from-oliveLight to-black"
            style={{
                background: `linear-gradient(to bottom, #36460A 10%, #000000 40%)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
            <Sidebar />
            <ChatList />
            <div className="flex-1 flex flex-col">
                <ChatHeader />
                <MessageArea />
            </div>
            <RightPanel />

            {showCall && (
                <Modal isOpen={showCall} closeModal={() => setShowCall(false)}>
                    <CallComponent initialMeetingId={meetingId} setInitialMeetingId={setMeetingId} />
                </Modal>
            )}
            {showSettings &&
                <Modal isOpen={showSettings} closeModal={() => setShowSettings(false)}>
                    <Settings />
                </Modal>
            }
        </div>
    );
}
