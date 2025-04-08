import React from 'react';

const MyFileRequestsTab = ({ fileRequests }) => (
  <div>
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-white/50 text-sm">
          <th>Name</th>
          <th>Request Date</th>
          <th>File Type</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {fileRequests.map((request, i) => (
          <tr key={i} className="border-b border-white/50 text-sm">
            <td>{request.name}</td>
            <td>{request.request_date.split('T')[0]}</td>
            <td>{request.file_ext}</td>
            <td>{request.file_size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MyFileRequestsTab;
