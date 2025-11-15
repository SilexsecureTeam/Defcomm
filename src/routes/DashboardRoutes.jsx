import { lazy, Suspense, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Fallback from "../components/Fallback";
import { ThemeProvider } from "../context/ThemeContext";
import { CommProvider } from "../context/CommContext";
import { GroupProvider } from "../context/GroupContext";
import useMedia from "../utils/chat/useMedia";
import withSubscription from "../hocs/withSubscription";
import DashboardLayout from "../layout/DashboardLayout";
import { MeetingProvider } from "../context/MeetingContext";

// Lazy-loaded pages
const DashboardWrapper = lazy(() => import("../layout/DashboardWrapper"));
const Home = lazy(() => import("../pages/Dashboard"));
const ChatInterface = lazy(() => import("../pages/ChatInterface"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));
const FileManager = lazy(() => import("../pages/FileManager"));
const DefcommAi = lazy(() => import("../pages/DefcommAi"));
const ChatBox = lazy(() => import("../pages/ChatBox"));
const ChatBoxTwo = lazy(() => import("../pages/ChatBoxTwo"));
const MyDrive = lazy(() => import("../pages/MyDrive"));
const DriveContent = lazy(() => import("../pages/DriveContent"));
const Settings = lazy(() => import("../pages/Settings"));
const ContactPage = lazy(() => import("../pages/ContactList"));
const WalkieTalkie = lazy(() => import("../pages/WalkieTalkie"));
const DeffViewer = lazy(() => import("../pages/DeffViewer"));
const PDFViewer = lazy(() =>
  import("../components/fileManager/pdfViewer/PdfViewer")
);
const FileDashboard = lazy(() => import("../pages/FileDashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Groups = lazy(() => import("../pages/Groups"));
const SecureChatUI = lazy(() => import("../pages/SecureChatUI"));
const InitConference = lazy(() =>
  import("../components/video-sdk/conference/InitConference")
);
const ShowConferenceRoute = lazy(() => import("../pages/ShowConferenceRoute"));
const WaitingPage = lazy(() => import("../pages/WaitingPage"));
const MyMeetings = lazy(() => import("../pages/MyMeetings"));
const CreateMeetingForm = lazy(() =>
  import("../components/video-sdk/conference/CreateMeetingForm")
);
const GroupChatInterface = lazy(() => import("../pages/GroupChatInterface"));
const SecureGroupChat = lazy(() => import("../pages/SecureGroupChat"));
const GroupChatPage = lazy(() => import("../pages/GroupChatPage"));

const DashboardRoutes = () => {
  const { authDetails } = useContext(AuthContext);

  if (authDetails?.user?.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  const isLarge = useMedia("(min-width: 1024px)");

  // Wrap protected pages with subscription guard
  const ProtectedChat = withSubscription(
    isLarge ? SecureChatUI : ChatInterface,
    "enable_chat"
  );
  const ProtectedGroupChat = withSubscription(
    isLarge ? SecureGroupChat : GroupChatInterface,
    "enable_chat"
  );
  const ProtectedGroupPage = withSubscription(GroupChatPage, "enable_chat");
  const ProtectedWalkie = withSubscription(WalkieTalkie, "enable_walkie");
  const ProtectedDrive = withSubscription(MyDrive, "enable_drive");
  const ProtectedDriveContent = withSubscription(DriveContent, "enable_drive");
  const ProtectedGroups = withSubscription(Groups, "enable_chat");
  const ProtectedContacts = withSubscription(ContactPage, "enable_call");

  // Conference/Meeting guarded
  const ProtectedInitConference = withSubscription(
    InitConference,
    "enable_meeting"
  );
  const ProtectedShowConference = withSubscription(
    ShowConferenceRoute,
    "enable_meeting"
  );
  const ProtectedWaitingPage = withSubscription(WaitingPage, "enable_meeting");
  const ProtectedMyMeetings = withSubscription(MyMeetings, "enable_meeting");
  const ProtectedCreateMeeting = withSubscription(
    CreateMeetingForm,
    "enable_meeting"
  );

  return (
    <ThemeProvider>
      <MeetingProvider>
        <CommProvider>
          <GroupProvider>
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path="/" element={<DashboardWrapper />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="home" element={<Home />} />

                    {/* Groups */}
                    <Route path="groups" element={<ProtectedGroups />} />
                    <Route path="group_list" element={<ProtectedGroupPage />} />
                    <Route
                      path="group/:groupId/chat"
                      element={<ProtectedGroupChat />}
                    />

                    {/* Walkie Talkie */}
                    <Route path="comm" element={<ProtectedWalkie />} />

                    {/* File & Drive */}
                    <Route path="file-manager" element={<FileManager />} />
                    <Route path="file-sharing" element={<FileDashboard />} />
                    <Route path="drive" element={<ProtectedDrive />} />
                    <Route
                      path="drive/:id"
                      element={<ProtectedDriveContent />}
                    />

                    {/* Always accessible */}
                    <Route path="new-file" element={<DeffViewer />} />
                    <Route path="view/:fileId" element={<PDFViewer />} />
                    <Route path="file-view/:fileUrl" element={<DeffViewer />} />
                    <Route path="contacts" element={<ProtectedContacts />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="isurvive" element={<DefcommAi />} />
                    <Route path="isurvive/chat" element={<ChatBox />} />
                    <Route path="isurvive/voice" element={<ChatBoxTwo />} />
                    <Route path="settings" element={<Settings />} />

                    {/* Chat */}
                    <Route
                      path="user/:userId/chat"
                      element={<ProtectedChat />}
                    />
                    <Route path="chat" element={<ProtectedChat />} />

                    {/* Conference/Meetings */}
                    <Route
                      path="conference"
                      element={<ProtectedInitConference />}
                    />
                    <Route
                      path="conference/room"
                      element={<ProtectedShowConference />}
                    />
                    <Route
                      path="conference/waiting/:meetingId"
                      element={<ProtectedWaitingPage />}
                    />
                    <Route
                      path="conference/my-meetings"
                      element={<ProtectedMyMeetings />}
                    />
                    <Route
                      path="conference/meetings"
                      element={<ProtectedMyMeetings all={true} />}
                    />
                    <Route
                      path="conference/create"
                      element={<ProtectedCreateMeeting />}
                    />

                    <Route path="*" element={<ComingSoon />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </GroupProvider>
        </CommProvider>
      </MeetingProvider>
    </ThemeProvider>
  );
};

export default DashboardRoutes;
