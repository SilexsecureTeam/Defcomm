import { useContext } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import DashTabs from '../components/dashboard/DashTabs'
import { MeetingContext } from '../context/MeetingContext'
import SecureConference from '../pages/SecureConference'

const DashboardLayout = () => {
  const { showConference, setShowConference } = useContext(MeetingContext);
  const {pathname} = useLocation();
  const isChatPage = pathname.includes('/dashboard/chat');
  return (
    <div className="bg-transparent">

    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className={`${isChatPage ? "lg:hidden":"lg:flex"} mt-10 p-0 md:p-6`}>
        <DashTabs />
      </div>

      {/* Content Area */}
      <main className={`${isChatPage ? "lg:p-0":"lg:p-6"} flex-1 p-0 py-3 md:p-6`}>
        <Outlet />

        {showConference && <SecureConference />}
      </main>
    </div>
  </div>
  )
}

export default DashboardLayout
