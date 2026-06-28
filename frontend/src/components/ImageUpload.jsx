import { useRef, useState, useCallback, useEffect } from "react";

export default function ImageUpload({ onFileSelect, previewUrl, label = "Garment Image" }) {
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [dragging, setDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    onFileSelect(file);
  };

  const startCamera = async (e) => {
    e.stopPropagation(); // Stop click from triggering file input click
    setCameraError("");
    setShowCamera(true);
  };

  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1080 },
          height: { ideal: 1440 }
        } 
      })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      })
      .catch(err => {
        console.error("Camera access failed:", err);
        setCameraError("Camera access denied or unavailable.");
      });
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 768;
    canvas.height = video.videoHeight || 1024;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `captured_garment_${Date.now()}.png`, { type: "image/png" });
        handleFile(file);
        setShowCamera(false);
      }
    }, "image/png");
  };

  const cancelCamera = (e) => {
    e.stopPropagation();
    setShowCamera(false);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex justify-between items-center">
        <span>{label}</span>
        {previewUrl && !showCamera && (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }} 
            className="text-xs text-red-500 font-bold hover:underline normal-case animate-fadeIn"
          >
            Remove Image
          </button>
        )}
      </label>

      <div
        onClick={() => !showCamera && inputRef.current.click()}
        onDrop={showCamera ? undefined : onDrop}
        onDragOver={showCamera ? undefined : onDragOver}
        onDragLeave={showCamera ? undefined : onDragLeave}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center overflow-hidden min-h-[280px]
          ${dragging
            ? "border-pink-500 bg-pink-50/50 shadow-inner"
            : previewUrl && !showCamera
            ? "border-transparent shadow-md"
            : "border-gray-300 bg-gray-50 hover:border-pink-400 hover:bg-pink-50/30"
          }
        `}
      >
        {showCamera ? (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-between p-4 z-10">
            {cameraError ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-white text-xs font-semibold">{cameraError}</p>
                <button
                  type="button"
                  onClick={cancelCamera}
                  className="bg-white/20 text-white font-extrabold text-xs py-2 px-6 rounded-full uppercase tracking-wider hover:bg-white/30 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-xl"
                  style={{ maxHeight: "calc(100% - 60px)" }}
                />
                <div className="flex items-center justify-between w-full mt-2 px-2 z-20">
                  <button
                    type="button"
                    onClick={cancelCamera}
                    className="bg-red-500/80 text-white font-extrabold text-xs py-2 px-4 rounded-full uppercase tracking-wider hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs py-2 px-6 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="5" fill="white"/>
                    </svg>
                    <span>Capture</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Garment preview"
              className="w-full h-full object-cover rounded-2xl"
              style={{ maxHeight: "340px" }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <span className="text-white text-xs font-medium bg-black/50 py-1.5 px-4 rounded-full backdrop-blur-sm">Click to change photo</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center">
              <svg className="w-7 h-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Drop garment photo here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse local files</p>
            </div>
            
            <button
              type="button"
              onClick={startCamera}
              className="mt-2 bg-pink-600/10 hover:bg-pink-600 text-pink-600 hover:text-white font-extrabold text-[10px] py-2 px-5 rounded-full border border-pink-600/30 hover:border-pink-600 uppercase tracking-widest flex items-center gap-2 transition duration-200"
            >
              <svg className="w-3.5 h-3.5 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span>Use Device Camera</span>
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
