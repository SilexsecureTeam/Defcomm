import React from 'react';

const PendingFileInvitationsTab = ({ invitations, onAccept, onDecline }) => (
  <div>
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-white/50 text-sm">
          <th>Name</th>
          <th>Invitation Date</th>
          <th>Size</th>
          <th>Uploaded By</th>
          <th>Shared By</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {invitations.map((invitation, i) => (
          <tr key={i} className="border-b border-white/50 text-sm">
            <td>{invitation.file_name}</td>
            <td>{invitation.shared_date.split('T')[0]}</td>
            <td>{invitation.file_size}</td>
            <td>{invitation.uploaded_by}</td>
            <td>{invitation.shared_by}</td>
            <td>
              <div className="flex items-center">
                <button
                  className="bg-olive px-3 py-2 text-sm"
                  onClick={() => onAccept(invitation.file_id)}
                >
                  Accept
                </button>
                <button
                  className="bg-oliveDark px-3 py-2 text-sm"
                  onClick={() => onDecline(invitation.file_id)}
                >
                  Decline
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PendingFileInvitationsTab;
