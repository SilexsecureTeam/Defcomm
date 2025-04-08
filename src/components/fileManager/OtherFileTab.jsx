import React from 'react';

const OtherFileTab = ({ files }) => (
  <div>
    {/* Similar to MyFilesTab, you can create a table or different layout for "Other File" tab */}
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-white/50 text-sm">
          <th>Name</th>
          <th>File Type</th>
          <th>Created At</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, i) => (
          <tr key={i} className="border-b border-white/50 text-sm">
            <td>{file.name}</td>
            <td>{file.file_ext}</td>
            <td>{file.created_at.split('T')[0]}</td>
            <td>{file.file_size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OtherFileTab;
