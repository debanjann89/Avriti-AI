import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-sm text-gray-500 font-medium mb-1">{product.brand}</h3>
        <p className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</p>
        <p className="text-lg font-bold text-pink-600">₹{Number(product.price).toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
}
