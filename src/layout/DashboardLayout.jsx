import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import DashTabs from '../components/dashboard/DashTabs'
import { MeetingContext } from '../context/MeetingContext'
import SecureConference from '../pages/SecureConference'

const DashboardLayout = () => {
  const { showConference, setShowConference } = useContext(MeetingContext);

  return (
    <div className="bg-transparent">

    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="mt-10 p-0 md:p-6">
        <DashTabs />
      </div>

      {/* Content Area */}
      <main className="flex-1 p-0 py-3 md:p-6">
        <Outlet />

        {showConference && <SecureConference />}
      </main>
    </div>
  </div>
  )
}

export default DashboardLayout
