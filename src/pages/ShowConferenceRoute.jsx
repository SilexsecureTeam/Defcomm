// src/routes/ShowConferenceRoute.jsx or similar
import { useEffect, useContext } from 'react';
import { MeetingContext } from '../context/MeetingContext';

const ShowConferenceRoute = () => {
  const { setShowConference } = useContext(MeetingContext);

  useEffect(() => {
    setShowConference(true);
  }, [setShowConference]);

  return null; // Don't render anything, just trigger the state
};

export default ShowConferenceRoute;
