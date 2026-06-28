import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import TryOnPage from './pages/TryOnPage';
import AboutPage from './pages/AboutPage';
import CollectionsPage from './pages/CollectionsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BlogPage from './pages/BlogPage';
import SupportPage from './pages/SupportPage';
import LegalPage from './pages/LegalPage';
import StylistChat from './components/StylistChat';
import Preloader from './components/Preloader';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Preloader />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Landing Page at root */}
            <Route path="/" element={<LandingPage />} />

            {/* Shop Routes wrapped in Layout (Navbar & Footer) */}
            <Route element={<Layout />}>
              <Route path="home" element={<HomePage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="try-on" element={<TryOnPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="legal" element={<LegalPage />} />
            </Route>

            {/* Standalone Admin route clean of website Nav and Footer */}
            <Route path="admin" element={<AdminPage />} />
          </Routes>
          <StylistChat />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;