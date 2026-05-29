import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="pb-16 bg-[#fffafb]">
      {/* Hero Section */}
      <section className="relative bg-black text-white h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Embrace Your Roots. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              Perfect Your Fit.
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-medium text-gray-100 drop-shadow-md max-w-2xl mx-auto">
            Experience the elegance of Indian ethnic wear with our revolutionary AI-powered Virtual Try-On technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/collections" className="bg-white text-pink-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto">
              Shop Collections
            </Link>
            <Link to="/try-on" className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2 border border-pink-400/30">
              <Sparkles className="w-5 h-5" /> Try On Now
            </Link>
          </div>
        </div>
      </section>

      {/* Aavriti Try On Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-pink-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2000ms' }}></div>
          
          <div className="relative z-10 md:w-2/3 mb-8 md:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-semibold text-sm mb-4">
              <Sparkles className="w-4 h-4" /> AI Powered
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">Aavriti Try On</span>
            </h2>
            <p className="text-gray-700 text-lg mb-6 max-w-xl leading-relaxed">
              Not sure how that Lehenga or Kurta will look on you? Upload your photo and see yourself in our stunning ethnic collection instantly. No more sizing guesswork.
            </p>
            <Link to="/try-on" className="inline-flex items-center text-pink-700 font-bold hover:text-pink-800 group">
              Launch Studio <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative z-10 md:w-1/3 flex justify-center">
             <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img src="/Logo.jpg" alt="Aavriti Try On AI" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Festive Collection</h2>
            <p className="mt-2 text-gray-500">Handpicked ethnic wear for your virtual wardrobe.</p>
          </div>
          <Link to="/collections" className="hidden sm:block text-pink-600 font-medium hover:text-pink-700 transition-colors">
            View all →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
