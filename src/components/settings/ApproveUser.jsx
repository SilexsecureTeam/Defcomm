import React, { useState, useRef, useEffect, useMemo } from "react";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { toast } from "react-toastify";
import {
  FaQrcode,
  FaUserCheck,
  FaTimes,
  FaUserCircle,
  FaLock,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ApproveUser = () => {
  const { authDetails } = useContext(AuthContext);
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [scannerKey, setScannerKey] = useState(0);
  const { approveUser } = useAuth();

  const videoRef = useRef(null);
  const capturedRef = useRef(false);

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    if (!scanning) stopCamera();
    return () => stopCamera();
  }, [scanning]);

  const approveUserCode = async () => {
    if (!scannedCode) return;
    try {
      await approveUser.mutateAsync(scannedCode);
      setScannedCode(null);
      capturedRef.current = false;
    } catch (err) {}
  };

  const handleScan = (result) => {
    if (result?.text && !capturedRef.current && scanning) {
      capturedRef.current = true;
      try {
        const code = JSON.parse(result.text)?.code || result.text;
        setScannedCode(code);
        setScanning(false);
        toast.success("✅ QR code captured successfully!");
      } catch (error) {
        console.error("QR parsing error:", error);
        setScanning(false);
        capturedRef.current = false;
      }
    }
  };

  const handleCancel = () => {
    stopCamera();
    capturedRef.current = false;
    setScannedCode(null);
    setScanning(false);
    setScannerKey((k) => k + 1);
  };

  const handleStartScan = () => {
    stopCamera();
    capturedRef.current = false;
    setScannedCode(null);
    setScannerKey((k) => k + 1);
    setScanning(true);
  };

  const qrReader = useMemo(
    () =>
      scanning && !scannedCode ? (
        <div className="relative w-full h-72 bg-black rounded-lg overflow-hidden shadow-lg">
          <QrReader
            key={scannerKey}
            videoRef={videoRef}
            onResult={(result, error) => {
              if (!scanning) return;
              if (scannedCode || capturedRef.current) return;
              if (result) handleScan(result);
            }}
            constraints={{ facingMode: "environment" }}
            videoContainerStyle={{ width: "100%", height: "100%" }}
            videoStyle={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="border-4 border-oliveDark w-48 h-48 rounded-lg"></div>
            <p className="mt-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
              Position QR code inside the frame
            </p>
          </div>
        </div>
      ) : null,
    [scanning, scannerKey, scannedCode]
  );

  return (
    <div className="space-y-6 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
          <FaQrcode className="text-oliveDark" /> Approve User
        </h2>
        <p className="text-sm text-gray-500">
          Scan the user's QR code to capture details and grant access.
        </p>
      </div>

      {!scanning && !scannedCode && (
        <button
          onClick={handleStartScan}
          className="w-full px-5 py-3 bg-oliveDark text-white rounded-lg shadow hover:bg-oliveLight transition flex items-center justify-center gap-2"
        >
          <FaQrcode /> Start QR Scan
        </button>
      )}

      {qrReader}

      {scannedCode && (
        <div className="space-y-4">
          {/* Approval Card */}
          <div className="p-5 bg-gray-50 border rounded-xl shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-4xl text-gray-400" />
              <div>
                <p className="font-semibold text-gray-800">
                  {authDetails?.user?.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {authDetails?.user?.email}
                </p>
                <p className="text-xs text-gray-400">Role: Guest</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaLock className="text-oliveDark" />
              <span>Requesting access to Secure Dashboard</span>
            </div>

            <p className="text-xs text-gray-400">
              Captured Code:{" "}
              <span className="font-mono text-gray-800">{scannedCode}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={approveUserCode}
              disabled={approveUser.isPending}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaUserCheck />
              {approveUser.isPending ? "Approving..." : "Approve Access"}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <FaTimes /> Deny
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveUser;
