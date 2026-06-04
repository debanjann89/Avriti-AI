import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Sliders, 
  ShoppingBag, Sparkles, Upload, LogOut, 
  Check, Edit2, ChevronRight, ShoppingCart, X,
  Trash2, Plus, Heart, BarChart2, PlusCircle, ArrowLeft, Download, Camera, ChevronDown
} from 'lucide-react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", 
  "Ladakh", "Puducherry"
];

export default function ProfilePage() {
  const { user, logout, updateProfile, updateProfilePicture, toggleUserRole, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isUpgradeSuccess, setIsUpgradeSuccess] = useState(false);

  // Seller Application States
  const [appStatus, setAppStatus] = useState("none"); // "none", "pending", "approved", "rejected"
  const [appData, setAppData] = useState(null);
  const [loadingApp, setLoadingApp] = useState(false);
  const [storeForm, setStoreForm] = useState({
    store_name: '',
    store_description: '',
    business_email: user?.email || '',
    business_phone: user?.phone || '',
    product_category: ''
  });
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };
  
  // 1. Sync URL query params with active tab state
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(queryTab);

  // Sync tab state when URL search params change
  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
    setIsEditing(false);
  };

  // Edit details states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    shipping_address: user?.shipping_address || '',
    height: user?.height || '',
    weight: user?.weight || '',
    body_type: user?.body_type || '',
    shoulder_width: user?.shoulder_width || '',
    waist_size: user?.waist_size || ''
  });
  const [addressDetails, setAddressDetails] = useState({
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });

  // Sync addressDetails with user.shipping_address
  useEffect(() => {
    if (user?.shipping_address) {
      try {
        if (user.shipping_address.startsWith('{')) {
          const parsed = JSON.parse(user.shipping_address);
          setAddressDetails({
            street: parsed.street || '',
            landmark: parsed.landmark || '',
            city: parsed.city || '',
            state: parsed.state || '',
            pincode: parsed.pincode || '',
            type: parsed.type || 'Home'
          });
          return;
        }
      } catch (e) {
        console.error("Error parsing shipping address JSON", e);
      }
      setAddressDetails({
        street: user.shipping_address || '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        type: 'Home'
      });
    } else {
      setAddressDetails({
        street: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        type: 'Home'
      });
    }
  }, [user]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Virtual Wardrobe States
  const [wardrobeImages, setWardrobeImages] = useState([]);
  const [loadingWardrobe, setLoadingWardrobe] = useState(false);
  const [selectedWardrobeImage, setSelectedWardrobeImage] = useState(null);

  // Seller Dashboard States
  const [sellerStats, setSellerStats] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [sellerSubTab, setSellerSubTab] = useState('products'); // 'products' or 'orders'
  
  // Product Modals and Forms
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'Sarees',
    description: '',
    tryOnCompatible: true,
    image_b64: '',
    image_url: ''
  });
  const [productImagePreview, setProductImagePreview] = useState(null);

  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Sync formData with user when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        shipping_address: user.shipping_address || '',
        height: user.height || '',
        weight: user.weight || '',
        body_type: user.body_type || '',
        shoulder_width: user.shoulder_width || '',
        waist_size: user.waist_size || ''
      });
    }
  }, [user]);

  // Fetch Order History
  useEffect(() => {
    if (user?.id) {
      setLoadingOrders(true);
      axios.get(`http://127.0.0.1:8000/api/orders/${user.id}`)
        .then(res => {
          setOrders(res.data);
          setLoadingOrders(false);
        })
        .catch(err => {
          console.error("Error loading order history", err);
          setLoadingOrders(false);
        });
    }
  }, [user]);

  const formatAddress = (addressStr) => {
    if (!addressStr) return 'No address provided';
    try {
      if (addressStr.startsWith('{')) {
        const addr = JSON.parse(addressStr);
        const parts = [
          addr.street,
          addr.landmark ? `Landmark: ${addr.landmark}` : null,
          addr.city,
          addr.state,
          addr.pincode ? `PIN: ${addr.pincode}` : null,
          addr.type ? `(${addr.type})` : null
        ].filter(Boolean);
        return parts.join(', ');
      }
    } catch (e) {}
    return addressStr;
  };

  if (!user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const addressJsonStr = JSON.stringify(addressDetails);
      await updateProfile({
        ...formData,
        shipping_address: addressJsonStr
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile", err);
      alert("Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await updateProfilePicture(file);
      } catch (err) {
        console.error("Error uploading avatar", err);
        alert("Failed to upload profile picture");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpgradeToSeller = async () => {
    setIsUpgrading(true);
    try {
      await toggleUserRole('seller');
      setIsUpgradeSuccess(true);
    } catch (err) {
      console.error("Error upgrading role", err);
      alert("Failed to upgrade to seller account.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const fetchApplicationStatus = async () => {
    if (!user?.id) return;
    setLoadingApp(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/users/seller-application/status?user_id=${user.id}`);
      setAppStatus(res.data.status);
      if (res.data.status !== "none") {
        setAppData(res.data);
      }
      if (res.data.status === "approved" && user.role !== "seller") {
        await refreshUser();
      }
    } catch (err) {
      console.error("Error fetching seller application status", err);
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'become-seller') {
      fetchApplicationStatus();
    }
  }, [activeTab, user?.id]);

  const handleStoreFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingApp(true);
    try {
      const payload = {
        user_id: user.id,
        store_name: storeForm.store_name,
        store_description: storeForm.store_description,
        business_email: storeForm.business_email,
        business_phone: storeForm.business_phone,
        product_category: storeForm.product_category
      };
      await axios.post('http://127.0.0.1:8000/api/users/seller-application', payload);
      showToast("Application submitted successfully! Your account will be reviewed by administrators.", "success");
      fetchApplicationStatus();
    } catch (err) {
      console.error("Error submitting seller application", err);
      showToast(err.response?.data?.detail || "Failed to submit application", "error");
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Fetch Virtual Wardrobe images
  const fetchWardrobe = async () => {
    if (!user?.id) return;
    setLoadingWardrobe(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/wardrobe/gallery?user_id=${user.id}`);
      setWardrobeImages(res.data);
    } catch (err) {
      console.error("Error fetching wardrobe gallery", err);
    } finally {
      setLoadingWardrobe(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'wardrobe') {
      fetchWardrobe();
    }
  }, [activeTab, user?.id]);

  const handleDeleteWardrobeImage = async (image_id) => {
    if (!window.confirm("Are you sure you want to delete this try-on result from your wardrobe?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/wardrobe/${image_id}`);
      showToast("Try-on deleted from your wardrobe.", "success");
      fetchWardrobe();
      if (selectedWardrobeImage && selectedWardrobeImage.id === image_id) {
        setSelectedWardrobeImage(null);
      }
    } catch (err) {
      console.error("Error deleting wardrobe image", err);
      showToast("Failed to delete wardrobe image.", "error");
    }
  };

  // Fetch Seller Dashboard stats, products, and orders
  const fetchSellerData = async () => {
    if (!user?.id) return;
    setLoadingSeller(true);
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/seller/stats?user_id=${user.id}`),
        axios.get(`http://127.0.0.1:8000/api/seller/products?user_id=${user.id}`),
        axios.get(`http://127.0.0.1:8000/api/seller/orders?user_id=${user.id}`)
      ]);
      setSellerStats(statsRes.data);
      setSellerProducts(productsRes.data);
      setSellerOrders(ordersRes.data);
    } catch (err) {
      console.error("Error fetching seller dashboard data", err);
    } finally {
      setLoadingSeller(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'seller-dashboard' && (user.role === 'seller' || user.role === 'admin')) {
      fetchSellerData();
    }
  }, [activeTab, user?.id, user?.role]);

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    const priceVal = parseFloat(productForm.price);
    if (isNaN(priceVal) || priceVal <= 0) {
      alert("Please enter a valid positive price.");
      return;
    }
    const payload = {
      user_id: user.id,
      name: productForm.name,
      brand: productForm.brand || "Boutique Brand",
      price: priceVal,
      category: productForm.category,
      description: productForm.description,
      tryOnCompatible: productForm.tryOnCompatible,
      image_b64: productForm.image_b64 || null,
      image_url: productForm.image_url || null
    };
    try {
      if (editingProduct) {
        await axios.put(`http://127.0.0.1:8000/api/seller/product/${editingProduct}`, payload);
        showToast("Product updated successfully!", "success");
      } else {
        await axios.post(`http://127.0.0.1:8000/api/seller/product`, payload);
        showToast("Product created and listed successfully!", "success");
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', brand: '', price: '', category: 'Sarees', description: '', tryOnCompatible: true, image_b64: '', image_url: '' });
      setProductImagePreview(null);
      fetchSellerData();
    } catch (err) {
      console.error("Error saving product catalog listing", err);
      showToast(err.response?.data?.detail || "Failed to save product", "error");
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod.id);
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      price: prod.price.toString(),
      category: prod.category,
      description: prod.description,
      tryOnCompatible: prod.tryOnCompatible,
      image_b64: '',
      image_url: prod.image
    });
    setProductImagePreview(prod.image);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (product_id) => {
    if (!window.confirm("Are you sure you want to delete this product listing from the catalog?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/seller/product/${product_id}?user_id=${user.id}`);
      showToast("Product deleted successfully.", "success");
      fetchSellerData();
    } catch (err) {
      console.error("Error deleting product", err);
      showToast("Failed to delete product.", "error");
    }
  };

  const handleUpdateOrderStatus = async (order_id, status) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/seller/order/${order_id}/status`, {
        user_id: user.id,
        status: status
      });
      showToast("Order shipping status updated.", "success");
      fetchSellerData();
    } catch (err) {
      console.error("Error updating order shipping status", err);
      showToast("Failed to update status.", "error");
    }
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result);
        setProductForm(prev => ({
          ...prev,
          image_b64: reader.result,
          image_url: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F8] font-sans">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-pink-150 border-t-pink-600 rounded-full animate-spin"></div>
          <span className="text-xs font-black text-pink-600 uppercase tracking-widest animate-pulse">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start animate-fadeIn">
        
        {/* ================= LEFT SIDEBAR (Flipkart Style) ================= */}
        <div className="col-span-1 space-y-4">
          
          {/* 1. Greeting Card */}
          <div className="bg-white rounded-lg border border-gray-200/80 p-4 shadow-sm flex items-center gap-4">
            {/* Avatar image on the left */}
            <div className="relative group cursor-pointer w-12 h-12 rounded-full overflow-hidden border border-pink-200 shadow-sm shrink-0">
              <img 
                src={user.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-white" />
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            {/* Hello text on the right */}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Hello,</p>
              <h2 className="text-sm font-black text-gray-800 truncate mt-1 leading-none">{user.name}</h2>
              <span className="inline-block mt-1 text-[8px] font-extrabold uppercase tracking-widest bg-pink-100 text-pink-700 px-2 py-0.2 rounded-full border border-pink-200/40">
                {user.role}
              </span>
            </div>
          </div>

          {/* 2. Menu Navigation Settings */}
          <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden divide-y divide-gray-100">
            
            {/* Tab: Orders */}
            <button
              onClick={() => handleTabChange('orders')}
              className={`w-full py-4 px-4 text-xs font-bold uppercase tracking-wider text-left transition-all flex items-center justify-between group ${
                activeTab === 'orders'
                  ? 'bg-pink-50/20 text-pink-600 border-l-4 border-pink-600 pl-3'
                  : 'text-gray-600 hover:bg-slate-50/50 hover:text-pink-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className={`w-4.5 h-4.5 ${activeTab === 'orders' ? 'text-pink-600' : 'text-gray-400'}`} />
                <span>My Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Tab: Virtual Wardrobe */}
            <button
              onClick={() => handleTabChange('wardrobe')}
              className={`w-full py-4 px-4 text-xs font-bold uppercase tracking-wider text-left transition-all flex items-center justify-between group ${
                activeTab === 'wardrobe'
                  ? 'bg-pink-50/20 text-pink-600 border-l-4 border-pink-600 pl-3'
                  : 'text-gray-600 hover:bg-slate-50/50 hover:text-pink-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className={`w-4.5 h-4.5 ${activeTab === 'wardrobe' ? 'text-pink-600' : 'text-gray-450'}`} />
                <span>Virtual Wardrobe</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Tab: Seller Dashboard */}
            {(user.role === 'seller' || user.role === 'admin') && (
              <button
                onClick={() => handleTabChange('seller-dashboard')}
                className={`w-full py-4 px-4 text-xs font-bold uppercase tracking-wider text-left transition-all flex items-center justify-between group ${
                  activeTab === 'seller-dashboard'
                    ? 'bg-pink-50/20 text-pink-600 border-l-4 border-pink-600 pl-3'
                    : 'text-gray-600 hover:bg-slate-50/50 hover:text-pink-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className={`w-4.5 h-4.5 ${activeTab === 'seller-dashboard' ? 'text-pink-600' : 'text-gray-450'}`} />
                  <span>Seller Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            )}
            
            {/* Heading: Settings */}
            <div className="p-4 bg-slate-50/20">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Settings</p>
              <div className="mt-3 space-y-2.5 pl-1.5">
                
                {/* Tab: Profile Info */}
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`w-full text-left text-xs font-bold tracking-wide transition-colors flex items-center gap-2 ${
                    activeTab === 'profile'
                      ? 'text-pink-600 font-black'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Profile Information</span>
                </button>
                
                {/* Tab: Addresses */}
                <button
                  onClick={() => handleTabChange('addresses')}
                  className={`w-full text-left text-xs font-bold tracking-wide transition-colors flex items-center gap-2 ${
                    activeTab === 'addresses'
                      ? 'text-pink-600 font-black'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Manage Addresses</span>
                </button>

                {/* Tab: Become a Seller */}
                {(user?.role === 'buyer' || activeTab === 'become-seller') && (
                  <button
                    onClick={() => handleTabChange('become-seller')}
                    className={`w-full text-left text-xs font-bold tracking-wide transition-colors flex items-center gap-2 ${
                      activeTab === 'become-seller'
                        ? 'text-pink-600 font-black'
                        : 'text-gray-600 hover:text-pink-600'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-pink-600" />
                    <span>Become a Seller</span>
                  </button>
                )}
                
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full py-4 px-4 text-xs font-bold uppercase tracking-wider text-left text-rose-500 hover:bg-rose-50/30 transition-all flex items-center gap-3"
            >
              <LogOut className="w-4.5 h-4.5 text-rose-500" />
              <span>Logout Account</span>
            </button>

          </div>
          
        </div>

        {/* ================= RIGHT DETAIL PANEL ================= */}
        <div className="col-span-1 md:col-span-3">
          
          {/* TAB CONTENT: PROFILE INFORMATION & SIZING */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Personal Information card */}
              <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-pink-600" />
                    <span>Personal Information</span>
                  </h3>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Settings</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
                      <input 
                        type="email" 
                        disabled={true}
                        value={user.email}
                        className="w-full bg-gray-100 text-gray-400 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-6 py-2 rounded-xl shadow-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isSaving ? "Saving..." : "Save Info"}
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Sizing Profile card */}
              <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-pink-600" />
                    <span>Dressing Room Sizing Profile</span>
                  </h3>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Height (cm)</label>
                        <input 
                          type="text" 
                          name="height"
                          disabled={!isEditing}
                          placeholder="e.g. 175"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Weight (kg)</label>
                        <input 
                          type="text" 
                          name="weight"
                          disabled={!isEditing}
                          placeholder="e.g. 68"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Body Shape / Silhouette</label>
                      <div className="relative">
                        <select
                          name="body_type"
                          disabled={!isEditing}
                          value={formData.body_type}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs font-medium focus:outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="">Select Size / Fit</option>
                          <option value="XS">Extra Small (XS)</option>
                          <option value="S">Small (S)</option>
                          <option value="M">Medium (M)</option>
                          <option value="L">Large (L)</option>
                          <option value="XL">Extra Large (XL)</option>
                          <option value="XXL">Double Extra Large (XXL)</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Shoulder Width (in)</label>
                        <input 
                          type="text" 
                          name="shoulder_width"
                          disabled={!isEditing}
                          placeholder="e.g. 18"
                          value={formData.shoulder_width}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Waist Size (in)</label>
                        <input 
                          type="text" 
                          name="waist_size"
                          disabled={!isEditing}
                          placeholder="e.g. 32"
                          value={formData.waist_size}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-6 py-2 rounded-xl shadow-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isSaving ? "Saving..." : "Save Sizing"}
                      </button>
                    </div>
                  )}
                </form>
              </div>

            </div>
          )}

          {/* TAB CONTENT: MANAGE ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 font-jakarta">
                  <MapPin className="w-4.5 h-4.5 text-pink-600" />
                  <span>Manage Shipping Addresses</span>
                </h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Info</span>
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 space-y-4 text-xs font-medium relative overflow-hidden text-left animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="bg-pink-100 text-pink-700 border border-pink-200 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-2xs">
                      {addressDetails.type || "Home"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Primary Delivery Destination</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-450 block uppercase tracking-wider font-bold">Contact Mobile</span>
                      <span className="text-slate-800 text-xs font-bold block">{formData.phone || "No contact number added"}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-450 block uppercase tracking-wider font-bold">Pincode / ZIP</span>
                      <span className="text-slate-800 text-xs font-bold block">{addressDetails.pincode || "Not specified"}</span>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <span className="text-[9px] text-gray-450 block uppercase tracking-wider font-bold">Street Address</span>
                      <span className="text-slate-800 text-xs font-semibold block leading-relaxed">{addressDetails.street || "No address added yet."}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-450 block uppercase tracking-wider font-bold">Landmark</span>
                      <span className="text-slate-800 text-xs font-medium block">{addressDetails.landmark || "None"}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-450 block uppercase tracking-wider font-bold">City & State</span>
                      <span className="text-slate-800 text-xs font-bold block">
                        {addressDetails.city || "Not specified"}{addressDetails.state ? `, ${addressDetails.state}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4 text-left animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Address Label / Type</label>
                      <div className="flex gap-2">
                        {['Home', 'Office', 'Other'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAddressDetails(prev => ({ ...prev, type: t }))}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              addressDetails.type === t
                                ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                                : "bg-gray-50/50 text-gray-650 border-gray-200 hover:border-pink-300"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Contact Mobile Number</label>
                      <input 
                        type="text" 
                        name="phone"
                        placeholder="e.g. +91 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Street Address / House No. / Apartment</label>
                    <textarea 
                      required
                      placeholder="Enter flat/house no., building, street address"
                      value={addressDetails.street}
                      onChange={(e) => setAddressDetails(prev => ({ ...prev, street: e.target.value }))}
                      rows="2"
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all resize-none animate-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Landmark (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Near Metro Station"
                        value={addressDetails.landmark}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, landmark: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Pincode / ZIP Code</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. 560001"
                        value={addressDetails.pincode}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, pincode: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">City</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Bengaluru"
                        value={addressDetails.city}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">State</label>
                      <div className="relative">
                        <select
                          required
                          value={addressDetails.state}
                          onChange={(e) => setAddressDetails(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-6 py-2 rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.01]"
                    >
                      {isSaving ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT: VIRTUAL WARDROBE */}
          {activeTab === 'wardrobe' && (
            <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4">
                <Heart className="w-4.5 h-4.5 text-pink-600 fill-pink-600/10" />
                <span>Virtual Wardrobe & Try-On Gallery</span>
              </h2>

              {loadingWardrobe ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-2">
                  <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading wardrobe history...</span>
                </div>
              ) : wardrobeImages.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/20">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xs font-bold text-gray-700">Virtual Wardrobe Empty</h3>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto leading-normal">
                    You haven't saved any try-on generated results yet. Try on clothes in the Studio or consult our AI Stylist to generate custom outfits and save them here!
                  </p>
                  <div className="mt-5">
                    <a href="/tryon" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[9px] uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md transition-all">
                      Go to Try-On Studio
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {wardrobeImages.map((img) => (
                    <div key={img.id} className="relative group border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-pink-300 transition-all duration-300 bg-gray-50 aspect-[3/4]">
                      <img 
                        src={img.image_url.startsWith('http') ? img.image_url : `http://127.0.0.1:8000${img.image_url}`} 
                        alt="Try-on Outfit" 
                        className="w-full h-full object-cover cursor-pointer animate-fadeIn"
                        onClick={() => setSelectedWardrobeImage(img)}
                      />
                      <button
                        onClick={() => handleDeleteWardrobeImage(img.id)}
                        className="absolute bottom-3 right-3 w-8 h-8 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Delete Outfit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-xs text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                        {new Date(img.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ZOOM MODAL FOR WARDROBE IMAGE */}
          {selectedWardrobeImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full border border-gray-100 flex flex-col md:flex-row h-[85vh] md:h-[650px]">
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedWardrobeImage(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow hover:scale-105 transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                {/* Left side: Image */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 h-1/2 md:h-full overflow-hidden">
                  <img 
                    src={selectedWardrobeImage.image_url.startsWith('http') ? selectedWardrobeImage.image_url : `http://127.0.0.1:8000${selectedWardrobeImage.image_url}`} 
                    alt="Zoomed Try-on result" 
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                </div>

                {/* Right side: Meta / Actions */}
                <div className="w-full md:w-[320px] p-6 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-gray-100 h-1/2 md:h-full">
                  <div className="space-y-6">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-extrabold text-[9px] uppercase tracking-wider mb-2">
                        <Sparkles className="w-3 h-3 text-pink-600 fill-pink-600/10" />
                        <span>AI Generative Fit</span>
                      </span>
                      <h3 className="text-base font-black text-gray-800 uppercase tracking-tight font-jakarta">Wardrobe Creation</h3>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">Saved on {selectedWardrobeImage.created_at}</p>
                    </div>

                    <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 text-xs text-gray-600 leading-normal text-left">
                      This clothing outfit was custom generated using the Aavriti Neural Solver. It has been saved to your personal virtual wardrobe gallery.
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = selectedWardrobeImage.image_url.startsWith('http') ? selectedWardrobeImage.image_url : `http://127.0.0.1:8000${selectedWardrobeImage.image_url}`;
                        link.download = `aavriti-wardrobe-${selectedWardrobeImage.id}.png`;
                        link.click();
                      }}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[10px] uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download HD Image</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleDeleteWardrobeImage(selectedWardrobeImage.id);
                      }}
                      className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-600 font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from Wardrobe</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SELLER DASHBOARD */}
          {activeTab === 'seller-dashboard' && (user.role === 'seller' || user.role === 'admin') && (
            <div className="space-y-6">
              {/* Stat metrics */}
              {loadingSeller && !sellerStats ? (
                <div className="bg-white rounded-lg border border-gray-200/80 p-12 text-center shadow-sm">
                  <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading Seller Dashboard Analytics...</p>
                </div>
              ) : (
                <>
                  {/* Dashboard header & quick stats */}
                  <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm space-y-6 text-left">
                    <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-150 pb-4">
                      <div>
                        <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-pink-600" />
                          <span>Seller Business Dashboard</span>
                        </h2>
                        <p className="text-xs text-gray-400 font-medium mt-1">Real-time metrics, product management, and boutique shipment tracking.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({ name: '', brand: '', price: '', category: 'Sarees', description: '', tryOnCompatible: true, image_b64: '', image_url: '' });
                          setProductImagePreview(null);
                          setIsProductModalOpen(true);
                        }}
                        className="bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border-0"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add New Listing</span>
                      </button>
                    </div>

                    {/* Quick Stats Grid */}
                    {sellerStats && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-200/40 shadow-xs text-left">
                          <span className="block text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Total Revenue</span>
                          <strong className="text-xl font-black text-emerald-700 tracking-tight block mt-1">₹{sellerStats.revenue.toLocaleString('en-IN')}</strong>
                          <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">Mock Sales Ledger</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/5 to-pink-500/10 border border-pink-200/40 shadow-xs text-left">
                          <span className="block text-[9px] font-bold text-pink-800 uppercase tracking-wider">Items Sold</span>
                          <strong className="text-xl font-black text-pink-700 tracking-tight block mt-1">{sellerStats.items_sold} units</strong>
                          <span className="text-[8px] text-pink-600 font-bold block mt-0.5">Boutique Checkouts</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-200/40 shadow-xs text-left">
                          <span className="block text-[9px] font-bold text-blue-800 uppercase tracking-wider">Orders Received</span>
                          <strong className="text-xl font-black text-blue-700 tracking-tight block mt-1">{sellerStats.orders_count} orders</strong>
                          <span className="text-[8px] text-blue-600 font-bold block mt-0.5">Total Transactions</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/5 to-violet-500/10 border border-violet-200/40 shadow-xs text-left">
                          <span className="block text-[9px] font-bold text-violet-800 uppercase tracking-wider">Active Listings</span>
                          <strong className="text-xl font-black text-violet-700 tracking-tight block mt-1">{sellerStats.active_listings} items</strong>
                          <span className="text-[8px] text-violet-600 font-bold block mt-0.5">Catalog Grid</span>
                        </div>
                      </div>
                    )}

                    {/* Sales Trend Visual Mock Chart */}
                    {sellerStats?.sales_trend && (
                      <div className="mt-4 border border-gray-150 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue Sales Trend (6 Months)</h4>
                          <span className="text-[9px] text-pink-600 font-extrabold uppercase">Analytics Trend Matrix</span>
                        </div>
                        
                        <div className="h-40 w-full flex items-end justify-between gap-2 pt-6 px-4">
                          {sellerStats.sales_trend.map((point, index) => {
                            const maxVal = Math.max(...sellerStats.sales_trend.map(p => p.sales), 100);
                            const percentHeight = Math.min((point.sales / maxVal) * 85 + 15, 100);
                            
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                <div className="text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  ₹{point.sales}
                                </div>
                                <div 
                                  className="w-full max-w-[40px] bg-gradient-to-t from-pink-500/40 to-pink-600 rounded-t-lg transition-all duration-500 shadow-xs group-hover:scale-y-[1.03]"
                                  style={{ height: `${percentHeight}%` }}
                                />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{point.month}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SUBTAB BAR */}
                  <div className="flex border-b border-gray-200 bg-white px-2 rounded-t-xl">
                    <button
                      onClick={() => setSellerSubTab('products')}
                      className={`px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer border-x-0 border-t-0 ${
                        sellerSubTab === 'products'
                          ? 'border-pink-600 text-pink-600 font-black bg-pink-50/5'
                          : 'border-transparent text-gray-500 hover:text-pink-600'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Product Listings ({sellerProducts.length})</span>
                    </button>
                    <button
                      onClick={() => setSellerSubTab('orders')}
                      className={`px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer border-x-0 border-t-0 ${
                        sellerSubTab === 'orders'
                          ? 'border-pink-600 text-pink-600 font-black bg-pink-50/5'
                          : 'border-transparent text-gray-500 hover:text-pink-600'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Boutique Orders ({sellerOrders.length})</span>
                    </button>
                  </div>

                  {/* PRODUCTS CATALOG LIST */}
                  {sellerSubTab === 'products' && (
                    <div className="bg-white rounded-b-xl border border-t-0 border-gray-200/80 p-6 shadow-sm space-y-6">
                      {sellerProducts.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/20">
                          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-xs font-bold text-gray-700">No products listed</h3>
                          <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                            Get started by creating your first boutique clothing item to display in the Aavriti storefront.
                          </p>
                          <div className="mt-5">
                            <button
                              onClick={() => {
                                setEditingProduct(null);
                                setProductForm({ name: '', brand: '', price: '', category: 'Sarees', description: '', tryOnCompatible: true, image_b64: '', image_url: '' });
                                setProductImagePreview(null);
                                setIsProductModalOpen(true);
                              }}
                              className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[9px] uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md transition-colors border-0"
                            >
                              Add Product
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {sellerProducts.map((prod) => (
                            <div key={prod.id} className="border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 bg-white flex flex-col justify-between text-left">
                              <div className="relative aspect-[3/4] w-full bg-slate-50 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={prod.image.startsWith('http') ? prod.image : `http://127.0.0.1:8000${prod.image}`} 
                                  alt={prod.name} 
                                  className="w-full h-full object-cover" 
                                />
                                {prod.tryOnCompatible && (
                                  <span className="absolute top-3 left-3 bg-pink-100/90 backdrop-blur-xs text-pink-700 border border-pink-200 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    ★ Try-On Ready
                                  </span>
                                )}
                              </div>
                              
                              <div className="p-4 space-y-3">
                                <div>
                                  <span className="block text-[8px] font-extrabold text-gray-400 uppercase tracking-wider">{prod.category}</span>
                                  <h4 className="text-xs font-black text-gray-800 leading-tight uppercase truncate mt-0.5">{prod.name}</h4>
                                  <p className="text-[9px] text-gray-400 font-bold mt-0.5">{prod.brand}</p>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                  <span className="text-xs font-black text-pink-600">₹{prod.price.toLocaleString('en-IN')}</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleEditProductClick(prod)}
                                      className="p-2 border border-gray-250 hover:border-pink-300 text-gray-650 hover:text-pink-600 rounded-lg transition-colors cursor-pointer bg-white"
                                      title="Edit Product"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(prod.id)}
                                      className="p-2 border border-rose-100 hover:bg-rose-50 hover:border-rose-300 text-rose-500 rounded-lg transition-colors cursor-pointer bg-white"
                                      title="Delete Listing"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* BOUTIQUE ORDERS LIST */}
                  {sellerSubTab === 'orders' && (
                    <div className="bg-white rounded-b-xl border border-t-0 border-gray-200/80 p-6 shadow-sm space-y-6">
                      {sellerOrders.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/20">
                          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-xs font-bold text-gray-700">No boutique orders</h3>
                          <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                            Orders containing your boutique listings will show up here along with shipping controls.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {sellerOrders.map((order) => (
                            <div key={order.id} className="border border-gray-200/80 rounded-xl bg-slate-50/20 overflow-hidden shadow-xs hover:border-pink-200/40 transition-all duration-200 text-left">
                              {/* Order Header */}
                              <div className="bg-white/95 p-4 border-b border-gray-150 flex flex-wrap justify-between items-center gap-3">
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Order ID</p>
                                  <p className="text-xs font-black text-slate-800">#AVR-00{order.id}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Order Date</p>
                                  <p className="text-xs font-medium text-slate-650">{order.order_date}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Customer</p>
                                  <p className="text-xs font-bold text-slate-755">{order.user_name}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-450 font-bold uppercase tracking-widest block">Shipment Status</p>
                                  <div className="relative inline-block mt-0.5">
                                    <select
                                      value={order.status}
                                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                      className="bg-pink-50 border border-pink-100 rounded-lg pl-2 pr-7 py-1 text-[10px] font-extrabold uppercase tracking-wider text-pink-700 focus:outline-none cursor-pointer appearance-none"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="processing">Processing</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-pink-650 pointer-events-none" />
                                  </div>
                                </div>
                              </div>

                              {/* Items belonging to this Seller */}
                              <div className="p-4 bg-white divide-y divide-gray-100">
                                <p className="text-[9px] font-black text-pink-600 uppercase tracking-widest mb-3">Your Boutique Items In This Order</p>
                                {order.seller_items.map((item, idx) => (
                                  <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm shrink-0 flex items-center justify-center bg-gray-50">
                                        <img src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-extrabold text-gray-850 leading-tight truncate uppercase max-w-[200px]">{item.name}</h5>
                                        <span className="text-[9px] text-gray-400 font-bold block">{item.brand}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                      <div className="text-center">
                                        <span className="block text-[8px] text-gray-450 uppercase">Qty</span>
                                        <strong className="text-xs font-extrabold text-slate-800">{item.quantity}</strong>
                                      </div>
                                      <div className="text-right min-w-[70px]">
                                        <span className="block text-[8px] text-gray-450 uppercase">Price</span>
                                        <strong className="text-xs font-extrabold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Shipping address details */}
                              <div className="bg-slate-50/70 p-3 border-t border-gray-100 flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-gray-450 shrink-0 mt-0.5" />
                                <div className="text-[9px] leading-relaxed text-gray-500">
                                  <strong className="text-gray-700 uppercase tracking-wide">Shipping Address:</strong> {formatAddress(order.shipping_address)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ADD / EDIT PRODUCT MODAL */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border border-gray-100 relative flex flex-col max-h-[90vh] text-left">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-150 flex items-center justify-between">
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight font-jakarta">
                    {editingProduct ? "Edit Boutique Product" : "List New Product"}
                  </h3>
                  <button 
                    onClick={() => {
                      setIsProductModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-gray-500 rounded-full flex items-center justify-center transition-colors cursor-pointer border-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleProductFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Product Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Kanjeevaram Silk Saree"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Brand / Boutique</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Royal Silks"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Price (₹)</label>
                      <input
                        required
                        type="number"
                        placeholder="e.g. 4500"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Category</label>
                      <div className="relative">
                        <select
                          required
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3.5 py-2.5 pr-10 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="Sarees">Traditional Sarees</option>
                          <option value="Lehengas">Lehengas</option>
                          <option value="Kurtas & Suits">Kurtas & Suits</option>
                          <option value="Western Wear">Western Wear</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Description</label>
                    <textarea
                      required
                      placeholder="Detail fabric weave type, design prints, stitching options..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows="3"
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Toggle Try-On compatibility */}
                  <div className="flex items-center gap-3 p-3.5 bg-pink-50/50 border border-pink-100 rounded-xl">
                    <input
                      type="checkbox"
                      id="tryOnCompatible"
                      checked={productForm.tryOnCompatible}
                      onChange={(e) => setProductForm({...productForm, tryOnCompatible: e.target.checked})}
                      className="w-4.5 h-4.5 rounded text-pink-600 focus:ring-pink-500"
                    />
                    <div>
                      <label htmlFor="tryOnCompatible" className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block cursor-pointer">Compatible with Try-On Studio</label>
                      <span className="text-[9px] text-gray-400 leading-normal block">Enable customers to virtually try this outfit using generative AI models.</span>
                    </div>
                  </div>

                  {/* Image uploading */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Product Photo</label>
                    
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                        {productImagePreview ? (
                          <img src={productImagePreview.startsWith('http') ? productImagePreview : (productImagePreview.startsWith('data:') ? productImagePreview : `http://127.0.0.1:8000${productImagePreview}`)} alt="Product Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="inline-block bg-white hover:bg-slate-50 border border-gray-200 hover:border-pink-300 text-gray-650 hover:text-pink-600 font-extrabold text-[9px] uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs">
                          <span>Choose File</span>
                          <input 
                            type="file" 
                            accept="image/jpeg,image/png,image/webp" 
                            className="hidden" 
                            onChange={handleProductImageChange} 
                          />
                        </label>
                        <p className="text-[9px] text-gray-455">Supported files: JPEG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2 rounded-xl shadow-md transition-colors cursor-pointer border-0"
                    >
                      {editingProduct ? "Save Changes" : "List Product"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB CONTENT: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4">
                <ShoppingBag className="w-4.5 h-4.5 text-pink-600" />
                <span>My Orders</span>
              </h2>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-14 border border-dashed border-gray-200 rounded-2xl bg-gray-50/20">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xs font-bold text-gray-700">No orders placed yet</h3>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                    Explore Aavriti's collections to place your first high-realism clothing checkout.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200/80 rounded-xl bg-slate-50/20 overflow-hidden shadow-sm hover:border-pink-200/40 transition-all duration-200">
                      
                      {/* Header */}
                      <div className="bg-white/90 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Order ID</p>
                            <p className="text-xs font-black text-slate-800">#AVR-00{order.id}</p>
                          </div>
                          <div className="h-6 w-px bg-gray-150"></div>
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Order Date</p>
                            <p className="text-xs font-medium text-slate-600">{order.order_date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Total Price</p>
                            <p className="text-sm font-black text-pink-600">₹{order.total_amount.toLocaleString('en-IN')}</p>
                          </div>
                          <span className="px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Items */}
                      <div className="p-4 divide-y divide-gray-100 bg-white/20">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-3 flex items-center gap-4 justify-between first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-11 h-11 rounded-lg overflow-hidden border border-gray-100 bg-white shrink-0 shadow-sm flex items-center justify-center">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-extrabold text-gray-800 truncate leading-tight">{item.name}</h4>
                                <p className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">{item.brand}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 shrink-0">
                              <div className="text-center">
                                <p className="text-[9px] text-gray-400 font-bold">Qty</p>
                                <p className="text-xs font-extrabold text-slate-700">{item.quantity}</p>
                              </div>
                              <div className="text-right min-w-[70px]">
                                <p className="text-[9px] text-gray-400 font-bold">Price</p>
                                <p className="text-xs font-extrabold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping info */}
                      <div className="bg-slate-50/70 p-3 border-t border-gray-100 flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <div className="text-[9px] leading-relaxed text-gray-500">
                          <strong className="text-gray-700 uppercase tracking-wide">Delivering to:</strong> {formatAddress(order.shipping_address)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: BECOME A SELLER */}
          {activeTab === 'become-seller' && (
            <div className="space-y-6">
              {loadingApp ? (
                <div className="bg-white rounded-lg border border-gray-200/80 p-12 text-center shadow-sm">
                  <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading Application Status...</p>
                </div>
              ) : appStatus === "pending" ? (
                /* Application Under Review */
                <div className="bg-white rounded-lg border border-yellow-200 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden animate-fadeIn">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-500/5 to-transparent rounded-bl-[160px] pointer-events-none" />
                  
                  <div className="border-b border-gray-100 pb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-extrabold text-[9px] uppercase tracking-wider mb-3 animate-pulse">
                      <Sliders className="w-3 h-3" />
                      <span>Pending Admin Review</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight font-jakarta">
                      Your Application is Under Review
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Our system administrators are validating your boutique details. You will be upgraded automatically upon approval.
                    </p>
                  </div>

                  {/* Submitted Profile Summary Card */}
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-100 space-y-3 text-left">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted Business Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Store Name</span>
                        <strong className="text-gray-800 font-bold">{appData?.store_name}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Product Category</span>
                        <strong className="text-gray-800 font-bold">{appData?.product_category}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Business Email</span>
                        <span className="text-gray-700 font-medium">{appData?.business_email}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Business Phone</span>
                        <span className="text-gray-700 font-medium">{appData?.business_phone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[9px] text-gray-400 uppercase">Shop Description</span>
                        <p className="text-gray-600 leading-normal mt-0.5">{appData?.store_description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Onboarding Steps Timeline */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 py-4 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">✓</div>
                      <span className="text-xs font-bold text-gray-700">Submitted</span>
                    </div>
                    <div className="w-8 h-0.5 bg-emerald-200 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-[10px] animate-pulse">●</div>
                      <span className="text-xs font-bold text-gray-700">Under Review</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-200 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-[10px]">3</div>
                      <span className="text-xs font-bold text-gray-400">Activated Workspace</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={fetchApplicationStatus}
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs font-extrabold uppercase tracking-widest px-6 py-3 rounded-xl shadow-sm transition-all"
                    >
                      Refresh Status
                    </button>
                  </div>
                </div>
              ) : appStatus === "rejected" ? (
                /* Application Declined */
                <div className="bg-white rounded-lg border border-red-200 p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden animate-fadeIn">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/5 to-transparent rounded-bl-[160px] pointer-events-none" />
                  
                  <div className="border-b border-gray-100 pb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold text-[9px] uppercase tracking-wider mb-3">
                      <X className="w-3.5 h-3.5 text-red-600 animate-none" />
                      <span>Application Declined</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight font-jakarta">
                      Application Needs Revisions
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Our system administrators declined your recent seller application. Please review the feedback below.
                    </p>
                  </div>

                  {/* Decline feedback card */}
                  <div className="p-5 rounded-2xl bg-rose-50/20 border border-rose-100/50 text-left space-y-2">
                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider">Decline Reason / Feedback:</span>
                    <p className="text-xs font-bold text-gray-705 leading-normal italic">
                      "{appData?.rejection_reason || 'No specific reasons provided.'}"
                    </p>
                  </div>

                  {/* Submitted Details Review for context */}
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-gray-150 space-y-3 text-left">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Submitted Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Store Name</span>
                        <strong className="text-gray-800 font-bold">{appData?.store_name}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Product Category</span>
                        <strong className="text-gray-800 font-bold">{appData?.product_category}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setStoreForm({
                          store_name: appData?.store_name || '',
                          store_description: appData?.store_description || '',
                          business_email: appData?.business_email || user?.email || '',
                          business_phone: appData?.business_phone || user?.phone || '',
                          product_category: appData?.product_category || ''
                        });
                        setAppStatus("none");
                      }}
                      className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      Edit & Re-Apply
                    </button>
                  </div>
                </div>
              ) : user?.role === 'seller' || appStatus === 'approved' ? (
                /* Upgrade Congratulations Screen */
                <div className="bg-white rounded-lg border border-pink-200 p-8 sm:p-12 shadow-md text-center space-y-6 relative overflow-hidden animate-fadeIn">
                  {/* Decorative Confetti Background Glow */}
                  <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full filter blur-2xl pointer-events-none" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full filter blur-2xl pointer-events-none" />
                  
                  <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-inner border border-pink-200/50">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight font-jakarta">
                      Congratulations!
                    </h3>
                    <p className="text-sm font-bold text-pink-600 font-jakarta">
                      Your Aavriti Seller Account is Now Active
                    </p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed pt-2">
                      You have successfully upgraded your account. The AI Stylist studio, realistic fabric physics draping pipelines, and interactive canvas tools are now unlocked in your workspace.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <button
                      onClick={() => navigate('/try-on')}
                      className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-pink-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-white fill-white" />
                      <span>Open AI Try-On Studio</span>
                    </button>
                    <button
                      onClick={() => {
                        setAppStatus("none");
                        handleTabChange('profile');
                      }}
                      className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 text-xs font-extrabold uppercase tracking-widest px-8 py-4 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      Go to My Profile
                    </button>
                  </div>
                </div>
              ) : (
                /* Seller Application Form Display */
                <div className="bg-white rounded-lg border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/5 to-transparent rounded-bl-[160px] pointer-events-none" />
                  
                  <div className="border-b border-gray-100 pb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-[9px] uppercase tracking-wider mb-3">
                      <Sparkles className="w-3 h-3 fill-pink-300" />
                      <span>Unlock B2B E-Commerce Studio</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight font-jakarta">
                      Apply for Seller Account
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Partner with Aavriti. Submit store credentials to request workspace access.
                    </p>
                  </div>

                  {/* Graphics / Illustrations Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-pink-50/20 border border-gray-150 shadow-sm relative overflow-hidden group hover:border-pink-200 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-pink-100/40 text-pink-600 flex items-center justify-center mb-4">
                        <Sparkles className="w-5 h-5 fill-pink-100" />
                      </div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight font-jakarta">AI Try-On</h4>
                      <p className="text-[11px] leading-relaxed text-gray-500 mt-2">
                        Let customers instantly visualize and drape your outfits on their own photos.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-pink-50/20 border border-gray-150 shadow-sm relative overflow-hidden group hover:border-pink-200 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-pink-100/40 text-pink-600 flex items-center justify-center mb-4">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight font-jakarta">60% Return Drop</h4>
                      <p className="text-[11px] leading-relaxed text-gray-500 mt-2">
                        Realistic fabric solving ensures precise sizing fit, reducing logistics overhead.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-pink-50/20 border border-gray-150 shadow-sm relative overflow-hidden group hover:border-pink-200 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-pink-100/40 text-pink-600 flex items-center justify-center mb-4">
                        <User className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight font-jakarta">Global Reach</h4>
                      <p className="text-[11px] leading-relaxed text-gray-500 mt-2">
                        Connect traditional weaves directly to international fashion-forward shoppers.
                      </p>
                    </div>
                  </div>

                  {/* Application Form Inputs */}
                  <form onSubmit={handleStoreFormSubmit} className="space-y-5 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Business Information Form</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Store Name</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Royal Silk Handlooms"
                          value={storeForm.store_name}
                          onChange={e => setStoreForm({...storeForm, store_name: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Product Category</label>
                        <div className="relative">
                          <select
                            required
                            value={storeForm.product_category}
                            onChange={e => setStoreForm({...storeForm, product_category: e.target.value})}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none appearance-none cursor-pointer transition-all"
                          >
                            <option value="">Select Primary Category</option>
                            <option value="Sarees">Traditional Sarees</option>
                            <option value="Lehengas">Festive Lehengas</option>
                            <option value="Kurtas & Suits">Kurtas & Suits</option>
                            <option value="Western Wear">Western Fashion</option>
                            <option value="Accessories">Accessories & Jewelry</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Business Email</label>
                        <input
                          required
                          type="email"
                          placeholder="partner@business.com"
                          value={storeForm.business_email}
                          onChange={e => setStoreForm({...storeForm, business_email: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Business Phone</label>
                        <input
                          required
                          type="text"
                          placeholder="+91 98765 43210"
                          value={storeForm.business_phone}
                          onChange={e => setStoreForm({...storeForm, business_phone: e.target.value})}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Store Description</label>
                        <textarea
                          required
                          placeholder="Briefly describe your boutique, handloom roots, and products..."
                          value={storeForm.store_description}
                          onChange={e => setStoreForm({...storeForm, store_description: e.target.value})}
                          rows="3"
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-150">
                      <button
                        type="submit"
                        disabled={isSubmittingApp}
                        className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white text-xs font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-pink-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmittingApp ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-white fill-white" />
                            <span>Submit Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-2.5 animate-slideIn ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-250 text-rose-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            toast.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'
          }`} />
          <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
