import { lazy, Suspense, useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Fallback from "../components/Fallback";
import { ThemeProvider } from "../context/ThemeContext";
import { CommProvider } from "../context/CommContext";
import { GroupProvider } from "../context/GroupContext";

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
const GroupChatPage = lazy(() => import("../pages/GroupChatPage"));

const DashboardRoutes = () => {
  const { authDetails } = useContext(AuthContext);

  if (authDetails?.user?.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return (
    <ThemeProvider>
      <CommProvider>
        <GroupProvider>
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route path="/" element={<DashboardWrapper />}>
                <Route path="home" element={<Home />} />

                <Route
                  path="chat"
                  element={
                    <div className="w-full h-full">
                      <div className="block lg:hidden">
                        <ChatInterface />
                      </div>
                      <div className="hidden lg:block">
                        <SecureChatUI />
                      </div>
                    </div>
                  }
                />

                <Route path="new-file" element={<DeffViewer />} />
                <Route path="view/:fileId" element={<PDFViewer />} />
                <Route path="file-view/:fileUrl" element={<DeffViewer />} />
                <Route path="contacts" element={<ContactPage />} />
                <Route path="file-manager" element={<FileManager />} />
                <Route path="profile" element={<Profile />} />
                <Route path="file-sharing" element={<FileDashboard />} />
                <Route path="groups" element={<Groups />} />
                <Route path="group_list" element={<GroupChatPage />} />
                <Route
                  path="group/:groupId/chat"
                  element={<GroupChatInterface />}
                />
                <Route path="comm" element={<WalkieTalkie />} />
                <Route path="drive" element={<MyDrive />} />
                <Route path="drive/:id" element={<DriveContent />} />
                <Route path="isurvive" element={<DefcommAi />} />
                <Route path="isurvive/chat" element={<ChatBox />} />
                <Route path="isurvive/voice" element={<ChatBoxTwo />} />
                <Route path="settings" element={<Settings />} />
                <Route path="conference" element={<InitConference />} />
                <Route
                  path="conference/room"
                  element={<ShowConferenceRoute />}
                />
                <Route
                  path="/conference/waiting/:meetingId"
                  element={<WaitingPage />}
                />
                <Route
                  path="/conference/my-meetings"
                  element={<MyMeetings />}
                />
                <Route
                  path="/conference/create"
                  element={<CreateMeetingForm />}
                />
                <Route path="*" element={<ComingSoon />} />
              </Route>
            </Routes>
          </Suspense>
        </GroupProvider>
      </CommProvider>
    </ThemeProvider>
  );
};

export default DashboardRoutes;
