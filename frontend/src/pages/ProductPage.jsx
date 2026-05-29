import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ShoppingBag, Heart, ChevronLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p.id === id);
      setProduct(found);
    }
    window.scrollTo(0, 0);
  }, [id, products]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Store
      </Link>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Product Image */}
        <div className="mb-10 lg:mb-0">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 shadow-lg relative border border-pink-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h2 className="text-lg font-medium text-gray-500 mb-2">{product.brand}</h2>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{product.name}</h1>
          <p className="text-3xl font-bold text-pink-600 mb-8">₹{Number(product.price).toLocaleString('en-IN')}</p>
          
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>
          
          {/* Actions */}
          <div className="mt-auto space-y-4">
            <div className="flex space-x-4">
              <button 
                onClick={() => addToCart(product.id)}
                className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
              </button>
              <button className="p-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-pink-600 transition-colors flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
