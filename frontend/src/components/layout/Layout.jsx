import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Gradient bridge – fades page white into the deep footer */}
      {/* Seamless fade into footer — multi-stop so the blend is invisible */}
      <div
        className="h-28 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.85) 20%, rgba(216,27,96,0.30) 55%, rgba(216,27,96,0.80) 78%, #D81B60 100%)',
        }}
      />
      <Footer />
    </div>
  );
}
