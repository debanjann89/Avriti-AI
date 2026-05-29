import { useRef, useState, useCallback } from "react";

export default function ImageUpload({ onFileSelect, previewUrl }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    onFileSelect(file);
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
      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Garment Image
      </label>

      <div
        onClick={() => inputRef.current.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
          flex flex-col items-center justify-center overflow-hidden
          ${dragging
            ? "border-violet-500 bg-violet-50"
            : previewUrl
            ? "border-transparent"
            : "border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50"
          }
        `}
        style={{ minHeight: "280px" }}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Garment preview"
              className="w-full h-full object-cover rounded-2xl"
              style={{ maxHeight: "340px" }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
              <span className="text-white text-sm font-medium">Click to change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Drop garment photo here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse — JPG, PNG, WEBP</p>
            </div>
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
