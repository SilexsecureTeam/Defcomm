import { useState } from "react";
import Modal from "../modal/Modal";

function EmergencyBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExploreClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-oliveGreen text-gray-900 p-6 min-h-64 flex flex-col md:flex-row md:flex-wrap justify-between gap-2">
      <div className="flex-1 flex flex-col md:w-1/2 gap-2 justify-between">
        <h2 className="text-xl md:text-2xl font-bold flex items-center space-x-2">
          <span>GED Global Encryption Day 2025 - Hosted by DEFCOMM</span>
        </h2>
        <p className="text-sm opacity-70 font-medium max-w-[90%]">
          Join cybersecurity professionals and defense experts worldwide for the
          Global Encryption Day (GED) on October 21, 2025. Discover the latest
          advancements in encryption, data sovereignty, and digital defense
          strategies.
        </p>
        <button
          onClick={handleExploreClick}
          className="bg-gray-900 text-white/70 px-4 py-2 mt-4 w-max"
        >
          Explore Now
        </button>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} closeModal={handleCloseModal}>
          <div className="max-w-[600px] p-4 space-y-4 text-gray-800 bg-white">
            <h3 className="text-xl font-bold">
              Global Encryption Day 2025 – Strengthening Digital Trust{" "}
            </h3>
            <p className="text-sm">
              Hosted by <strong>DEFCOMM Solutions</strong>, GED 2025 brings
              together leaders in cybersecurity, cryptography, and defense
              communications to explore the evolution of encryption technologies
              in a hyperconnected world.
            </p>
            <p className="text-sm">
              The hybrid event—held both virtually and physically—will showcase
              key innovations in end-to-end encryption, national defense-grade
              communication systems, and global data protection frameworks.
            </p>
            <p className="text-sm">
              Attendees will experience live demonstrations, expert panel
              discussions, and collaborative sessions on securing the digital
              future through innovation and policy alignment.
            </p>
            <p className="text-sm">
              <strong>Date:</strong> Tuesday, October 21, 2025 <br />
              <strong>Venue:</strong> Hybrid (Physical + Virtual) <br />
              <strong>Host:</strong> DEFCOMM Solutions <br />
              <strong>Theme:</strong> “Strong Encryption, Stronger Future”
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default EmergencyBanner;
