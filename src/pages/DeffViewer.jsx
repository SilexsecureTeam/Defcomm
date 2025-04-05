import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

const DeffViewer = () => {
  const viewerRef = useRef(null);
  const instanceRef = useRef(null); // to store the viewer instance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const initializeViewer = async () => {
      if (!viewerRef.current || instanceRef.current) return;

      try {
        const instance = await WebViewer(
          {
            path: '/lib/webviewer',
            licenseKey: import.meta.env.VITE_VIEWER_LICENSE_KEY,
            initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
          },
          viewerRef.current
        );

        if (!cancelled) {
          instanceRef.current = instance;
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load viewer');
          setLoading(false);
        }
      }
    };

    initializeViewer();

    return () => {
      cancelled = true;

      // Cleanup WebViewer iframe to avoid multiple instances
      const viewerElement = viewerRef.current;
      if (viewerElement) {
        while (viewerElement.firstChild) {
          viewerElement.removeChild(viewerElement.firstChild);
        }
      }

      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-[80vh] relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <span className="text-gray-600 font-medium">Loading document...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
          <span className="text-red-600 font-medium">{error}</span>
        </div>
      )}
      <div className="webviewer w-full h-full" ref={viewerRef}></div>
    </div>
  );
};

export default DeffViewer;
