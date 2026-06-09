import { useState, useRef, useEffect, useContext } from "react";
import ImageUpload from "./ImageUpload";
import PersonaSelector from "./PersonaSelector";
import { generateTryOn, removeBackground } from "../api/tryon";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { TRY_ON_PRESETS } from "../data/tryOnPresets";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { 
  User, Check, Lock, Upload, Camera, Sparkles, 
  Download, Image as ImageIcon, Shirt, Sliders, 
  Info, ArrowRight, LayoutGrid, Settings,
  AlertCircle, RefreshCw, Eye
} from "lucide-react";


const DEFAULT_PERSONA = {
  gender: "Woman",
  ageGroup: "Young Adult",
  ethnicity: "South Asian",
  bodyType: "M",
  angles: ["Front View"], // 🚨 UPDATED: Now an array to support multiple selections!
  backdrop: "Minimalist Studio",
};

const GARMENT_LABELS = {
  garment_type: "Type",
  primary_color: "Primary Color",
  secondary_color: "Secondary Color",
  pattern: "Pattern",
  fabric_texture: "Fabric",
  neckline: "Neckline",
  sleeve_type: "Sleeves",
  silhouette: "Silhouette",
  style: "Style",
  occasion: "Occasion",
  key_details: "Details",
};

function GarmentBadge({ analysis }) {
  if (!analysis) return null;
  return (
    <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
      <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-3">
        Garment Analysis · Gemini Vision
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {Object.entries(GARMENT_LABELS).map(([key, label]) => {
          const val = analysis[key];
          if (!val) return null;
          return (
            <div key={key} className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase">{label}</span>
              <span className="text-xs font-medium text-gray-700 capitalize">{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PersonImageUpload({ onFileSelect, previewUrl }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Your Photo <span className="text-gray-400 font-normal normal-case">(optional — boosts fit accuracy)</span>
        </label>
        {previewUrl && (
          <button
            onClick={() => onFileSelect(null)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      {previewUrl ? (
        <div
          className="relative rounded-xl overflow-hidden border-2 border-pink-300 cursor-pointer"
          style={{ height: 120 }}
          onClick={() => inputRef.current?.click()}
        >
          <img
            src={previewUrl}
            alt="Your photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-medium">Change photo</span>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all"
          style={{ height: 100 }}
          onClick={() => inputRef.current?.click()}
        >
          <span className="text-2xl">🧍</span>
          <span className="text-xs text-gray-400">Upload your photo for body-fit mode</span>
          <span className="text-[10px] text-emerald-600 font-medium">↑ ~99% garment fit accuracy</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

function FittingModeBadge({ mode }) {
  if (!mode) return null;
  const isPersonMode = mode === "person_reference";
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
        isPersonMode
          ? "bg-emerald-100 text-emerald-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      <span>{isPersonMode ? "✓" : "◎"}</span>
      <span>{isPersonMode ? "Body-fit mode (highest accuracy)" : "Garment-seed mode"}</span>
    </div>
  );
}

function ResultPanel({ 
  images, 
  onDownload, 
  onPublish, 
  onSaveToWardrobe, 
  isSavingToWardrobe,
  persona,
  removedBgFront,
  removedBgBack,
  bgRemovingFront,
  bgRemovingBack
}) {
  const [selected, setSelected] = useState(0);
  const [publishName, setPublishName] = useState("");
  const [publishPrice, setPublishPrice] = useState("");

  // New states for VTON overlay mode
  const [tryonMode, setTryonMode] = useState("creative"); // "creative" or "exact"
  const [garmentScale, setGarmentScale] = useState(0.65);
  const [garmentY, setGarmentY] = useState(60);
  const [garmentX, setGarmentX] = useState(0);
  const [garmentRotate, setGarmentRotate] = useState(0);

  if (!images?.length) return null;

  const activeAngle = persona?.angles?.[selected] || "Front View";
  const isBackAngle = activeAngle.toLowerCase().includes("back");
  const activeGarmentOverlay = isBackAngle ? (removedBgBack || removedBgFront) : removedBgFront;
  const isRemovingBgActive = isBackAngle ? bgRemovingBack : bgRemovingFront;

  // Combines model background image and positioned transparent garment cutout onto a canvas
  const getCombinedImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const modelImg = new Image();
      modelImg.onload = () => {
        canvas.width = modelImg.naturalWidth;
        canvas.height = modelImg.naturalHeight;
        
        // Draw the base model
        ctx.drawImage(modelImg, 0, 0);
        
        if (tryonMode === "exact" && activeGarmentOverlay) {
          const garmentImg = new Image();
          garmentImg.onload = () => {
            ctx.save();
            
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            
            // Map the preview offset (at 520px height) to natural image scale
            const previewHeight = 520;
            const scaleFactor = modelImg.naturalHeight / previewHeight;
            
            ctx.translate(cx + garmentX * scaleFactor, cy + garmentY * scaleFactor);
            ctx.rotate((garmentRotate * Math.PI) / 180);
            
            // Draw garment scaled relative to preview dimensions
            const previewWidth = previewHeight * (modelImg.naturalWidth / modelImg.naturalHeight);
            const garmentTargetWidth = previewWidth * 0.6 * garmentScale * scaleFactor;
            const garmentTargetHeight = (garmentImg.naturalHeight / garmentImg.naturalWidth) * garmentTargetWidth;
            
            ctx.drawImage(
              garmentImg,
              -garmentTargetWidth / 2,
              -garmentTargetHeight / 2,
              garmentTargetWidth,
              garmentTargetHeight
            );
            
            ctx.restore();
            
            const dataURL = canvas.toDataURL("image/png");
            const base64 = dataURL.replace(/^data:image\/png;base64,/, "");
            resolve(base64);
          };
          garmentImg.src = activeGarmentOverlay;
        } else {
          resolve(images[selected]);
        }
      };
      modelImg.src = `data:image/png;base64,${images[selected]}`;
    });
  };

  const handleCombinedDownload = async () => {
    const combinedB64 = await getCombinedImage();
    onDownload(combinedB64, selected);
  };

  const handleCombinedSaveToWardrobe = async () => {
    const combinedB64 = await getCombinedImage();
    onSaveToWardrobe(combinedB64);
  };

  const handleCombinedPublish = async () => {
    const combinedB64 = await getCombinedImage();
    onPublish(combinedB64, publishName, publishPrice);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Try-On Result
        </label>
        
        {/* Try-On Mode Switcher */}
        <div className="flex bg-pink-50/50 p-1.5 rounded-2xl border border-pink-100/50 gap-1.5 w-fit">
          <button
            type="button"
            onClick={() => setTryonMode("creative")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tryonMode === "creative"
                ? "bg-pink-600 text-white shadow"
                : "text-gray-500 hover:text-pink-600 hover:bg-pink-50/20"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Creative Fit</span>
          </button>
          <button
            type="button"
            onClick={() => setTryonMode("exact")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tryonMode === "exact"
                ? "bg-pink-600 text-white shadow"
                : "text-gray-500 hover:text-pink-600 hover:bg-pink-50/20"
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Exact Product Fit</span>
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${tryonMode === "exact" ? "md:grid-cols-3" : ""} gap-6`}>
        {/* Column 1 & 2: Image Container */}
        <div className={`${tryonMode === "exact" ? "md:col-span-2" : ""} relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center min-h-[400px]`}>
          <img
            src={`data:image/png;base64,${images[selected]}`}
            alt="Virtual try-on result"
            className="w-full object-contain"
            style={{ maxHeight: "520px" }}
          />

          {/* Overlaid transparent garment cutout */}
          {tryonMode === "exact" && (
            <>
              {isRemovingBgActive ? (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-white text-xs font-bold mt-3">Extracting clean garment cutout...</p>
                  <p className="text-white/60 text-[10px] mt-1">Removing background automatically</p>
                </div>
              ) : activeGarmentOverlay ? (
                <img
                  src={activeGarmentOverlay}
                  alt="Garment overlay"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) translate(${garmentX}px, ${garmentY}px) scale(${garmentScale}) rotate(${garmentRotate}deg)`,
                    pointerEvents: "none",
                    width: "55%",
                    height: "auto",
                    transformOrigin: "center center",
                    filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))"
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <AlertCircle className="w-8 h-8 text-pink-500 mb-2 animate-bounce" />
                  <p className="text-white text-xs font-bold">No transparent cutout available</p>
                  <p className="text-white/60 text-[10px] mt-1">Make sure you have uploaded a front garment image.</p>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleCombinedDownload}
              className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow hover:bg-white transition-colors"
            >
              ↓ Download
            </button>
            <button
              onClick={handleCombinedSaveToWardrobe}
              disabled={isSavingToWardrobe}
              className="bg-pink-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {isSavingToWardrobe ? "Saving..." : "❤ Save to Wardrobe"}
            </button>
          </div>
        </div>

        {/* Column 3: Sizing & Placement Sliders (only visible in exact mode) */}
        {tryonMode === "exact" && (
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-pink-100/60 shadow flex flex-col gap-4 text-left">
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
              <Sliders className="w-4 h-4 text-pink-600" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Alignment Controls</h3>
            </div>
            
            {/* Scale Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-500">
                <span>GARMENT SIZE</span>
                <span className="text-pink-600 font-extrabold">{Math.round(garmentScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.01"
                value={garmentScale}
                onChange={(e) => setGarmentScale(parseFloat(e.target.value))}
                className="w-full h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
              />
            </div>

            {/* Vertical Y-offset Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-500">
                <span>HEIGHT (Y-AXIS)</span>
                <span className="text-pink-600 font-extrabold">{garmentY}px</span>
              </div>
              <input
                type="range"
                min="-200"
                max="250"
                step="1"
                value={garmentY}
                onChange={(e) => setGarmentY(parseInt(e.target.value))}
                className="w-full h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
              />
            </div>

            {/* Horizontal X-offset Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-500">
                <span>ALIGNMENT (X-AXIS)</span>
                <span className="text-pink-600 font-extrabold">{garmentX}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="1"
                value={garmentX}
                onChange={(e) => setGarmentX(parseInt(e.target.value))}
                className="w-full h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
              />
            </div>

            {/* Rotation Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-500">
                <span>ROTATION</span>
                <span className="text-pink-600 font-extrabold">{garmentRotate}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={garmentRotate}
                onChange={(e) => setGarmentRotate(parseInt(e.target.value))}
                className="w-full h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
              />
            </div>

            {/* Quick Reset Button */}
            <button
              onClick={() => {
                setGarmentScale(0.65);
                setGarmentY(60);
                setGarmentX(0);
                setGarmentRotate(0);
              }}
              className="mt-2 w-full py-2 bg-gray-50 hover:bg-pink-50 text-gray-500 hover:text-pink-600 border border-gray-100 hover:border-pink-200 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Alignment</span>
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`rounded-xl overflow-hidden border-2 transition-all ${
                selected === i
                  ? "border-pink-500 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
              style={{ width: 64, height: 80 }}
            >
              <img
                src={`data:image/png;base64,${img}`}
                className="w-full h-full object-cover"
                alt={`Variant ${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 bg-pink-50 p-4 rounded-2xl border border-pink-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Publish to Store</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Product Name" 
            value={publishName}
            onChange={(e) => setPublishName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input 
            type="number" 
            placeholder="Price (₹)" 
            value={publishPrice}
            onChange={(e) => setPublishPrice(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button 
            onClick={handleCombinedPublish}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors text-sm whitespace-nowrap"
          >
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
}

const getOptionIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("saree") || n.includes("lehenga") || n.includes("anarkali") || n.includes("ethnic") || n.includes("jhumka") || n.includes("earring") || n.includes("juttis")) {
    return <Sparkles className="w-4 h-4 text-pink-600 stroke-[1.5]" />;
  }
  if (n.includes("shirt") || n.includes("polo") || n.includes("blazer") || n.includes("suit") || n.includes("tuxedo") || n.includes("jacket") || n.includes("kurta") || n.includes("top") || n.includes("blouse")) {
    return <Shirt className="w-4 h-4 text-pink-600 stroke-[1.5]" />;
  }
  return <Sliders className="w-4 h-4 text-pink-600 stroke-[1.5]" />;
};

export default function TryOnStudio() {
  const { user } = useContext(AuthContext);

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50/30 p-6">
        <div className="max-w-md w-full bg-white border border-pink-100 p-8 rounded-3xl text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-pink-100/80 border border-pink-200/60 rounded-full flex items-center justify-center mx-auto text-pink-600 shadow-inner">
            <Lock className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Seller Studio Only</h2>
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
              Aavriti AI Virtual Try-On Studio is a specialized B2B tool reserved for **Sellers** to generate, preview, and publish high-realism catalogs. 
            </p>
            <div className="bg-pink-50/55 border border-pink-100 rounded-xl p-3 text-[10px] text-pink-800 leading-normal text-left max-w-xs mx-auto mt-2">
              <strong>💡 Want to test it?</strong>
              <br />
              Navigate to your <strong>Profile Page</strong>, and use the professional <strong>Demo Role Switcher</strong> to toggle your role to <strong>Seller</strong> or <strong>Admin</strong>!
            </div>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <a href="/profile" className="inline-block bg-pink-600 text-white font-extrabold text-[10px] px-6 py-3 rounded-full uppercase tracking-wider shadow-md hover:bg-pink-700 transition-all">
              Go to Profile
            </a>
            <a href="/" className="text-[10px] font-bold text-gray-400 hover:text-pink-600 uppercase tracking-widest hover:underline transition-all pt-1">
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const [garmentFile, setGarmentFile] = useState(null);
  const [garmentPreview, setGarmentPreview] = useState(null);
  const [garmentBackFile, setGarmentBackFile] = useState(null);
  const [garmentBackPreview, setGarmentBackPreview] = useState(null);
  const [personFile, setPersonFile] = useState(null);

  // States for transparent cutout overlay mode
  const [removedBgFront, setRemovedBgFront] = useState(null);
  const [removedBgBack, setRemovedBgBack] = useState(null);
  const [bgRemovingFront, setBgRemovingFront] = useState(false);
  const [bgRemovingBack, setBgRemovingBack] = useState(false);

  const [personPreview, setPersonPreview] = useState(null);
  const [persona, setPersona] = useState(DEFAULT_PERSONA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("idle");
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  // 🚨 NEW: Catalog Browser States
  const [wizardStep, setWizardStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState("Indian Ethnic Wear");
  const [activeSubcategory, setActiveSubcategory] = useState("Saree");
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Sync Category tabs when Gender selection changes
  useEffect(() => {
    const genderPresets = TRY_ON_PRESETS[persona.gender];
    if (genderPresets) {
      const firstCategory = Object.keys(genderPresets)[0];
      setActiveCategory(firstCategory);
      const subcategories = Object.keys(genderPresets[firstCategory]);
      setActiveSubcategory(subcategories[0]);
      setSelectedPreset(null);
    }
  }, [persona.gender]);

  // Sync Subcategories when primary Category tab changes
  useEffect(() => {
    const genderPresets = TRY_ON_PRESETS[persona.gender];
    if (genderPresets && genderPresets[activeCategory]) {
      const subcategories = Object.keys(genderPresets[activeCategory]);
      setActiveSubcategory(subcategories[0]);
      setSelectedPreset(null);
    }
  }, [activeCategory]);
 
  const handleGarmentSelect = async (file) => {
    setGarmentFile(file);
    setGarmentPreview(file ? URL.createObjectURL(file) : null);
    setRemovedBgFront(null);
    setResult(null);
    setError(null);
    if (file) {
      setBgRemovingFront(true);
      try {
        const res = await removeBackground(file);
        setRemovedBgFront(res.image);
      } catch (err) {
        console.error("Failed to remove background from front garment:", err);
      } finally {
        setBgRemovingFront(false);
      }
    }
  };

  const handleGarmentBackSelect = async (file) => {
    setGarmentBackFile(file);
    setGarmentBackPreview(file ? URL.createObjectURL(file) : null);
    setRemovedBgBack(null);
    setResult(null);
    setError(null);
    if (file) {
      setBgRemovingBack(true);
      try {
        const res = await removeBackground(file);
        setRemovedBgBack(res.image);
      } catch (err) {
        console.error("Failed to remove background from back garment:", err);
      } finally {
        setBgRemovingBack(false);
      }
    }
  };
 
  const handlePersonSelect = (file) => {
    setPersonFile(file);
    setPersonPreview(file ? URL.createObjectURL(file) : null);
  };
 
  const handleGenerate = async () => {
    const fileToUpload = garmentFile;
    setLoading(true);
    setError(null);
    setResult(null);
    setStep("scanning");
 
    if (!fileToUpload) {
      setError("Please upload your product photo first.");
      setLoading(false);
      setStep("idle");
      return;
    }
 
    // Start a simulated progress timeline
    const timers = [];
    const scheduleStep = (nextStep, delay) => {
      const timer = setTimeout(() => {
        setStep(nextStep);
      }, delay);
      timers.push(timer);
    };
 
    scheduleStep("analyzing", 3000);
    scheduleStep("prompting", 7000);
    scheduleStep("generating", 11000);
    scheduleStep("polishing", 20000);
 
    try {
      const categoryHints = {
        category: activeCategory,
        subcategory: activeSubcategory,
        description: selectedPreset ? `${selectedPreset.name}. ${selectedPreset.description}` : ""
      };
      const data = await generateTryOn(fileToUpload, personFile, persona, categoryHints, garmentBackFile);
      timers.forEach(t => clearTimeout(t));
      setResult(data);
      setStep("done");
    } catch (err) {
      timers.forEach(t => clearTimeout(t));
      setError(typeof err === "string" ? err : err.message);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (b64, index) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${b64}`;
    link.download = `aavriti-tryon-${Date.now()}-${index + 1}.png`;
    link.click();
  };

  const [savingWardrobe, setSavingWardrobe] = useState(false);
  const handleSaveToWardrobe = async (b64) => {
    if (!user) {
      alert("Please log in to save to your virtual wardrobe.");
      return;
    }
    setSavingWardrobe(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/wardrobe/save", {
        user_id: user.id,
        image_b64: b64,
        product_id: null
      });
      alert(response.data.message || "Saved to your Virtual Wardrobe successfully!");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.detail || "Failed to save to virtual wardrobe.");
    } finally {
      setSavingWardrobe(false);
    }
  };

  const handlePublish = async (b64, name, price) => {
    if (!name || !price) {
      alert("Please enter a name and price for the product.");
      return;
    }
    try {
      await addProduct({
        name,
        brand: "Aavriti AI",
        price: Number(price),
        image: `data:image/png;base64,${b64}`,
        category: selectedPreset ? activeCategory : "Custom Try-On",
        description: "Custom generated virtual try-on product.",
        tryOnCompatible: true
      });
      alert("Product published successfully!");
      navigate('/collections');
    } catch (e) {
      console.error(e);
      alert("Failed to publish product");
    }
  };

  const canGenerate = (!!garmentFile || !!selectedPreset) && !loading;

  const stepLabel = step === "analyzing"
    ? "✦ Analyzing garment with Gemini…"
    : step === "generating" || loading
    ? "✦ Generating with FLUX.1…"
    : "✦ Generate Try-On";

  const genderPresets = TRY_ON_PRESETS[persona.gender] || {};
  const categoriesList = [...Object.keys(genderPresets), "Upload Custom"];

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-pink-50 rounded-b-3xl">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Virtual Try-On Studio</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Upload a garment or browse our categorized catalog, add your photo, and generate photorealistic fittings!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Inputs */}
          <div className="flex flex-col gap-6">
            {/* STEP 1: MODEL GENDER PROFILE */}
            {wizardStep === 1 ? (
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-pink-100/80 shadow-2xl space-y-6 transition-all duration-350 transform scale-100 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm shadow-pink-100">Step 1</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse"></span>
                    <h2 className="text-base font-bold text-gray-900 tracking-tight">Who is trying on outfits today?</h2>
                  </div>
                  <p className="text-xs text-gray-400">Choose a gender profile to load custom boutique selections.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Woman Avatar Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPersona(prev => ({ ...prev, gender: "Woman" }));
                      setWizardStep(2);
                    }}
                    className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                      persona.gender === "Woman"
                        ? "border-pink-500 bg-pink-50/10 shadow-md shadow-pink-100/50"
                        : "border-gray-100 bg-gray-50/30 hover:border-pink-200"
                    }`}
                  >
                    {/* Premium Circle Badge */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      persona.gender === "Woman"
                        ? "bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-300 shadow-inner"
                        : "bg-gray-100 border border-gray-200 group-hover:bg-pink-50/50 group-hover:border-pink-300"
                    }`}>
                      <User className="w-7 h-7 text-pink-600 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Woman Model</span>
                    <span className="text-[10px] text-gray-400 mt-2 text-center leading-normal max-w-[150px]">Traditional Sarees, Bridal Lehengas & Accessories</span>
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full border border-pink-500 flex items-center justify-center">
                      {persona.gender === "Woman" && <div className="w-2 h-2 rounded-full bg-pink-500" />}
                    </div>
                  </button>

                  {/* Man Avatar Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPersona(prev => ({ ...prev, gender: "Man" }));
                      setWizardStep(2);
                    }}
                    className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                      persona.gender === "Man"
                        ? "border-pink-500 bg-pink-50/10 shadow-md shadow-pink-100/50"
                        : "border-gray-100 bg-gray-50/30 hover:border-pink-200"
                    }`}
                  >
                    {/* Premium Circle Badge */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      persona.gender === "Man"
                        ? "bg-gradient-to-br from-slate-600/10 to-indigo-600/10 border border-slate-300 shadow-inner"
                        : "bg-gray-100 border border-gray-200 group-hover:bg-slate-50/50 group-hover:border-slate-300"
                    }`}>
                      <User className="w-7 h-7 text-slate-700 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Man Model</span>
                    <span className="text-[10px] text-gray-400 mt-2 text-center leading-normal max-w-[150px]">Sherwanis, Kurtas, Blazers & Premium Sneakers</span>
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full border border-pink-500 flex items-center justify-center">
                      {persona.gender === "Man" && <div className="w-2 h-2 rounded-full bg-pink-500" />}
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Completed Step 1 Summary Header */
              <div
                onClick={() => setWizardStep(1)}
                className="bg-white/80 backdrop-blur-md border border-pink-100/40 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-pink-50/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Step 1: Model Profile</h3>
                    <p className="text-xs font-extrabold text-pink-600 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 stroke-[2]" />
                      <span className="uppercase tracking-wider">{persona.gender} Dressing Room</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-pink-600 font-extrabold hover:underline uppercase tracking-wider">Change</span>
              </div>
            )}

            {/* STEP 2: CHOOSE GARMENT CATEGORY */}
            {wizardStep < 2 ? (
              /* Locked Step 2 */
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200/50 text-gray-400 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Step 2: Choose Garment Category</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Select model profile to unlock category options.</p>
                </div>
              </div>
            ) : wizardStep === 2 ? (
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-pink-100/80 shadow-2xl space-y-6 transition-all duration-350 transform scale-100 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm shadow-pink-100">Step 2</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse"></span>
                    <h2 className="text-base font-bold text-gray-900 tracking-tight">Select a Garment Category</h2>
                  </div>
                  <p className="text-xs text-gray-400">Pick a category to browse presets or specify clothing style profiles.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(genderPresets).map((cat) => {
                    let iconComponent = <Shirt className="w-5 h-5 text-pink-600 stroke-[1.5]" />;
                    let desc = "Boutique collection";
                    if (cat === "Indian Ethnic Wear") {
                      iconComponent = <Sparkles className="w-5 h-5 text-pink-600 stroke-[1.5]" />;
                      desc = persona.gender === "Woman" ? "Sarees, Lehengas, Anarkalis" : "Sherwanis & Kurta Pyjamas";
                    } else if (cat === "Western Casual" || cat === "Upperwear") {
                      iconComponent = <Shirt className="w-5 h-5 text-pink-600 stroke-[1.5]" />;
                      desc = persona.gender === "Woman" ? "Tops & Denim Jackets" : "Polo T-shirts, Shirts & Jackets";
                    } else if (cat === "Formal & Outerwear") {
                      iconComponent = <Sliders className="w-5 h-5 text-pink-600 stroke-[1.5]" />;
                      desc = "Structured Blazers & Tuxedo Suits";
                    } else if (cat === "Bottomwear") {
                      iconComponent = <Sliders className="w-5 h-5 text-pink-600 stroke-[1.5]" />;
                      desc = "Chinos, Slim Jeans or Palazzos";
                    } else if (cat === "Sunglasses & Accessories") {
                      iconComponent = <Sliders className="w-5 h-5 text-pink-600 stroke-[1.5]" />;
                      desc = "Aviators, Sunglasses & Watches";
                    } else if (cat === "Footwear") {
                      iconComponent = <Sparkles className="w-5 h-5 text-pink-600 stroke-[1.5]" />;
                      desc = persona.gender === "Woman" ? "Embroidered Bridal Juttis" : "Sneakers & Mojaris";
                    }

                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setWizardStep(3);
                        }}
                        className={`group flex flex-col p-4 rounded-xl border transition-all hover:scale-[1.01] hover:shadow-md text-left ${
                          activeCategory === cat
                            ? "border-pink-500 bg-pink-50/10"
                            : "border-gray-100 bg-gray-50/30 hover:border-pink-200"
                        }`}
                      >
                        {/* Premium Mini Circle Badge */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          activeCategory === cat
                            ? "bg-pink-100/50 border border-pink-300 shadow-inner"
                            : "bg-gray-100 border border-gray-200 group-hover:bg-pink-50/30 group-hover:border-pink-300"
                        }`}>
                          {iconComponent}
                        </div>
                        <span className="text-xs font-bold text-gray-800 tracking-tight">{cat}</span>
                        <span className="text-[10px] text-gray-400 mt-1 leading-snug line-clamp-2">{desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Completed Step 2 Summary Header */
              <div
                onClick={() => setWizardStep(2)}
                className="bg-white/80 backdrop-blur-md border border-pink-100/40 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-pink-50/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Step 2: Category Selected</h3>
                    <p className="text-xs font-extrabold text-pink-600 flex items-center gap-1.5 mt-0.5">
                      <LayoutGrid className="w-3.5 h-3.5 stroke-[2]" />
                      <span className="tracking-wide">{activeCategory}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-pink-600 font-extrabold hover:underline uppercase tracking-wider">Change</span>
              </div>
            )}

            {/* STEP 3: CHOOSE YOUR GARMENT & UPLOAD PRODUCT PHOTO */}
            {wizardStep < 3 ? (
              /* Locked Step 3 */
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200/50 text-gray-400 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Step 3: Upload Product Photo & Style details</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Locks until category selection is completed.</p>
                </div>
              </div>
            ) : wizardStep === 3 ? (
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-pink-100/80 shadow-2xl space-y-6 transition-all duration-350 transform scale-100 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm shadow-pink-100">Step 3</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse"></span>
                    <h2 className="text-base font-bold text-gray-900 tracking-tight">Upload Product & Specify Details</h2>
                  </div>
                  <p className="text-xs text-gray-400">Upload your product photo. Optionally select a style reference to guide the AI prompt engineering.</p>
                </div>

                {/* 1. PRODUCT PHOTO UPLOADS (FRONT & BACK VIEWS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Product Front View <span className="text-pink-500 font-extrabold">(Required)</span>
                    </label>
                    <ImageUpload label="Garment Front Image" onFileSelect={handleGarmentSelect} previewUrl={garmentPreview} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Product Back View <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                    </label>
                    <ImageUpload label="Garment Back Image" onFileSelect={handleGarmentBackSelect} previewUrl={garmentBackPreview} />
                  </div>
                </div>

                {/* 2. OPTIONAL STYLE PRESETS CATALOG (To guide prompting) */}
                <div className="space-y-4 pt-5 border-t border-gray-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      Clothing Style Reference <span className="text-gray-400 font-medium normal-case">(Optional - guides AI prompting)</span>
                    </label>
                    <div className="flex items-start gap-2 bg-pink-50/30 p-3 rounded-xl border border-pink-100/30">
                      <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5 stroke-[2]" />
                      <span className="text-[10px] text-gray-500 leading-relaxed">
                        Select a style reference below that matches your product. This guides Gemini to extract high-fidelity details (e.g. fabric weave, embroidery, collars, sleeves) for photorealism.
                      </span>
                    </div>
                  </div>

                  {/* Subcategory Scrollbar */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-pink-200">
                    {genderPresets[activeCategory] &&
                      Object.keys(genderPresets[activeCategory]).map((sub) => {
                        const isSubActive = activeSubcategory === sub;
                        return (
                          <button
                            type="button"
                            key={sub}
                            onClick={() => {
                              setActiveSubcategory(sub);
                              setSelectedPreset(null);
                            }}
                            className={`py-1 px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all border tracking-wide ${
                              isSubActive
                                ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                                : "bg-white text-gray-500 border-gray-200 hover:border-pink-300 hover:text-pink-600"
                            }`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                  </div>

                  {/* Presets Grid */}
                  <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {genderPresets[activeCategory] &&
                      genderPresets[activeCategory][activeSubcategory] &&
                      genderPresets[activeCategory][activeSubcategory].map((item) => {
                        const isSelected = selectedPreset?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedPreset(item);
                            }}
                            className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all hover:scale-[1.01] hover:bg-pink-50/20 ${
                              isSelected
                                ? "border-pink-500 bg-pink-50/10 shadow-sm"
                                : "border-gray-100 bg-gray-50/30 hover:border-pink-300"
                            }`}
                          >
                            {/* Premium Mini Circle Badge according to the name */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected
                                ? "bg-pink-100/60 border border-pink-300 shadow-inner"
                                : "bg-gray-100 border border-gray-200"
                            }`}>
                              {getOptionIcon(item.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-extrabold text-gray-700 truncate leading-snug">{item.name}</span>
                              <span className="text-[9px] text-gray-400 font-medium truncate mt-0.5">Prompt Guide Profile</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Continue button */}
                <button
                  type="button"
                  onClick={() => setWizardStep(4)}
                  disabled={!garmentFile}
                  className={`
                    w-full py-3.5 rounded-2xl font-extrabold text-xs transition-all duration-350 flex items-center justify-center gap-2 uppercase tracking-widest shadow-md
                    ${garmentFile
                      ? "bg-pink-600 text-white hover:bg-pink-700 shadow-pink-100/50 hover:shadow-lg hover:shadow-pink-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <span>Continue to Fitting & Backdrop</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            ) : (
              /* Completed Step 3 Summary Header */
              <div
                onClick={() => setWizardStep(3)}
                className="bg-white/80 backdrop-blur-md border border-pink-100/40 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-pink-50/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Step 3: Product Photo & Style Reference</h3>
                    <div className="flex items-center gap-3 mt-1 min-w-0">
                      <div className="flex gap-1">
                        {garmentPreview && (
                          <div className="w-8 h-8 rounded-full border border-pink-200 overflow-hidden shrink-0 bg-white shadow-sm flex items-center justify-center">
                            <img src={garmentPreview} alt="front view" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {garmentBackPreview && (
                          <div className="w-8 h-8 rounded-full border border-pink-200 overflow-hidden shrink-0 bg-white shadow-sm flex items-center justify-center">
                            <img src={garmentBackPreview} alt="back view" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-extrabold text-pink-600 truncate">
                          {garmentBackPreview ? "Front & Back view uploaded" : "Product photo uploaded"}
                        </span>
                        {selectedPreset ? (
                          <span className="text-[9px] text-gray-400 font-bold truncate flex items-center gap-1.5 mt-0.5">
                            {getOptionIcon(selectedPreset.name)}
                            <span>Style guide: {selectedPreset.name}</span>
                          </span>
                        ) : (
                          <span className="text-[9px] text-gray-400 font-bold truncate mt-0.5">No style guide selected (using auto-prompt)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-pink-600 font-extrabold hover:underline uppercase tracking-wider shrink-0 ml-3">Change</span>
              </div>
            )}

            {/* STEP 4: CONFIGURE FITTING MIRROR & SCENE */}
            {wizardStep === 4 && (
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-pink-100/80 shadow-2xl space-y-6 transition-all duration-350 transform scale-100 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm shadow-pink-100">Step 4</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse"></span>
                    <h2 className="text-base font-bold text-gray-900 tracking-tight">Configure Fitting & Studio</h2>
                  </div>
                  <p className="text-xs text-gray-400">Fine-tune the model parameters, scene backdrop, and camera positions.</p>
                </div>

                {/* 1. Body-Fit Reference Photo (Optional) */}
                <div className="pt-4 border-t border-gray-100">
                  <PersonImageUpload onFileSelect={handlePersonSelect} previewUrl={personPreview} />
                </div>

                {/* 2. Model Persona settings (Gender is locked and hidden) */}
                <div className="pt-4 border-t border-gray-100">
                  <PersonaSelector persona={persona} onChange={setPersona} hideGender={true} />
                </div>

                {/* 3. Backdrop Studio Scene */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Backdrop Studio Scene
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "Minimalist Studio",
                      "Royal Palace",
                      "Festive Lights",
                      "Heritage Garden"
                    ].map((scene) => {
                      const isSelected = persona.backdrop === scene;
                      let iconComponent = <Camera className="w-4 h-4 stroke-[1.5]" />;
                      if (scene === "Royal Palace") iconComponent = <Sparkles className="w-4 h-4 stroke-[1.5]" />;
                      if (scene === "Festive Lights") iconComponent = <Sparkles className="w-4 h-4 stroke-[1.5]" />;
                      if (scene === "Heritage Garden") iconComponent = <Sparkles className="w-4 h-4 stroke-[1.5]" />;

                      return (
                        <button
                          type="button"
                          key={scene}
                          onClick={() => setPersona(prev => ({ ...prev, backdrop: scene }))}
                          className={`group py-2.5 px-1 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                              : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected 
                              ? "bg-pink-500/20 text-white" 
                              : "bg-gray-50 text-gray-500 group-hover:bg-pink-50 group-hover:text-pink-600"
                          }`}>
                            {iconComponent}
                          </div>
                          <span>{scene}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Multi-Angle Camera Views */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                    <span>Camera Views (Select Multiple)</span>
                    <span className="text-pink-600 font-extrabold">{persona.angles.length} selected</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "Front View",
                      "Three-Quarter",
                      "Side Profile",
                      "Back View",
                      "Wide Shot",
                      "Close-Up (Detail)",
                      "Low Angle (Hero)",
                      "Dynamic Walking"
                    ].map((angle) => {
                      const isSelected = persona.angles.includes(angle);
                      return (
                        <button
                          type="button"
                          key={angle}
                          onClick={() => {
                            setPersona(prev => {
                              const newAngles = isSelected
                                ? prev.angles.filter(a => a !== angle)
                                : [...prev.angles, angle];
                              return { ...prev, angles: newAngles.length ? newAngles : ["Front View"] };
                            });
                          }}
                          className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                              : "bg-white text-gray-500 border-gray-200 hover:border-pink-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[2.5] text-white shrink-0" />}
                          <span>{angle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sizing confirmation panel */}
                <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 text-left space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Target Fit Size Selection</span>
                    <span className="text-[9px] font-extrabold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200/50">Required Fit Size</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setPersona(prev => ({ ...prev, bodyType: sz }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          persona.bodyType === sz
                            ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                            : "bg-white text-gray-600 border-gray-205 hover:border-pink-400 hover:text-pink-600"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-gray-400 leading-normal">Confirm the model size above. The generative AI will drape the garment to match this body shape.</p>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className={`
                    w-full py-4 rounded-2xl font-extrabold text-xs transition-all duration-300 uppercase tracking-widest shadow-lg flex items-center justify-center gap-2
                    ${canGenerate
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 shadow-pink-100/50 hover:shadow-xl hover:shadow-pink-100 hover:scale-[1.01] active:scale-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <Sparkles className="w-4 h-4 stroke-[2] animate-pulse" />
                  <span>{loading ? stepLabel : `Generate Try-On (Size ${persona.bodyType})`}</span>
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-600 shadow-sm flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0 stroke-[2]" />
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {/* RIGHT: Results */}
          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="bg-white rounded-2xl border border-pink-100 p-8 shadow-sm space-y-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
                    <Sparkles className="w-8 h-8 text-pink-600 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-4">Creating Virtual Try-On</h3>
                  <p className="text-xs text-gray-400 mt-1">This takes ~20-30 seconds. Please do not close this window.</p>
                </div>

                {/* Progress Steps Checklist */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  {/* Step 1 */}
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step === 'scanning' || step === 'analyzing' || step === 'prompting' || step === 'generating' || step === 'polishing'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step === 'scanning' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step === 'scanning' ? 'text-pink-600' : 'text-gray-700'}`}>
                        1. Scanning garment files
                      </p>
                      {step === 'scanning' && <span className="text-[10px] text-pink-500 animate-pulse">Running image verification...</span>}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step === 'analyzing' || step === 'prompting' || step === 'generating' || step === 'polishing'
                        ? 'bg-emerald-100 text-emerald-600'
                        : step === 'scanning'
                        ? 'bg-gray-50 text-gray-400 border border-dashed border-gray-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step === 'analyzing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : (step === 'scanning' ? <div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> : <Check className="w-3 h-3" />)}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step === 'analyzing' ? 'text-pink-600' : 'text-gray-700'}`}>
                        2. Gemini Fabric & Fit Analysis
                      </p>
                      {step === 'analyzing' && <span className="text-[10px] text-pink-500 animate-pulse">Extracting neckline, sleeves, and texture...</span>}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step === 'prompting' || step === 'generating' || step === 'polishing'
                        ? 'bg-emerald-100 text-emerald-600'
                        : (step === 'scanning' || step === 'analyzing')
                        ? 'bg-gray-50 text-gray-400 border border-dashed border-gray-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step === 'prompting' ? <RefreshCw className="w-3 h-3 animate-spin" /> : (step === 'scanning' || step === 'analyzing' ? <div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> : <Check className="w-3 h-3" />)}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step === 'prompting' ? 'text-pink-600' : 'text-gray-700'}`}>
                        3. Prompt Engineering & Backdrop Selection
                      </p>
                      {step === 'prompting' && <span className="text-[10px] text-pink-500 animate-pulse">Formulating high-realism hyper-prompts...</span>}
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step === 'generating' || step === 'polishing'
                        ? 'bg-emerald-100 text-emerald-600'
                        : (step === 'scanning' || step === 'analyzing' || step === 'prompting')
                        ? 'bg-gray-50 text-gray-400 border border-dashed border-gray-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step === 'generating' ? <RefreshCw className="w-3 h-3 animate-spin" /> : (step === 'scanning' || step === 'analyzing' || step === 'prompting' ? <div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> : <Check className="w-3 h-3" />)}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step === 'generating' ? 'text-pink-600' : 'text-gray-700'}`}>
                        4. FLUX.1 neural Image Fitting
                      </p>
                      {step === 'generating' && <span className="text-[10px] text-pink-500 animate-pulse">Draping clothing onto photorealistic model...</span>}
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step === 'polishing'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-50 text-gray-400 border border-dashed border-gray-200'
                    }`}>
                      {step === 'polishing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${step === 'polishing' ? 'text-pink-600' : 'text-gray-700'}`}>
                        5. Finalizing Contrast & Highlights
                      </p>
                      {step === 'polishing' && <span className="text-[10px] text-pink-500 animate-pulse">Securing transparency layers...</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : result ? (
              <>
                <GarmentBadge analysis={result.garment_analysis} />
                <FittingModeBadge mode={result.fitting_mode} />
                <ResultPanel 
                  images={result.images} 
                  onDownload={handleDownload} 
                  onPublish={handlePublish} 
                  onSaveToWardrobe={handleSaveToWardrobe}
                  isSavingToWardrobe={savingWardrobe}
                  persona={persona}
                  removedBgFront={removedBgFront}
                  removedBgBack={removedBgBack}
                  bgRemovingFront={bgRemovingFront}
                  bgRemovingBack={bgRemovingBack}
                />
                <details className="group">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 font-bold" />
                    <span>View generated prompt</span>
                  </summary>
                  <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-xl p-3 leading-relaxed border border-gray-100">
                    {result.positive_prompt}
                  </p>
                </details>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 p-6">
                <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-sm">Your virtual try-on result will appear here</p>
                <p className="text-xs text-gray-400 mt-1">Upload your garment photo and configure the fitting mirror to generate.</p>
                <div className="mt-6 text-xs text-gray-400 space-y-2 border-t border-gray-100 pt-4 w-full max-w-xs">
                  <div className="flex items-center gap-2 justify-center">
                    <Sliders className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Optional person photo enables body-fit mode</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0 animate-pulse" />
                    <span>Powered by high-realism FLUX neural network</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}