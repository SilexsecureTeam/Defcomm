import { useState, useContext } from "react";
import {
  FaPhoneSlash,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaVolumeUp,
  FaCog,
} from "react-icons/fa";
import logo from "../assets/logo-icon.png";
import { MeetingContext } from "../context/MeetingContext";
import CallComponent from "../components/video-sdk/CallComponent";
import ConferenceRoom from "./ConferenceRoom";

const SecureConference = () => {
  // Render actual conference UI once meetingId is set
  return <ConferenceRoom />;
};

export default SecureConference;
