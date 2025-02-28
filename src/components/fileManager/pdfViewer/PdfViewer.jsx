import React, { useState, useEffect } from 'react';

const PdfViewer = ({ fileContent }) => {
  const [iframeKey, setIframeKey] = useState(0);
  
  // Create a blob URL from the HTML content
  const createBlobUrl = (htmlContent) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };
  
  // Force iframe refresh when content changes
  useEffect(() => {
    setIframeKey(prevKey => prevKey + 1);
  }, [fileContent]);
  
  return (
    <div style={{ marginTop: "20px" }}>
      {fileContent && (
        <iframe
          key={iframeKey}
          src={createBlobUrl(fileContent)}
          style={{ width: '100%', height: '800px', border: '1px solid #ccc' }}
          title="PDF Viewer"
          sandbox="allow-scripts allow-same-origin"
        />
      )}
    </div>
  );
};

export default PdfViewer;