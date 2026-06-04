import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HelpCircle, RefreshCcw, Truck, MessageSquare, Send, CheckCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: "How does Aavriti's AI Virtual Try-On work?",
    a: "Our virtual try-on studio leverages physics-guided diffusion models. By inputting your standard size (XS to XXL) along with your height and weight, Aavriti's AI calculates fabric weight, weave tension, brocade thickness, and lighting vectors. It then drapes the selected garment onto a photorealistic avatar matching your measurements."
  },
  {
    q: "Can I save my generated try-on outfits?",
    a: "Yes! Once a try-on generation completes in the studio, click the '❤ Save to Wardrobe' overlay button. The outfit will be saved to your Virtual Wardrobe, which you can access, zoom, or download from your Profile page."
  },
  {
    q: "How do I attach a try-on picture to my reviews?",
    a: "When writing a review on any product page, you'll see an optional dropdown called 'Attach Try-On Creation'. If you have saved try-ons of that outfit in your wardrobe, you can select it from the dropdown to display it as community social proof!"
  },
  {
    q: "How do I become an authorized boutique Seller?",
    a: "Go to your Profile page, select the 'Become a Seller' tab, and submit your boutique registration application. Once submitted, administrators review the request and approve it to grant you access to listing products and managing boutique orders."
  }
];

export default function SupportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'help';

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleTabChange = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
    setIsSubmitted(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-16 bg-gradient-to-b from-[#FFF8F8] to-white min-h-screen font-sans select-none text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page title */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/60 text-pink-700 font-extrabold text-[9px] uppercase tracking-widest border border-pink-200/30">
            <Sparkles className="w-3 h-3 text-pink-600" />
            <span>Support & Curation Desk</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight font-jakarta uppercase">
            Aavriti Help & Support
          </h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
            Have questions about try-on metrics, shipping logs, or custom boutique listings? We are here to assist.
          </p>
        </div>

        {/* Tab switch panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-white border border-gray-150 p-2 rounded-2xl shadow-xs">
          <button
            onClick={() => handleTabChange('help')}
            className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-all ${
              tabParam === 'help' ? 'bg-pink-600 text-white shadow-xs' : 'text-gray-500 hover:bg-slate-50 hover:text-pink-600'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </button>
          <button
            onClick={() => handleTabChange('returns')}
            className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-all ${
              tabParam === 'returns' ? 'bg-pink-600 text-white shadow-xs' : 'text-gray-500 hover:bg-slate-50 hover:text-pink-600'
            }`}
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Returns</span>
          </button>
          <button
            onClick={() => handleTabChange('shipping')}
            className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-all ${
              tabParam === 'shipping' ? 'bg-pink-600 text-white shadow-xs' : 'text-gray-500 hover:bg-slate-50 hover:text-pink-600'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping</span>
          </button>
          <button
            onClick={() => handleTabChange('contact')}
            className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-0 cursor-pointer transition-all ${
              tabParam === 'contact' ? 'bg-pink-600 text-white shadow-xs' : 'text-gray-500 hover:bg-slate-50 hover:text-pink-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl shadow-sm">
          
          {/* 1. FAQ TAB */}
          {tabParam === 'help' && (
            <div className="space-y-4">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4.5 h-4.5 text-pink-600" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="divide-y divide-gray-100">
                {FAQS.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full text-left font-bold text-xs text-gray-800 flex justify-between items-center cursor-pointer hover:text-pink-600 transition-colors border-0 bg-transparent"
                      >
                        <span>{faq.q}</span>
                        <span className="text-xs text-gray-400 font-normal">{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <p className="mt-2.5 text-xs text-gray-500 leading-relaxed font-medium animate-fadeIn">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. RETURNS TAB */}
          {tabParam === 'returns' && (
            <div className="space-y-4 text-xs font-medium text-gray-600 leading-relaxed">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-1.5">
                <RefreshCcw className="w-4.5 h-4.5 text-pink-600" />
                <span>Returns & Exchanges Policy</span>
              </h2>
              <p>
                At Aavriti AI, we source premium handlooms and customized ethnic fabrics straight from verified artisans and boutique designers across India. Since these items are crafted with care and require significant weaving effort, we have established a fair returns process:
              </p>
              <ul className="list-disc pl-5 space-y-2.5 mt-2.5">
                <li><strong>7-Day Returns Window:</strong> You can request a return or size exchange within 7 days of order delivery.</li>
                <li><strong>Garment Condition:</strong> Returned apparel must be completely unused, unwashed, unaltered, and still retain all original product tag labels and packaging wraps.</li>
                <li><strong>B2B Catalog Discrepancies:</strong> If a product is delivered with defects, boutique sellers are responsible for processing shipping replacements instantly.</li>
                <li><strong>Try-On Verification:</strong> We highly encourage trying on items using Aavriti's Virtual Try-On studio before purchasing to minimize sizing return rates.</li>
              </ul>
              <p className="pt-2">
                To initiate a refund, go to <strong>Profile &rarr; Order History</strong>, click on the delivered order, and select the 'Return Items' button to generate a pick-up label.
              </p>
            </div>
          )}

          {/* 3. SHIPPING TAB */}
          {tabParam === 'shipping' && (
            <div className="space-y-4 text-xs font-medium text-gray-600 leading-relaxed">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-1.5">
                <Truck className="w-4.5 h-4.5 text-pink-600" />
                <span>Shipping & Delivery Logs</span>
              </h2>
              <p>
                Aavriti partners with premium logistics operators (BlueDart, Delhivery, and India Post) to ensure safe, secure handloom delivery direct to your home.
              </p>
              <ul className="list-disc pl-5 space-y-2.5 mt-2.5">
                <li><strong>Free Nationwide Shipping:</strong> We provide 100% free standard shipping on all orders delivered across India, with no minimum purchase required.</li>
                <li><strong>Processing Times:</strong> Orders containing catalog listings are packaged and dispatched by our sellers within 1-2 business days.</li>
                <li><strong>Transit Times:</strong> Delivery to metros and major cities takes 3-4 business days. Regional and remote artisan zones take 5-7 business days.</li>
                <li><strong>Tracking:</strong> Real-time delivery logs, SMS alerts, and tracking links are activated as soon as sellers mark items as 'Shipped'.</li>
              </ul>
            </div>
          )}

          {/* 4. CONTACT TAB */}
          {tabParam === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-1.5">
                <MessageSquare className="w-4.5 h-4.5 text-pink-600" />
                <span>Write to Curation Center</span>
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-10 space-y-3 animate-scaleUp">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-6.5 h-6.5" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Message Dispatched!</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
                    Thank you for reaching out. Aavriti support agents have received your log. We will reply to your registered email address within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-5 py-2.5 bg-pink-650 hover:bg-pink-700 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0"
                  >
                    Send Another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Debanjan"
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-205 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="e.g. xyz@gmail.com"
                        value={contactForm.email}
                        onChange={e => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full bg-slate-50 border border-gray-205 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Message Subject</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Inquiring about Banarasi weave stock..."
                      value={contactForm.subject}
                      onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Message Body</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Explain your inquiry in detail..."
                      value={contactForm.message}
                      onChange={e => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-205 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-pink-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] border-0"
                    >
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
