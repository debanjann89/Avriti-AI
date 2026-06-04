import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ShoppingBag, Heart, ChevronLeft, ChevronDown, Star, MessageSquare, Sparkles, X, Download } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function ProductPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(false);

  // Reviews and Wardrobe state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [wardrobeImages, setWardrobeImages] = useState([]);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedTryOnUrl, setSelectedTryOnUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/reviews/product/${id}`);
      setReviews(res.data);
    } catch (e) {
      console.error("Error loading reviews", e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchWardrobe = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/wardrobe/gallery?user_id=${user.id}`);
      setWardrobeImages(res.data);
    } catch (e) {
      console.error("Error loading wardrobe for reviews", e);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p.id === id);
      setProduct(found);
    }
    window.scrollTo(0, 0);
  }, [id, products]);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchWardrobe();
    }
  }, [user]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (product?.seller_id) {
        setLoadingSeller(true);
        try {
          const res = await axios.get(`http://127.0.0.1:8000/api/users/profile-info?user_id=${product.seller_id}`);
          setSellerInfo(res.data);
        } catch (e) {
          console.error("Error loading seller profile info", e);
        } finally {
          setLoadingSeller(false);
        }
      } else {
        setSellerInfo(null);
      }
    };
    fetchSellerInfo();
  }, [product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a comment.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`http://127.0.0.1:8000/api/reviews/product/${id}`, {
        user_id: user.id,
        rating: rating,
        comment: comment,
        tryon_image_url: selectedTryOnUrl || null
      });
      alert("Review submitted successfully!");
      setComment("");
      setSelectedTryOnUrl("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review", err);
      alert(err.response?.data?.detail || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans select-none">
      <Link to="/home" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Store
      </Link>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Product Image */}
        <div className="mb-10 lg:mb-0">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 shadow-lg relative border border-pink-50">
            <img
              src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col text-left">
          <h2 className="text-lg font-medium text-gray-500 mb-2">{product.brand}</h2>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight uppercase font-jakarta">{product.name}</h1>
          <p className="text-3xl font-bold text-pink-600 mb-8">₹{Number(product.price).toLocaleString('en-IN')}</p>
          
          <div className="prose prose-sm text-gray-650 leading-relaxed mb-6">
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Artisan & Heritage Specifications Grid */}
          {(product.fabric || product.craft_technique || product.wash_care || product.country_of_origin) && (
            <div className="border-t border-b border-gray-150 py-6 mb-8 space-y-3.5">
              <h3 className="text-[10px] font-black text-pink-650 uppercase tracking-widest block">Heritage & Craft Specs</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {product.fabric && (
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Fabric Type</span>
                    <span className="text-xs font-bold text-slate-800 uppercase mt-0.5">{product.fabric}</span>
                  </div>
                )}
                {product.craft_technique && (
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Craft Technique</span>
                    <span className="text-xs font-bold text-slate-800 uppercase mt-0.5">{product.craft_technique}</span>
                  </div>
                )}
                {product.wash_care && (
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Wash Care Guide</span>
                    <span className="text-xs font-bold text-slate-800 uppercase mt-0.5">{product.wash_care}</span>
                  </div>
                )}
                {product.country_of_origin && (
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Country of Origin</span>
                    <span className="text-xs font-bold text-slate-800 uppercase mt-0.5">{product.country_of_origin}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-auto space-y-4">
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  addToCart(product.id);
                  alert(`${product.name} added to cart!`);
                }}
                className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center border-0 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
              </button>
              <button className="p-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-pink-600 transition-colors flex items-center justify-center cursor-pointer border-0">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Boutique Profile */}
      {sellerInfo && (
        <div className="mt-12 bg-gradient-to-r from-pink-50/40 via-white to-pink-50/10 border border-pink-100/70 p-6 sm:p-8 rounded-3xl text-left shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fadeIn">
          <div className="flex items-center gap-4.5 min-w-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-200/50 shadow-sm shrink-0 flex items-center justify-center bg-white">
              <img 
                src={sellerInfo.profile_picture || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"} 
                alt={sellerInfo.store_name || sellerInfo.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight font-jakarta">
                  {sellerInfo.store_name || `${sellerInfo.name}'s Boutique`}
                </h3>
                <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 font-extrabold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-pink-200/20">
                  <Sparkles className="w-2.5 h-2.5 fill-pink-100 text-pink-655" />
                  <span>Verified Boutique Partner</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-xl">
                {sellerInfo.store_description || "An artisan boutique dedicated to preserving handloom heritage, using certified natural fibers, and creating custom heritage collections."}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0 border-t border-gray-100 md:border-t-0 pt-4 md:pt-0">
            <div className="text-left sm:text-right">
              <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider font-sans">Boutique Contact</span>
              <strong className="block text-xs font-bold text-gray-800 mt-0.5 font-sans">{sellerInfo.email}</strong>
              {sellerInfo.phone && (
                <span className="block text-[10px] text-gray-400 font-medium mt-0.5 font-sans">{sellerInfo.phone}</span>
              )}
            </div>
            {product.external_url && (
              <a 
                href={product.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-widest px-5 py-3 rounded-xl shadow-md transition-all self-center text-center no-underline border-0 cursor-pointer"
              >
                View Original Reference
              </a>
            )}
          </div>
        </div>
      )}

      {/* ================= PRODUCT REVIEWS & COMMUNITY SHOWCASE ================= */}
      <section className="mt-20 pt-12 border-t border-gray-200 text-left">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight font-jakarta mb-8 flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-pink-600" />
          <span>Product Reviews & Try-On Showcase</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: SUBMIT REVIEW FORM */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-3">
              Write a Product Review
            </h3>
            
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Star rating selection */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-450 uppercase tracking-widest block">Rating Rating</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-yellow-400 hover:scale-110 transition-transform cursor-pointer border-0 bg-transparent p-0"
                      >
                        <Star 
                          className="w-6 h-6 stroke-[1.5]" 
                          fill={rating >= star ? "currentColor" : "none"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-450 uppercase tracking-widest block">Review Comment</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Tell us about the fabric quality, fitting precision, or overall colors..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Attach Virtual Wardrobe Try-On */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-450 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-600" />
                    <span>Attach Try-On Creation (Optional)</span>
                  </label>
                  
                  {wardrobeImages.length === 0 ? (
                    <p className="text-[9px] text-gray-400 italic">No try-on pictures saved in your virtual wardrobe yet. Try it on first to attach outfits here!</p>
                  ) : (
                    <>
                      <div className="relative">
                        <select
                          value={selectedTryOnUrl}
                          onChange={(e) => setSelectedTryOnUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="">No Try-On Picture</option>
                          {wardrobeImages.map((img) => (
                            <option key={img.id} value={img.image_url}>
                              Try-On saved {new Date(img.created_at).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      
                      {selectedTryOnUrl && (
                        <div className="mt-2.5 flex items-center gap-3 bg-pink-50/30 p-2 border border-pink-100 rounded-xl animate-fadeIn">
                          <div className="w-12 h-16 border border-pink-200 rounded-lg overflow-hidden shadow-xs bg-white shrink-0">
                            <img 
                              src={selectedTryOnUrl.startsWith('http') ? selectedTryOnUrl : `http://127.0.0.1:8000${selectedTryOnUrl}`} 
                              alt="Attached try-on outfit" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-pink-700 uppercase block">Selected Outfit</span>
                            <span className="text-[8px] text-gray-400 block">Attached to showcase</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setSelectedTryOnUrl("")}
                            className="ml-auto p-1 bg-white hover:bg-pink-100 rounded-full border border-pink-100 text-pink-600 transition-colors border-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-extrabold text-[10px] uppercase tracking-widest py-3 rounded-xl shadow-md transition-colors cursor-pointer border-0"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 bg-slate-50 border border-gray-150 rounded-xl space-y-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Authentication Required</p>
                <p className="text-xs text-gray-500 px-4 leading-normal">Log in to write a review and attach your virtual try-on images.</p>
                <Link 
                  to="/login"
                  className="inline-block bg-pink-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-5 py-2 rounded-full shadow-md"
                >
                  Login Now
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: REVIEWS LIST */}
          <div className="lg:col-span-2 space-y-6">
            {loadingReviews ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading product reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-250 rounded-2xl bg-gray-50/20">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-xs font-bold text-gray-700">No reviews yet</h3>
                <p className="text-[11px] text-gray-450 mt-1 max-w-xs mx-auto leading-normal">
                  Be the first to share your purchase details, sizing suggestions, or generate high-fidelity try-ons!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 border border-gray-150 rounded-2xl shadow-xs bg-white space-y-4 hover:border-pink-200 transition-colors duration-250">
                    {/* User header */}
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-pink-100 shadow-xs flex items-center justify-center bg-gray-50">
                          <img 
                            src={rev.user_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} 
                            alt={rev.user_name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">{rev.user_name}</h4>
                          <span className="text-[8px] text-gray-400 font-medium">{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 text-yellow-450">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="w-3.5 h-3.5" 
                            fill={rev.rating >= star ? "currentColor" : "none"} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-gray-650 leading-relaxed pl-0.5">{rev.comment}</p>

                    {/* Try-On Outfit Showcase image */}
                    {rev.tryon_image_url && (
                      <div className="mt-3 bg-pink-50/20 border border-pink-100 rounded-xl p-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div 
                          className="w-20 h-28 border border-pink-200 rounded-lg overflow-hidden shadow-xs shrink-0 cursor-pointer bg-white"
                          onClick={() => setZoomedImage(rev.tryon_image_url)}
                          title="Click to Zoom Try-On"
                        >
                          <img 
                            src={rev.tryon_image_url.startsWith('http') ? rev.tryon_image_url : `http://127.0.0.1:8000${rev.tryon_image_url}`} 
                            alt="Visual Try-On proof" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-extrabold text-[8px] uppercase tracking-wider">
                            <Sparkles className="w-2.5 h-2.5 fill-pink-100 text-pink-600" />
                            <span>Attached Try-On Result</span>
                          </span>
                          <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-tight">Community Fitting Model Proof</h5>
                          <p className="text-[9px] text-gray-450 leading-relaxed">
                            This review contains a generated model try-on of this boutique listing saved in the client wardrobe.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* LIGHTBOX ZOOM MODAL FOR REVIEW IMAGES */}
      {zoomedImage && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border border-gray-100 flex flex-col">
            <button 
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white text-gray-650 rounded-full flex items-center justify-center shadow"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="bg-gray-150 p-6 flex items-center justify-center overflow-hidden aspect-[3/4]">
              <img 
                src={zoomedImage.startsWith('http') ? zoomedImage : `http://127.0.0.1:8000${zoomedImage}`} 
                alt="Zoomed Tryon review" 
                className="max-w-full max-h-full object-contain rounded-xl shadow"
              />
            </div>
            <div className="p-5 flex justify-between items-center border-t border-gray-100">
              <div className="text-left">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Generative Try-On Frame</h4>
                <p className="text-[9px] text-gray-400">Community Showcase Attachment</p>
              </div>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = zoomedImage.startsWith('http') ? zoomedImage : `http://127.0.0.1:8000${zoomedImage}`;
                  link.download = `aavriti-showcase-${Date.now()}.png`;
                  link.click();
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white text-[9px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-md border-0 cursor-pointer"
              >
                Download Showcase Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
