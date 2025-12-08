import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Home, Loader2 } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hi! 👋 I'm your Home Place Florida assistant. I search real listings from realtor.com for Tampa Bay area. Try asking me things like:\n\n• \"Show me homes under $500k in Clearwater\"\n• \"Find 3 bedroom condos in St. Petersburg\"\n• \"What's available in Tampa with a pool?\"" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  function addMessage(from, text, listings = null) {
    setMessages(m => [...m, { id: Date.now() + Math.random(), from, text, listings }]);
  }

  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    addMessage('user', text);
    setInput('');
    setLoading(true);

    try {
      // Use LLM with internet search to find properties from realtor.com
      const response = await InvokeLLM({
        prompt: `You are a real estate assistant for Tampa Bay, Florida (Tampa, Clearwater, St. Petersburg, Pinellas County).

User query: "${text}"

Search realtor.com for current property listings matching the user's criteria in the Tampa Bay area. Include the MLS number for each property.

Provide helpful, accurate information about available properties. If this is a property search, find real listings and include details like price, address, beds, baths, sqft, and MLS#.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            message: { type: "string", description: "Your response to the user" },
            is_search_query: { type: "boolean", description: "True if user is searching for properties" },
            listings: { 
              type: "array", 
              items: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  city: { type: "string" },
                  price: { type: "string" },
                  beds: { type: "number" },
                  baths: { type: "number" },
                  sqft: { type: "string" },
                  mls_number: { type: "string" },
                  property_type: { type: "string" }
                }
              },
              description: "Array of property listings found. Empty if not a search query."
            }
          },
          required: ["message", "is_search_query", "listings"]
        }
      });

      if (response.is_search_query && response.listings && response.listings.length > 0) {
        addMessage('bot', response.message, response.listings.slice(0, 5));
      } else {
        addMessage('bot', response.message);
      }

    } catch (err) {
      console.error(err);
      addMessage('bot', "I'm sorry, I encountered an issue processing your request. Please try again or contact us directly at (727) 492-6291.");
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {open && (
        <div className="w-80 md:w-96 shadow-2xl rounded-2xl overflow-hidden bg-white mb-4 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Home Place Florida</div>
                <div className="text-xs opacity-90">Real Estate Assistant</div>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={messagesRef} 
            className="h-96 p-4 overflow-y-auto bg-slate-50 space-y-4"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] ${m.from === 'bot' ? '' : ''}`}>
                  <div className={`p-3 rounded-2xl ${m.from === 'bot' ? 'bg-white shadow-sm' : 'bg-amber-500 text-white'}`}>
                    <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                  </div>
                  
                  {/* Property Cards */}
                  {m.listings && m.listings.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.listings.map((listing, idx) => (
                        <div 
                          key={idx}
                          className="bg-white rounded-xl shadow-sm overflow-hidden p-3"
                        >
                          <div className="font-semibold text-amber-600">{listing.price}</div>
                          <div className="text-sm font-medium text-slate-900">{listing.address}</div>
                          <div className="text-xs text-slate-500">{listing.city}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            {listing.beds} bd • {listing.baths} ba {listing.sqft && `• ${listing.sqft}`}
                          </div>
                          {listing.mls_number && (
                            <div className="text-xs text-slate-400 mt-1 font-mono">MLS# {listing.mls_number}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm p-3 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Searching...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about homes..."
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
              <button 
                disabled={loading || !input.trim()} 
                type="submit" 
                className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!open && (
        <button 
          onClick={() => setOpen(true)} 
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}