import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, FileText, Lock, Scale, Sparkles, Check } from 'lucide-react';

export default function LegalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'privacy';

  const handleTabChange = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tabParam]);

  return (
    <div className="py-16 bg-gradient-to-b from-[#FFF8F8] to-white min-h-screen font-sans select-none text-left">
      {/* Fonts & Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .glass-card-premium {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(216, 27, 96, 0.08);
          box-shadow: 0 20px 40px rgba(163, 13, 69, 0.03);
        }
      `}} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 font-jakarta">
        
        {/* Page Header */}
        <div className="text-center space-y-3 mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/60 text-pink-700 font-extrabold text-[9px] uppercase tracking-widest border border-pink-200/30">
            <Sparkles className="w-3 h-3 text-pink-600" />
            <span>Compliance & Legal Standard</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
            Legal & Policy Center
          </h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
            Understand how we protect your try-on photos, catalog assets, and transactions under Indian IT standards.
          </p>
        </div>

        {/* Tab switch panel */}
        <div className="grid grid-cols-2 gap-2 mb-8 bg-white border border-gray-150 p-2 rounded-2xl shadow-xs">
          <button
            onClick={() => handleTabChange('privacy')}
            className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-all ${
              tabParam === 'privacy' ? 'bg-pink-600 text-white shadow-xs' : 'text-gray-500 hover:bg-slate-50 hover:text-pink-600'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => handleTabChange('terms')}
            className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-all ${
              tabParam === 'terms' ? 'bg-pink-600 text-white shadow-xs' : 'text-gray-500 hover:bg-slate-50 hover:text-pink-600'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="glass-card-premium p-6 sm:p-10 rounded-3xl">
          
          {/* Privacy Policy */}
          {tabParam === 'privacy' && (
            <div className="space-y-6 text-xs text-gray-650 leading-relaxed font-medium">
              <div className="border-b border-gray-100 pb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Privacy Policy</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Last Updated: June 2026</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">1. The Try-On Information We Collect</h3>
                <p>
                  At Aavriti.in, we respect your visual and physical identity. When utilizing our physics-guided AI try-on engines, we capture:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-1">
                  <li><strong>Physical Measurements:</strong> Your size preferences (XS to XXL), height (cm), and weight (kg) to accurately simulate fabric drape vectors.</li>
                  <li><strong>Image Uploads:</strong> Digital portraits uploaded specifically for generating virtual dress previews.</li>
                  <li><strong>Profile Logs:</strong> Basic registry names, shipping addresses, order transaction logs, and boutique registration documents.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">2. Generative Processing and Image Security</h3>
                <p>
                  Your uploaded portraits are processed strictly in RAM for diffusion model rendering. 
                  Once the drape preview finishes generating:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-1">
                  <li>Portraits are automatically expunged from processing logs. We do NOT retain or catalog raw un-draped photos of users.</li>
                  <li>If you choose to click "Save to Wardrobe", the resulting <strong>clothed</strong> avatar is stored in our database, linked to your user session for future wardrobing or review attachments.</li>
                  <li>We never share, sell, or license user-generated portraits to any third-party marketing networks.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">3. Secure Database Transactions</h3>
                <p>
                  Standard account passwords are encrypted using SHA-256 and salted hashing formats. Credit card payment tunnels are fully tokenized. Customer shipping profiles are secured and parsed locally to generate courier tracking records.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">4. Contacting Our Data Officer</h3>
                <p>
                  For any query regarding deletion of your virtual wardrobe portfolio, account removal, or data rectification, please contact our curation center or submit a ticket through the <a href="/support?tab=contact" className="text-pink-600 hover:underline">Support Desk</a>.
                </p>
              </div>
            </div>
          )}

          {/* Terms of Service */}
          {tabParam === 'terms' && (
            <div className="space-y-6 text-xs text-gray-650 leading-relaxed font-medium">
              <div className="border-b border-gray-100 pb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Terms of Service</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Last Updated: June 2026</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">1. Agreement to Terms</h3>
                <p>
                  By accessing Aavriti.in ("Website", "Service") or using our AI try-on engines, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these provisions, you must terminate your access immediately.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">2. Try-on Studio Rules & Portrait Licenses</h3>
                <p>
                  You represent and warrant that you hold full permissions and copyrights to any profile portrait you upload into the Aavriti Try-on engine.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-1">
                  <li>You must not upload portraits containing nudity, copyrighted marketing material, or images of third-party individuals without their explicit written consent.</li>
                  <li>Any attempt to reverse-engineer the generative neural weights, inject adversarial prompt scripts, or upload malicious files will result in immediate profile termination.</li>
                  <li>Our models aim for photorealism, but virtual outputs represent approximations. Minor draping artifacts, texture discrepancies, and color shifts from local screen displays are standard.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">3. Artisan Boutique Seller Terms</h3>
                <p>
                  Boutique designers listing catalog items on Aavriti AI agree to supply accurate size dimensions, authentic fabric weights, and genuine weave certificates where applicable:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-1">
                  <li>Sellers must ship orders in 1-2 business days and provide active logistics tracking numbers.</li>
                  <li>Product images uploaded for catalog listings must belong to the seller or be properly licensed. Plagiarism of designer catalogs is strictly banned.</li>
                  <li>Failure to fulfill orders or processing false shipping entries will lead to boutique closure and forfeiture of pending portal payouts.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">4. Disclaimers & Liability Limits</h3>
                <p>
                  Aavriti AI operates on an "as is" and "as available" standard. We exclude all warranties, express or implied, including fitness for a particular purchase, merchantability, or flawless up-times. Our total liability shall not exceed the price of the specific transaction under dispute.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Quick Consent Notice */}
        <div className="mt-8 bg-slate-50 border border-gray-150 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Compliance Assured</p>
            <p className="text-[10px] text-gray-400 font-medium leading-normal mt-0.5">
              By using our service, you acknowledge and agree to our automated size calculation rules and data privacy workflows.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
