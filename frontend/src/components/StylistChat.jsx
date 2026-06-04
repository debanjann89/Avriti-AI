import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Send, X, Sparkles, ShoppingBag, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function StylistChat() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hello! I am your AI Fashion Stylist. I can recommend outfits from our collection tailored to your sizing settings. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Don't show chat drawer on the Landing page or Admin views
  if (location.pathname === '/' || location.pathname === '/admin') {
    return null;
  }

  // Pre-set helper tags
  const promptChips = [
    "What fits my height?",
    "Recommend a casual fit",
    "Show festive wear"
  ];

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Format chat history to send to Gemini
    const chatHistory = messages.map(m => ({
      role: m.role,
      text: m.text
    }));

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/tryon/stylist-chat', {
        user_id: user?.id || null,
        message: messageText,
        chat_history: chatHistory
      });

      setMessages(prev => [...prev, { role: 'model', text: res.data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I'm having trouble connecting to my creative fashion network right now. Please verify your backend server connection." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parser to convert [Product Name](/product/id) into beautiful interactive pills
  const parseMarkdownLinks = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const linkText = match[1];
      const linkUrl = match[2];

      parts.push(
        <Link 
          key={match.index} 
          to={linkUrl}
          onClick={() => setIsOpen(false)} // Close chat drawer when redirecting to product details
          className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 border border-pink-100 hover:border-pink-200 text-[10px] font-black uppercase tracking-wider text-[#D81B60] rounded-full mx-0.5 hover:scale-105 transition-transform"
        >
          <ShoppingBag className="w-3 h-3 text-[#D81B60] shrink-0" />
          <span>{linkText}</span>
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      {/* Floating Stylist Bubble */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#D81B60] via-[#C2185B] to-[#AD1457] hover:from-[#C2185B] hover:to-[#880E4F] text-white flex items-center justify-center shadow-xl shadow-pink-250/30 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-pink-500/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </button>

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white/95 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slideIn">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#D81B60] via-[#C2185B] to-[#AD1457] p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black uppercase tracking-widest leading-none">AI Personal Stylist</h4>
                {user ? (
                  <span className="text-[8px] font-bold text-pink-200/90 tracking-wider uppercase">
                    Fitting Profile: {user.height ? `${user.height}cm` : 'No Height'} | {user.weight ? `${user.weight}kg` : 'No Weight'}
                  </span>
                ) : (
                  <span className="text-[8px] font-bold text-pink-200/90 tracking-wider uppercase">Guest Shopping</span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Log area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                  m.role === 'user' ? 'bg-[#F8D7DA]/60 text-[#D81B60]' : 'bg-[#D81B60]/10 text-[#D81B60] border border-[#D81B60]/10'
                }`}>
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble Text */}
                <div className={`rounded-2xl p-3.5 text-[11px] leading-relaxed font-medium shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-[#D81B60] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-gray-150 rounded-tl-none'
                }`}>
                  {m.role === 'user' ? m.text : (
                    <div className="whitespace-pre-line space-y-1">
                      {parseMarkdownLinks(m.text)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] text-left">
                <div className="w-7 h-7 rounded-full bg-[#D81B60]/10 border border-[#D81B60]/10 flex items-center justify-center text-[#D81B60]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white text-slate-500 border border-gray-150 rounded-2xl rounded-tl-none p-3.5 text-xs font-semibold flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#D81B60] animate-spin" />
                  <span>Curating recommendations...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick Prompt Chips */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 flex flex-wrap gap-2 bg-white border-t border-gray-100 justify-start shrink-0">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1.5 rounded-full border border-pink-100 hover:border-pink-300 bg-pink-50/20 hover:bg-pink-50 text-[9px] font-black uppercase tracking-wider text-[#D81B60] transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }} 
            className="p-3 bg-white border-t border-gray-150 flex gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask for outfit advice..."
              value={input}
              disabled={isLoading}
              onChange={e => setInput(e.target.value)}
              className="flex-grow bg-gray-50 border border-gray-200/80 rounded-2xl px-4 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:border-[#D81B60] focus:ring-[#D81B60] focus:ring-1 focus:outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-2xl bg-[#D81B60] hover:bg-[#AD1457] text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 transition-colors"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
