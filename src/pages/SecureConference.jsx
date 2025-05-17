import { useState, useContext } from 'react';
import {
  FaPhoneSlash,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaVolumeUp,
  FaCog,
} from 'react-icons/fa';
import logo from '../assets/logo-icon.png';
import { ChatContext } from '../context/ChatContext';
import CallComponent from '../components/video-sdk/CallComponent';

const SecureConference = () => {
  const { meetingId, setMeetingId } = useContext(ChatContext);



  // Render actual conference UI once meetingId is set
  return (<CallComponent
  initialMeetingId={null}
  setInitialMeetingId={setMeetingId}
  mode="CONFERENCE"
/>
  );
};

export default SecureConference;
