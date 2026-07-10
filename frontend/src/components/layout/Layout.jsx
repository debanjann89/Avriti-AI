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
      <div className="h-16 bg-gradient-to-b from-white to-[#2D0B18] pointer-events-none" />
      <Footer />
    </div>
  );
}
