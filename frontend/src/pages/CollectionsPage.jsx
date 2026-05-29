import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function CollectionsPage() {
  const { products } = useProducts();

  return (
    <div className="py-16 bg-[#fffafb] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            All Collections
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Browse our complete range of exquisite Indian ethnic wear.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
