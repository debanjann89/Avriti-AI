export default function AboutPage() {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            About Aavriti.in
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Blending Indian heritage with cutting-edge AI technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1596547146476-eb3288d61f1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Indian Ethnic Wear" className="rounded-3xl shadow-lg" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At Aavriti.in, we believe that buying ethnic wear online shouldn't involve guesswork. Our mission is to bring the rich, vibrant heritage of Indian fashion to your fingertips, enhanced by our proprietary Aavriti Try On AI.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you are shopping for a wedding, a festival, or everyday elegance, you can now try on Sarees, Lehengas, and Kurtas virtually. See yourself in the outfit before you make a purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
