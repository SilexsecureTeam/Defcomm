import { useState, useContext } from 'react';
import {
  FaPhoneSlash,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaVolumeUp,
  FaCog,
} from 'react-icons/fa';
import logo from '../assets/logo-icon.png';
import { MeetingContext } from '../context/MeetingContext';
import CallComponent from '../components/video-sdk/CallComponent';

const SecureConference = () => {
  const { conferenceId, setConferenceId } = useContext(MeetingContext);



  // Render actual conference UI once meetingId is set
  return (<CallComponent
  initialMeetingId={null}
  setInitialMeetingId={setConferenceId}
  mode="CONFERENCE"
/>
  );
};

export default SecureConference;
