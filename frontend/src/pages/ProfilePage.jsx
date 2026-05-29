import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Sliders, 
  ShoppingBag, Sparkles, Upload, LogOut, 
  Check, Edit2, ChevronRight, ShoppingCart
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateProfile, updateProfilePicture } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
  
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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

  if (!user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
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
                      <select
                        name="body_type"
                        disabled={!isEditing}
                        value={formData.body_type}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all"
                      >
                        <option value="">Select Body Shape</option>
                        <option value="Average">Average / Medium</option>
                        <option value="Slim">Slim / Athletic</option>
                        <option value="Muscular">Muscular / Chiseled</option>
                        <option value="Plus Size">Plus Size / Full</option>
                      </select>
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
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
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

              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Contact Mobile Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Primary Address</label>
                  <textarea 
                    name="shipping_address"
                    disabled={!isEditing}
                    placeholder="Provide detailed home/office street address, landmark and PIN"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-50/50 disabled:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all resize-none animate-none"
                  />
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
                      {isSaving ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                )}
              </form>
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
                          <strong className="text-gray-700 uppercase tracking-wide">Delivering to:</strong> {order.shipping_address}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
