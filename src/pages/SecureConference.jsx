import {
  FaPhoneSlash,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaVolumeUp,
  FaCog,
  FaPhone,
} from 'react-icons/fa';
import { BsTelephoneFill } from 'react-icons/bs';
import { MdInsertDriveFile, MdCalendarToday, MdFolder, MdGroup, MdMail } from 'react-icons/md';
import { RiFolderVideoLine } from 'react-icons/ri';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { TbHealthRecognition } from 'react-icons/tb';
import logo from '../assets/logo-icon.png'
const icons = [
  { icon: <BsTelephoneFill />, active: true },
  { icon: <MdInsertDriveFile /> },
  { icon: <MdCalendarToday /> },
  { icon: <MdFolder /> },
  { icon: <RiFolderVideoLine /> },
  { icon: <MdMail /> },
  { icon: <MdGroup /> },
  { icon: <TbHealthRecognition /> },
  { icon: <HiOutlineGlobeAlt /> },
];

const SecureConference = () => {
  return (
    <div className="flex-1 p-6 text-white min-h-screen">

      {/* Meeting Title & Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-lg font-semibold">Nation Security Counsel Meeting</p>
          <p className="text-sm text-red-500 mt-1">● Recording 00:45:53</p>
        </div>
        <button className="bg-[#5C7C2A] text-white text-sm px-4 py-2 rounded-md">
          + Invite Member
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 flex items-center justify-center"
          >
            <img src={logo} alt="Participant" className="w-16 h-16 md:w-32 md:h-32 opacity-90 filter invert" />
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center items-center gap-8 text-2xl">
        <button className="text-gray-500 hover:text-white">
          <FaMicrophoneSlash />
        </button>
        <button className="text-gray-500 hover:text-white">
          <FaVideoSlash />
        </button>
        <button className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-700">
          <FaPhoneSlash />
        </button>
        <button className="text-gray-500 hover:text-white">
          <FaVolumeUp />
        </button>
        <button className="text-gray-500 hover:text-white">
          <FaCog />
        </button>
      </div>
    </div>
  );
};

export default SecureConference;
