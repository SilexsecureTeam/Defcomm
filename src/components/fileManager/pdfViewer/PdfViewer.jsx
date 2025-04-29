import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import SEOHelmet from '../../../engine/SEOHelmet';
import { AuthContext } from '../../../context/AuthContext';

const PdfViewer = () => {
  const { fileId } = useParams();
  const { authDetails } = useContext(AuthContext); // assumes user.token exists
  const [iframeSrc, setIframeSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHtmlBlob = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/file/${fileId}/view`,
          {
            headers: {
              Authorization: `Bearer ${authDetails?.access_token}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }

        const htmlText = await response.text();

        // Create a Blob from the HTML content
        const blob = new Blob([htmlText], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        setIframeSrc(blobUrl);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchHtmlBlob();

    return () => {
      if (iframeSrc) {
        URL.revokeObjectURL(iframeSrc); // Clean up the blob URL
      }
    };
  }, [fileId]);

  return (
    <div className="w-full h-screen relative bg-white">
      <SEOHelmet title="View PDF" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-600">Loading document...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <span className="text-red-600">{error}</span>
        </div>
      )}

      {/* Embed the Blob URL inside an iframe */}
      {!loading && !error && iframeSrc && (
        <iframe
          src={iframeSrc}
          title="PDF Viewer"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      )}
    </div>
  );
};

export default PdfViewer;
