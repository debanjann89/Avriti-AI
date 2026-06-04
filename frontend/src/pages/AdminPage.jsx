import { useState, useContext, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { 
  Trash2, Edit2, Plus, X, Save, Lock, 
  Users, ShoppingBag, PlusCircle, ShieldCheck, Key,
  BookOpen, ChevronDown
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function AdminPage() {
  const { user } = useContext(AuthContext);
  
  // 1. Password Gate authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem('admin_auth') === 'true'
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [gateError, setGateError] = useState('');

  // 2. Active Tab state ('products', 'sellers')
  const [activeTab, setActiveTab] = useState('products');

  // 3. Product state
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', image: '', category: '', description: ''
  });

  // 4. Seller state
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [sellerForm, setSellerForm] = useState({ name: '', email: '', password: '' });
  const [sellerError, setSellerError] = useState('');
  const [sellerSuccess, setSellerSuccess] = useState('');
  const [isCreatingSeller, setIsCreatingSeller] = useState(false);

  // 5. Seller Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [declineReasonId, setDeclineReasonId] = useState(null);
  const [declineReasonText, setDeclineReasonText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // 6. Blog states & configuration
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogEnabled, setBlogEnabled] = useState(true);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', category: 'AI Studio', 
    read_time: '5 min read', date: '', author: 'Administrator', image: '', 
    interactive_text: '', interactive_link: ''
  });
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogDeleteConfirmId, setBlogDeleteConfirmId] = useState(null);

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const postsRes = await axios.get("http://127.0.0.1:8000/api/blog/posts");
      setBlogs(postsRes.data);
      
      const settingsRes = await axios.get("http://127.0.0.1:8000/api/blog/settings");
      setBlogEnabled(settingsRes.data.blog_enabled);
    } catch (err) {
      console.error("Error loading blog data in admin", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleToggleBlogStatus = async () => {
    try {
      const nextStatus = !blogEnabled;
      await axios.post("http://127.0.0.1:8000/api/blog/settings", {
        blog_enabled: nextStatus
      });
      setBlogEnabled(nextStatus);
      showToast(`Blog Page successfully ${nextStatus ? 'enabled (Online)' : 'disabled (Offline)'}.`, "success");
    } catch (err) {
      console.error("Error toggling blog status", err);
      showToast("Failed to toggle blog page status.", "error");
    }
  };

  const handleBlogFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: blogForm.title,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      category: blogForm.category,
      read_time: blogForm.read_time || "5 min read",
      date: blogForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: blogForm.author || "Administrator",
      image: blogForm.image || "https://images.unsplash.com/photo-1558271821-3ad046a38cf0?auto=format&fit=crop&w=800&q=80",
      interactive_text: blogForm.interactive_text || null,
      interactive_link: blogForm.interactive_link || null
    };

    try {
      if (editingBlogId) {
        await axios.put(`http://127.0.0.1:8000/api/blog/post/${editingBlogId}`, payload);
        showToast("Blog post updated successfully!", "success");
      } else {
        await axios.post("http://127.0.0.1:8000/api/blog/post", payload);
        showToast("New blog post published successfully!", "success");
      }
      setIsBlogModalOpen(false);
      setEditingBlogId(null);
      setBlogForm({
        title: '', excerpt: '', content: '', category: 'AI Studio', 
        read_time: '5 min read', date: '', author: 'Administrator', image: '', 
        interactive_text: '', interactive_link: ''
      });
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog post", err);
      showToast(err.response?.data?.detail || "Failed to save blog post.", "error");
    }
  };

  const handleEditBlogClick = (post) => {
    setEditingBlogId(post.id);
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      read_time: post.read_time,
      date: post.date,
      author: post.author,
      image: post.image,
      interactive_text: post.interactive_text || '',
      interactive_link: post.interactive_link || ''
    });
    setIsBlogModalOpen(true);
  };

  const handleDeleteBlogClick = (postId) => {
    setBlogDeleteConfirmId(postId);
  };

  const handleConfirmDeleteBlog = async () => {
    if (!blogDeleteConfirmId) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blog/post/${blogDeleteConfirmId}`);
      showToast("Blog post deleted successfully.", "success");
      setBlogDeleteConfirmId(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog post", err);
      showToast("Failed to delete blog post.", "error");
      setBlogDeleteConfirmId(null);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Fetch Sellers List
  const fetchSellers = async () => {
    setLoadingSellers(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/users/sellers');
      setSellers(res.data);
    } catch (err) {
      console.error("Error loading sellers", err);
    } finally {
      setLoadingSellers(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/users/seller-applications');
      setApplications(res.data);
    } catch (err) {
      console.error("Error loading seller applications", err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleApproveApp = async (appId) => {
    if (!window.confirm("Are you sure you want to approve this seller application? This will immediately upgrade the user's role to Seller.")) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/seller-application/${appId}/approve`);
      showToast("Application approved successfully!", "success");
      fetchApplications();
      fetchSellers();
    } catch (err) {
      console.error("Error approving application", err);
      showToast("Failed to approve application.", "error");
    }
  };

  const handleConfirmRejectApp = async (appId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/seller-application/${appId}/reject`, {
        reason: declineReasonText
      });
      showToast("Application declined successfully.", "success");
      setDeclineReasonId(null);
      setDeclineReasonText('');
      fetchApplications();
    } catch (err) {
      console.error("Error declining application", err);
      showToast("Failed to decline application.", "error");
    }
  };

  const handleDeleteApp = (appId) => {
    setDeleteConfirmId(appId);
  };

  const handleConfirmDeleteApp = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/seller-application/${deleteConfirmId}`);
      showToast("Application deleted successfully.", "success");
      setDeleteConfirmId(null);
      fetchApplications();
    } catch (err) {
      console.error("Error deleting application", err);
      showToast("Failed to delete application.", "error");
      setDeleteConfirmId(null);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      if (activeTab === 'sellers') fetchSellers();
      if (activeTab === 'applications') fetchApplications();
      if (activeTab === 'blogs') fetchBlogs();
    }
  }, [isAdminAuthenticated, activeTab]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchApplications();
    }
  }, [isAdminAuthenticated]);

  // Handle Password Gate submission
  const handleGateSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'Avriti2026') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setGateError('');
    } else {
      setGateError('Incorrect administrative passcode.');
    }
  };

  // Alter User/Seller Creation
  const handleSellerCreateSubmit = async (e) => {
    e.preventDefault();
    setSellerError('');
    setSellerSuccess('');
    setIsCreatingSeller(true);
    
    try {
      await axios.post('http://127.0.0.1:8000/api/users/create-seller', sellerForm);
      setSellerSuccess(`Seller account for "${sellerForm.name}" created successfully!`);
      setSellerForm({ name: '', email: '', password: '' });
      fetchSellers(); // refresh
    } catch (err) {
      setSellerError(err.response?.data?.detail || 'Failed to create seller account');
    } finally {
      setIsCreatingSeller(false);
    }
  };

  // Product Actions
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '', brand: '', price: '', image: '', category: '', description: ''
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price),
    };
    
    if (editingId === 'NEW') {
      addProduct(productData);
    } else {
      updateProduct(editingId, productData);
    }
    handleCancel();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- PASSWORD CHALLENGE SCREEN ---
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-4 font-sans">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center shadow-2xl space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-pink-500/20 border border-pink-500/40 rounded-full flex items-center justify-center mx-auto text-pink-500 shadow-inner">
            <Lock className="w-9 h-9 stroke-[1.5]" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">Aavriti Admin Gate</h2>
            <p className="text-slate-400 text-xs tracking-wide uppercase font-bold mt-1">Administrative Authentication</p>
          </div>
          
          <form onSubmit={handleGateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                <Key className="w-3.5 h-3.5" />
                <span>Enter Admin Password</span>
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all placeholder-slate-600"
              />
            </div>
            
            {gateError && (
              <p className="text-rose-400 text-xs font-semibold animate-pulse flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>{gateError}</span>
              </p>
            )}
            
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-extrabold text-xs transition-all bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white uppercase tracking-widest shadow-lg hover:shadow-xl hover:shadow-pink-500/20 hover:scale-[1.01] active:scale-100 cursor-pointer"
            >
              Unlock Terminal
            </button>
          </form>
          
          <p className="text-[9px] text-slate-500 leading-normal">
            Unauthorized access attempts are logged. Systems protected under SEC-256 protocol.
          </p>
        </div>
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50/30 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">SaaS Admin Control Terminal</h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-extrabold">System Administration Dashboard</p>
          </div>
          
          {activeTab === 'products' && (
            <button 
              onClick={() => { setEditingId('NEW'); setFormData({ name: '', brand: '', price: '', image: '', category: '', description: '' }); }}
              className="flex items-center bg-pink-600 text-white px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-pink-700 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Catalog Product
            </button>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-gray-200 pb-px">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sellers'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Sellers</span>
            {sellers.length > 0 && (
              <span className="bg-pink-100 text-pink-700 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">{sellers.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Applications</span>
            {applications.filter(a => a.status === 'pending').length > 0 && (
              <span className="bg-pink-100 text-pink-700 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">
                {applications.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-3 px-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'blogs'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Blogs</span>
          </button>
        </div>

        {/* --- PRODUCTS TAB CONTENT --- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Editing Product form */}
            {editingId && (
              <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">
                    {editingId === 'NEW' ? 'Add New Product Catalog' : 'Modify Product Credentials'}
                  </h2>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Product Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Brand</label>
                    <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Price (₹)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Category</label>
                    <input required type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Image URL</label>
                    <input required type="url" name="image" value={formData.image} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all resize-none" rows="3"></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2 border-t border-gray-50 pt-4">
                    <button type="button" onClick={handleCancel} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors">Cancel</button>
                    <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1">
                      <Save className="w-4 h-4 mr-1" /> Save Catalog
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table list */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-150">
                  <thead className="bg-slate-50/70 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">Product & Brand</th>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-left">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/30 transition-all">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 border border-gray-150 rounded-xl overflow-hidden shadow-sm">
                              <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
                            </div>
                            <div className="ml-4 min-w-0">
                              <div className="text-xs font-black text-gray-900 truncate max-w-[220px]">{product.name}</div>
                              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-pink-600">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-extrabold text-gray-800">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                            <Edit2 className="w-4 h-4 stroke-[2]" />
                          </button>
                          <button onClick={() => { if(window.confirm('Delete product?')) deleteProduct(product.id) }} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="w-4 h-4 stroke-[2]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- SELLERS TAB CONTENT --- */}
        {activeTab === 'sellers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Creator registration form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-xl space-y-5 animate-fadeIn">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-4">
                  <PlusCircle className="w-5 h-5 text-pink-600" />
                  <span>Create Seller Profile</span>
                </h2>
                
                <form onSubmit={handleSellerCreateSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Seller Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Saree Boutique Inc."
                      value={sellerForm.name}
                      onChange={e => setSellerForm({...sellerForm, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Login Email</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="seller@aavriti.in"
                      value={sellerForm.email}
                      onChange={e => setSellerForm({...sellerForm, email: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Seller Passcode</label>
                    <input 
                      required 
                      type="password" 
                      placeholder="••••••••"
                      value={sellerForm.password}
                      onChange={e => setSellerForm({...sellerForm, password: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" 
                    />
                  </div>
                  
                  {sellerError && (
                    <p className="text-red-500 text-xs font-semibold text-center animate-pulse">{sellerError}</p>
                  )}
                  
                  {sellerSuccess && (
                    <p className="text-emerald-600 text-xs font-bold text-center leading-normal">{sellerSuccess}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isCreatingSeller}
                    className="w-full py-3.5 rounded-xl font-bold bg-pink-600 hover:bg-pink-700 text-white text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer text-center block"
                  >
                    {isCreatingSeller ? "Spawning account..." : "Register B2B Seller"}
                  </button>
                </form>

                <div className="bg-pink-50/50 border border-pink-100/40 rounded-xl p-3 text-[10px] text-gray-500 leading-normal">
                  🔐 Seller accounts have exclusive authorization to access the AI Virtual Try-On Studio. They cannot register through public channels.
                </div>
              </div>
            </div>

            {/* List of current sellers */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 animate-fadeIn">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-4">
                  <Users className="w-5 h-5 text-pink-600" />
                  <span>Authorized SaaS Sellers</span>
                </h2>

                {loadingSellers ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-2">
                    <div className="w-8 h-8 border-4 border-pink-150 border-t-pink-600 rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading sellers...</span>
                  </div>
                ) : sellers.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-gray-700">No sellers registered</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                      Use the creation panel on the left to spawn your first authorized B2B SaaS seller.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {sellers.map((seller) => (
                      <div key={seller.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100/60 border border-pink-200/50 flex items-center justify-center text-pink-600 shrink-0 shadow-inner font-extrabold text-sm">
                            {seller.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-gray-800 leading-tight">{seller.name}</h4>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{seller.email}</p>
                          </div>
                        </div>
                        <span className="px-3 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 text-pink-600 uppercase tracking-widest">
                          Seller
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- APPLICATIONS TAB CONTENT --- */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-fadeIn font-sans">
            <div className="bg-white rounded-3xl border border-gray-105 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-4">
                <ShieldCheck className="w-5 h-5 text-pink-600" />
                <span>Seller Registration Requests</span>
              </h2>

              {loadingApps ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-2">
                  <div className="w-8 h-8 border-4 border-pink-150 border-t-pink-600 rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading requests...</span>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20">
                  <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-gray-700">No applications found</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                    Pending requests submitted by buyers applying for a B2B seller role will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((app) => (
                    <div key={app.id} className="p-6 rounded-2xl bg-slate-50/40 border border-gray-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-pink-200/50 transition-all duration-300">
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="block text-[8px] font-extrabold text-pink-600 uppercase tracking-widest bg-pink-50 border border-pink-100 rounded-full px-2 py-0.5 w-fit">
                              {app.product_category}
                            </span>
                            <h3 className="text-sm font-black text-gray-800 tracking-tight mt-2">{app.store_name}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">By: {app.user_name} ({app.user_email})</p>
                          </div>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider ${
                            app.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-850 border border-yellow-200 animate-pulse'
                              : app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-250'
                              : 'bg-rose-100 text-rose-800 border border-rose-250'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-gray-150 text-xs space-y-2">
                          <div>
                            <span className="text-[9px] text-gray-400 block uppercase">Business Contact</span>
                            <span className="font-semibold text-gray-700">{app.business_email} | {app.business_phone}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-450 block uppercase font-bold">Store Description</span>
                            <p className="text-gray-650 mt-1 leading-normal">{app.store_description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-gray-150 mt-5 flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteApp(app.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                            title="Delete Request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Submitted: {app.submitted_at}</span>
                        </div>
                        
                        {app.status === 'pending' && (
                          declineReasonId === app.id ? (
                            <div className="flex flex-col gap-2 mt-2 w-full max-w-[240px]">
                              <input
                                required
                                type="text"
                                placeholder="Enter decline reason..."
                                value={declineReasonText}
                                onChange={e => setDeclineReasonText(e.target.value)}
                                className="border border-rose-250 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none bg-white text-gray-800"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setDeclineReasonId(null)}
                                  className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleConfirmRejectApp(app.id)}
                                  disabled={!declineReasonText.trim()}
                                  className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-40"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setDeclineReasonId(app.id);
                                  setDeclineReasonText('');
                                }}
                                className="px-4 py-2 border border-rose-200 text-rose-650 hover:bg-rose-50 text-[10px] font-extrabold uppercase tracking-widest rounded-lg shadow-sm transition-all cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApproveApp(app.id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-lg shadow-md hover:shadow-emerald-100 transition-all cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- BLOGS TAB CONTENT --- */}
        {activeTab === 'blogs' && (
          <div className="space-y-6 animate-fadeIn font-sans">
            <div className="bg-white rounded-3xl border border-gray-105 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
              
              {/* Status configuration card */}
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-150 pb-5 text-left">
                <div>
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-pink-600" />
                    <span>Blog Page Configuration</span>
                  </h2>
                  <p className="text-xs text-gray-405 font-medium mt-1">Control active visibility status and manage editorial articles catalog.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingBlogId(null);
                    setBlogForm({
                      title: '', excerpt: '', content: '', category: 'AI Studio', 
                      read_time: '5 min read', date: '', author: 'Administrator', image: '', 
                      interactive_text: '', interactive_link: ''
                    });
                    setIsBlogModalOpen(true);
                  }}
                  className="bg-[#D81B60] hover:bg-[#A30D45] text-white text-[10px] font-extrabold uppercase tracking-widest px-5 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition-all border-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Blog Post</span>
                </button>
              </div>

              {/* Toggle Panel */}
              <div className="flex items-center justify-between p-4 bg-pink-50/50 border border-pink-100 rounded-2xl shadow-xs text-left">
                <div className="space-y-1">
                  <strong className="text-xs font-black text-gray-800 uppercase tracking-wider block">Blog Page Visibility Status</strong>
                  <p className="text-[10px] text-gray-405 max-w-lg leading-normal">
                    Turn the blog page online or offline. When disabled, the navigation link is hidden and direct accesses route to a curation message.
                  </p>
                </div>
                <button
                  onClick={handleToggleBlogStatus}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border-0 cursor-pointer ${
                    blogEnabled
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-100 text-gray-505 hover:bg-gray-200"
                  }`}
                >
                  {blogEnabled ? "● Online (Enabled)" : "○ Offline (Disabled)"}
                </button>
              </div>

              {/* Blog Lists Table */}
              {loadingBlogs ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-2">
                  <div className="w-8 h-8 border-4 border-pink-150 border-t-pink-600 rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading articles database...</span>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/20">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xs font-bold text-gray-700">No blog posts listed</h3>
                  <p className="text-[11px] text-gray-450 mt-1">Publish your first artisan or tech article to seed the archive.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-150 rounded-2xl bg-slate-50/10 text-left">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-150 font-extrabold text-gray-500 uppercase tracking-wider text-[9px]">
                        <th className="p-4">Article Detail</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Published Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {blogs.map((post) => (
                        <tr key={post.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-50 border border-gray-150 shrink-0 shadow-xs">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-800 line-clamp-1">{post.title}</span>
                                <span className="text-[10px] text-gray-405 line-clamp-1 mt-0.5">{post.excerpt}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-pink-100 text-pink-700 border border-pink-200/40">
                              {post.category}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-600">{post.author}</td>
                          <td className="p-4 text-slate-500">{post.date}</td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditBlogClick(post)}
                                className="p-2 border border-gray-200 hover:border-pink-300 text-gray-650 hover:text-pink-600 rounded-lg transition-colors cursor-pointer bg-white"
                                title="Edit Article"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlogClick(post.id)}
                                className="p-2 border border-rose-100 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer bg-white"
                                title="Delete Article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

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

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="max-w-sm w-full bg-white/95 backdrop-blur-xl border border-gray-150 p-6 rounded-3xl text-center shadow-2xl space-y-5 animate-scaleUp">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-650 shadow-inner">
              <Trash2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tight font-jakarta">Delete Request?</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Are you sure you want to delete this seller registration request? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-500 font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteApp}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-md shadow-rose-150 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT BLOG POST MODAL --- */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full border border-gray-100 relative flex flex-col max-h-[90vh] text-left">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-150 flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tight font-jakarta">
                {editingBlogId ? "Edit Blog Article" : "Create New Blog Post"}
              </h3>
              <button 
                onClick={() => {
                  setIsBlogModalOpen(false);
                  setEditingBlogId(null);
                }}
                className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-gray-500 rounded-full flex items-center justify-center transition-colors cursor-pointer border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleBlogFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Article Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Traditional Handlooms of South India"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Author Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aarti Iyer"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Category</label>
                  <div className="relative">
                    <select
                      required
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3.5 py-2.5 pr-10 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="Heritage Artisans">Heritage Artisans</option>
                      <option value="AI Studio">AI Studio</option>
                      <option value="Styling Guides">Styling Guides</option>
                      <option value="Digital Runway">Digital Runway</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Reading Time</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={blogForm.read_time}
                    onChange={(e) => setBlogForm({...blogForm, read_time: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Publication Date</label>
                  <input
                    type="text"
                    placeholder="e.g. June 04, 2026"
                    value={blogForm.date}
                    onChange={(e) => setBlogForm({...blogForm, date: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Excerpt / Hook</label>
                <input
                  required
                  type="text"
                  placeholder="Provide a short sentence summarizing the publication hook..."
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Article Main Content</label>
                <textarea
                  required
                  placeholder="Write the full body text of the article..."
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                  rows="5"
                  className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Header Photo Image URL</label>
                <input
                  required
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={blogForm.image}
                  onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                  className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Interactive Link Text (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Try draping garments in Try-On Studio"
                    value={blogForm.interactive_text}
                    onChange={(e) => setBlogForm({...blogForm, interactive_text: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Interactive Path (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /tryon or /collections"
                    value={blogForm.interactive_link}
                    onChange={(e) => setBlogForm({...blogForm, interactive_link: e.target.value})}
                    className="w-full bg-slate-50 border border-gray-205 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsBlogModalOpen(false);
                    setEditingBlogId(null);
                  }}
                  className="px-4 py-2 border border-gray-250 text-gray-500 hover:bg-gray-55 rounded-xl text-xs font-bold transition-colors cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2 rounded-xl shadow-md transition-colors cursor-pointer border-0"
                >
                  {editingBlogId ? "Save Changes" : "Publish Post"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- DELETE BLOG POST MODAL --- */}
      {blogDeleteConfirmId && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn font-sans">
          <div className="max-w-sm w-full bg-white/95 backdrop-blur-xl border border-gray-150 p-6 rounded-3xl text-center shadow-2xl space-y-5 animate-scaleUp">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-650 shadow-inner">
              <Trash2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tight font-jakarta">Delete Publication?</h3>
              <p className="text-[11px] text-gray-505 leading-relaxed">
                Are you sure you want to delete this blog post from the platform archive? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBlogDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-500 font-extrabold text-[10px] uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBlog}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-md shadow-rose-150 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-0"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
