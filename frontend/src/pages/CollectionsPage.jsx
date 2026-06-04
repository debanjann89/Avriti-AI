import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Products', param: null },
  { id: 'sarees', name: 'Traditional Sarees', param: 'Sarees' },
  { id: 'lehengas', name: 'Festive Lehengas', param: 'Lehengas' },
  { id: 'kurtas', name: 'Kurtas & Suits', param: 'Kurtas & Suits' },
  { id: 'western', name: 'Western Wear', param: 'Western Wear' },
  { id: 'accessories', name: 'Accessories', param: 'Accessories' }
];

export default function CollectionsPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort') || 'default';

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (categoryParam) {
      result = result.filter(p => p.category && p.category.toLowerCase() === categoryParam.toLowerCase());
    }

    // Sort Products
    if (sortParam === 'new') {
      // Simple sort by product ID descending for newer listings
      result = result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    } else if (sortParam === 'price-low') {
      result = result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortParam === 'price-high') {
      result = result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredProducts(result);
  }, [products, categoryParam, sortParam]);

  const handleCategorySelect = (param) => {
    if (param) {
      searchParams.set('category', param);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'default') {
      searchParams.delete('sort');
    } else {
      searchParams.set('sort', val);
    }
    setSearchParams(searchParams);
  };

  const activeCategory = CATEGORIES.find(c => 
    (!categoryParam && !c.param) || (categoryParam && c.param && c.param.toLowerCase() === categoryParam.toLowerCase())
  ) || CATEGORIES[0];

  return (
    <div className="py-12 bg-gradient-to-b from-[#FFF8F8] to-white min-h-screen font-sans select-none text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/60 text-pink-700 font-extrabold text-[9px] uppercase tracking-widest border border-pink-200/30">
            <Sparkles className="w-3 h-3 text-pink-600" />
            <span>Aavriti Premium Catalog</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight font-jakarta uppercase">
            {activeCategory.name} Collections
          </h1>
          <p className="text-xs text-gray-550 max-w-xl leading-relaxed font-medium">
            Browse our complete catalog of handloom weaves, festive lehengas, and designer ethnic apparel, integrated with virtual sizing try-on technology.
          </p>
        </div>

        {/* Filter and Controls Panel */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-gray-150 p-4 rounded-3xl shadow-xs mb-8">
          
          {/* Categories Tab Row */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.param)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-pink-600 border-pink-600 text-white shadow-xs'
                      : 'bg-slate-50 border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'
                  }`}
                >
                  {cat.param || 'All'}
                </button>
              );
            })}
          </div>

          {/* Sort Controller Dropdown */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
            <div className="flex items-center gap-1.5 text-gray-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Sort By</span>
            </div>
            
            <div className="relative inline-block w-40">
              <select
                value={sortParam}
                onChange={handleSortChange}
                className="w-full bg-slate-50 border border-gray-250 rounded-xl pl-3.5 pr-10 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500 focus:outline-none appearance-none cursor-pointer text-slate-700"
              >
                <option value="default">Featured Listings</option>
                <option value="new">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 top-2.5 w-3.5 h-3.5 text-gray-450 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white shadow-xs max-w-xl mx-auto space-y-4">
            <div className="text-5xl">🛍️</div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">No collections listed</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-normal">
              There are no products listed under this category at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
