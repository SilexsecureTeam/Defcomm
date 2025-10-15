import { useState, useMemo } from "react";
import useConference from "../../../hooks/useConference";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import MyMeetingsSlider from "./MyMeetingsSlider";
import SEOHelmet from "../../../engine/SEOHelmet";
import {
  FaVideo,
  FaCalendarAlt,
  FaPlus,
  FaUsers,
  FaClock,
} from "react-icons/fa";

const InitConference = ({ meetingId, setMeetingId }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);

  const { getMyMeetingsQuery, getMeetingInviteQuery } = useConference();
  const { data: createdMeetings = [], isLoading: loadingCreated } =
    getMyMeetingsQuery;
  const { data: invitedMeetings = [], isLoading: loadingInvited } =
    getMeetingInviteQuery;
  const { join } = useMeeting();

  const allMeetings = useMemo(() => {
    const labelMeetings = (meetings, source) =>
      meetings.map((m) => ({ ...m, _source: source }));

    return [
      ...labelMeetings(createdMeetings, "You"),
      ...labelMeetings(invitedMeetings, "Invited"),
    ].sort((a, b) => new Date(b.startdatetime) - new Date(a.startdatetime));
  }, [createdMeetings, invitedMeetings]);

  const upcomingMeetings = useMemo(() => {
    const now = new Date();
    const labelMeetings = (meetings, source) =>
      meetings.map((m) => ({ ...m, _source: source }));

    return [
      ...labelMeetings(
        createdMeetings.filter((m) => new Date(m.startdatetime) > now),
        "You"
      ),
      ...labelMeetings(
        invitedMeetings.filter((m) => new Date(m.startdatetime) > now),
        "Invited"
      ),
    ].sort((a, b) => new Date(a.startdatetime) - new Date(b.startdatetime));
  }, [createdMeetings, invitedMeetings]);

  const loading = loadingCreated || loadingInvited;

  const actionCards = [
    {
      title: "My Meetings",
      description: "Manage scheduled meetings",
      icon: FaCalendarAlt,
      action: () => navigate("/dashboard/conference/my-meetings"),
      color: "from-oliveLight to-oliveDark border-olive",
      accent: "text-oliveHover",
    },
    {
      title: "Create Meeting",
      description: "Start new conference",
      icon: FaPlus,
      action: () => navigate("/dashboard/conference/create"),
      color: "from-olive to-oliveGreen border-oliveGreen",
      accent: "text-oliveHover",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 text-white">
      <SEOHelmet title="Secure Conference | Defcomm" />

      {mode && <HeaderBar onBack={() => setMode(null)} />}

      {mode === null && (
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="p-5 bg-gradient-to-br from-olive to-oliveGreen rounded-2xl shadow-2xl transform rotate-3">
                  <FaVideo className="text-2xl md:text-3xl text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-oliveHover rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-oliveHover to-yellow bg-clip-text text-transparent">
                Defcomm Conference
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Secure, professional video conferencing for enterprise
                collaboration and team communication
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-oliveHover">
                {allMeetings.length}
              </div>
              <div className="text-gray-400 text-sm">Total Meetings</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-oliveHover">
                {upcomingMeetings.length}
              </div>
              <div className="text-gray-400 text-sm">Upcoming</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-oliveHover">
                {createdMeetings.length}
              </div>
              <div className="text-gray-400 text-sm">Created by You</div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          {upcomingMeetings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-olive/20 rounded-lg">
                  <FaClock className="text-oliveHover text-lg" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Upcoming Meetings
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Your scheduled conferences
                  </p>
                </div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-4">
                <MyMeetingsSlider
                  title=""
                  meetings={upcomingMeetings}
                  showCountdown={true}
                  onMeetingClick={(meeting) => {
                    navigate(`/dashboard/conference/waiting/${meeting?.id}`);
                  }}
                  onEditMeeting={(meeting) => {
                    navigate("/dashboard/conference/create", {
                      state: { data: meeting },
                    });
                  }}
                  loading={loading}
                  showSource={true}
                />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Quick Actions
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Start collaborating with your team
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {actionCards.map((card, index) => (
                <button
                  key={index}
                  onClick={card.action}
                  className={`group relative bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <card.icon className={`text-2xl ${card.accent}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white">
                        {card.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* All Meetings CTA */}
          {allMeetings.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => navigate("/dashboard/conference/meetings")}
                className="group bg-gradient-to-r from-olive to-oliveGreen hover:from-oliveGreen hover:to-olive text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-oliveHover/20"
              >
                <span className="flex items-center gap-3">
                  View All Meetings
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-sm group-hover:bg-white/30 transition-colors">
                    {allMeetings.length}
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InitConference;
