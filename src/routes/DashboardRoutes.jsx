import { lazy, Suspense, useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Fallback from "../components/Fallback";
import { ThemeProvider } from "../context/ThemeContext";

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
const PDFViewer = lazy(() => import("../components/fileManager/pdfViewer/PdfViewer"));
const FileDashboard = lazy(() => import("../pages/FileDashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Groups = lazy(() => import("../pages/Groups"));
const SecureChatUI = lazy(() => import("../pages/SecureChatUI"));
const ShowConferenceRoute = lazy(() => import("../pages/ShowConferenceRoute"));
const WaitingScreen = lazy(() => import("../components/video-sdk/conference/WaitingScreen"));
const DashboardRoutes = () => {
  const { authDetails } = useContext(AuthContext);

  if (authDetails?.user?.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return (
    <ThemeProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route
            path="chat"
            element={
              <>
                <div className="block lg:hidden">
                  <DashboardWrapper>
                    <ChatInterface />
                  </DashboardWrapper>
                </div>
                <div className="hidden lg:block">
                  <SecureChatUI />
                </div>
              </>
            }
          />
          <Route path="/" element={<DashboardWrapper />}>
            <Route path="home" element={<Home />} />
            <Route path="new-file" element={<DeffViewer />} />
            <Route path="view/:fileId" element={<PDFViewer />} />
            <Route path="file-view/:fileUrl" element={<DeffViewer />} />
            <Route path="contacts" element={<ContactPage />} />
            <Route path="file-manager" element={<FileManager />} />
            <Route path="profile" element={<Profile />} />
            <Route path="file-sharing" element={<FileDashboard />} />
            <Route path="groups" element={<Groups />} />
            <Route path="comm" element={<WalkieTalkie />} />
            <Route path="drive" element={<MyDrive />} />
            <Route path="drive/:id" element={<DriveContent />} />
            <Route path="isurvive" element={<DefcommAi />} />
            <Route path="isurvive/chat" element={<ChatBox />} />
            <Route path="isurvive/voice" element={<ChatBoxTwo />} />
            <Route path="settings" element={<Settings />} />
            <Route path="conference" element={<ShowConferenceRoute />} />
            <Route path="/conference/waiting/:meetingId" element={<WaitingScreen />} />
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};

export default DashboardRoutes;
