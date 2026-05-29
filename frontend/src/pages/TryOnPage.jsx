import TryOnStudio from '../components/TryOnStudio';
import { Sparkles } from 'lucide-react';

export default function TryOnPage() {
  return (
    <div className="min-h-screen bg-[#fffafb] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-pink-600 mr-3" />
            Aavriti <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 ml-2">Try On</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our advanced AI fitting room. Upload any garment and see how it looks on you instantly.
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
           <TryOnStudio />
        </div>
      </div>
    </div>
  );
}
