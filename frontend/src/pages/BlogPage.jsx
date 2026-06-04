import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, BookOpen, Clock, User, 
  ArrowRight, Search, X, Heart, ExternalLink, ShieldAlert
} from 'lucide-react';
import axios from 'axios';

const CATEGORIES = ["All", "Heritage Artisans", "AI Studio", "Styling Guides", "Digital Runway"];

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogEnabled, setBlogEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchBlogData = async () => {
    setLoading(true);
    try {
      const [settingsRes, postsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/blog/settings"),
        axios.get("http://127.0.0.1:8000/api/blog/posts")
      ]);
      setBlogEnabled(settingsRes.data.blog_enabled);
      setArticles(postsRes.data);
    } catch (e) {
      console.error("Error fetching blog data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F8] font-sans">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-pink-150 border-t-pink-600 rounded-full animate-spin"></div>
          <span className="text-xs font-black text-pink-600 uppercase tracking-widest animate-pulse">Loading Aavriti Blog...</span>
        </div>
      </div>
    );
  }

  if (!blogEnabled) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FFF8F8] p-6 font-sans select-none text-center">
        <div className="max-w-md w-full bg-white border border-pink-100 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="w-16 h-16 bg-pink-50 border border-pink-200 rounded-full flex items-center justify-center mx-auto text-pink-600 shadow-inner animate-bounce">
            <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase font-jakarta">Blog Curation Offline</h2>
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
              The Aavriti Blog page is currently undergoing curation. Our fashion editorial staff are working on writing beautiful traditional weaves artisan histories. Please check back soon!
            </p>
          </div>
          <div className="pt-2">
            <Link to="/home" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[10px] px-8 py-3 rounded-full uppercase tracking-wider shadow-md transition-all">
              Return Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F8] pb-24 font-sans select-none text-left">
      
      {/* 3D Glassmorphic Showcase Header */}
      <section className="relative w-full py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-[#FFF8F8] via-[#FFF8F8] to-[#FFF0F2] border-b border-pink-100/40">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#F8D7DA]/35 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#F8D7DA]/25 to-transparent rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Title & Intro */}
            <div className="col-span-12 lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8D7DA] text-[#A30D45] font-extrabold text-[10px] uppercase tracking-widest shadow-sm shadow-pink-100/50">
                <BookOpen className="w-3.5 h-3.5 text-pink-650" />
                <span>Aavriti Editorial Showcase</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-[#1E1E1E] leading-tight font-jakarta uppercase">
                Aavriti <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D81B60] via-[#A30D45] to-[#D81B60]">Craft & Technology Blog</span>
              </h1>
              
              <p className="text-sm text-[#1E1E1E]/65 leading-relaxed font-sans font-medium max-w-2xl mx-auto lg:mx-0">
                Explore the synergy between ancient textile heritages, artisan craft lanes, and state-of-the-art generative physics fabric solvers. Learn how we map sarees, configure sizes, and simulate catalog photos.
              </p>
            </div>

            {/* Right Column: Search Bar Card */}
            <div className="col-span-12 lg:col-span-5 bg-white/95 backdrop-blur-md p-6 rounded-[28px] border border-pink-100/50 shadow-xl space-y-4">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Search Publications</h3>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, tags, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">Instant search triggers automatic filters across our whole editorial archive.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FILTER BUTTONS ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-wrap gap-2.5 pb-4 border-b border-gray-250">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-pink-600 text-white border-pink-600 shadow-md scale-[1.01]"
                  : "bg-white text-gray-650 border-gray-200 hover:border-pink-300 hover:text-pink-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto">
            <BookOpen className="w-12 h-12 text-gray-350 mx-auto mb-3" />
            <h3 className="text-xs font-bold text-gray-700">No articles matched your criteria</h3>
            <p className="text-[11px] text-gray-400 mt-1">Try updating your filters or search terms to browse the directory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((art) => (
              <div 
                key={art.id} 
                className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Card Header */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                  <span className="absolute top-4 left-4 bg-pink-100/90 backdrop-blur-xs text-pink-700 border border-pink-200 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                    {art.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-[9px] text-gray-405 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-pink-500" /> {art.read_time}</span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>
                    <h3 
                      onClick={() => setSelectedArticle(art)}
                      className="text-base font-black text-gray-900 uppercase tracking-tight group-hover:text-pink-650 transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6.5 h-6.5 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] text-gray-450 font-bold truncate">{art.author}</span>
                    </div>

                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#D81B60] uppercase tracking-wider group-hover:translate-x-1 transition-transform cursor-pointer border-0 bg-transparent"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ARTICLE READ DETAIL DRAWER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full border border-gray-100 flex flex-col h-[90vh] md:h-[650px] text-left">
            
            {/* Header / Close */}
            <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-white shrink-0">
              <span className="bg-pink-100/90 text-pink-700 border border-pink-200 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {selectedArticle.category}
              </span>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 bg-slate-50 hover:bg-slate-100 text-gray-500 rounded-full flex items-center justify-center transition-colors cursor-pointer border-0"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Header Info */}
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight leading-snug">
                  {selectedArticle.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100 pb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-pink-600" /> {selectedArticle.read_time}</span>
                  <span>•</span>
                  <span>Published {selectedArticle.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-pink-600" /> {selectedArticle.author}</span>
                </div>
              </div>

              {/* Big Header Image */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xs">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>

              {/* Main Content */}
              <div className="prose prose-sm text-gray-655 leading-relaxed whitespace-pre-wrap font-medium">
                {selectedArticle.content}
              </div>

              {/* Interactive Call to Action Panel */}
              {selectedArticle.interactive_link && (
                <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
                  <div>
                    <h4 className="text-[10px] font-black text-pink-850 uppercase tracking-widest">Interactive Fashion Studio Link</h4>
                    <p className="text-xs text-pink-700 mt-1 font-semibold leading-normal">{selectedArticle.interactive_text || "Launch fashion workspace now"}</p>
                  </div>
                  <Link
                    to={selectedArticle.interactive_link}
                    onClick={() => setSelectedArticle(null)}
                    className="bg-pink-650 hover:bg-pink-700 text-white font-extrabold text-[9px] uppercase tracking-widest px-5 py-3 rounded-xl shadow-md flex items-center gap-1 border-0"
                  >
                    <span>Launch Workshop</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
