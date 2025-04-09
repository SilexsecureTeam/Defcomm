import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import useFileManager from "../../../hooks/useFileManager";

export default function ShareFileModal({ isOpen, onClose, fileId }) {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const {
    contacts,
    isLoadingContacts,
    errorContacts,
    refetchContacts,
    shareFile,
  } = useFileManager();

  useEffect(() => {
    if (isOpen) {
      refetchContacts();
    }
  }, [isOpen, refetchContacts]);

  const handleSelectContact = (userId) => {
    setSelectedContacts((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((contact) => contact.contact_id));
    }
    setSelectAll(!selectAll);
  };

  const handleShare = async () => {
    if (!selectedContacts.length) {
      toast.error("Please select at least one contact to share with.");
      return;
    }

    try {
      await shareFile({ fileId, selectedContacts, expiryDate });
      setSelectedContacts([]);
      setExpiryDate("");
      onClose();
    } catch (error) {
      console.error("Error sharing file:", error);
      toast.error("Failed to share file.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-[90%] max-w-[650px] bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Share File
            </Dialog.Title>

            <label className="text-sm text-gray-600">
              Enter expiry date (optional)
            </label>
            <input
              type="date"
              className="w-full border px-2 py-1 rounded mb-4"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />

            <div className="border rounded-md overflow-y-scroll max-h-[500px]">
              <div className="flex items-center p-2 border-b">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <span className="text-sm">Select All</span>
              </div>

              {isLoadingContacts && (
                <div className="p-4 text-sm text-gray-500">
                  Loading contacts...
                </div>
              )}

              {errorContacts && (
                <div className="p-4 text-sm text-red-600">
                  Failed to load contacts. Please try again.
                </div>
              )}

              {!isLoadingContacts &&
                !errorContacts &&
                contacts?.map((contact) => (
                  <div
                    key={contact.contact_id}
                    className="flex items-center p-2 border-b last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.contact_id)}
                      onChange={() =>
                        handleSelectContact(contact.contact_id)
                      }
                      className="mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {contact.contact_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {contact.contact_email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {contact.contact_phone}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Share
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
