import React, { useState, useRef, useEffect } from "react";
import { Trash2, Plus, Image as ImageIcon, Save, CheckCircle, RefreshCcw, LayoutGrid, Sparkles, Upload } from "lucide-react";

export default function PromoPanel() {
  const STORAGE_KEY = "promoDeals";

  const defaultPromoData = [
    { id: 101, title: "Art of Dining", description: "Discover Flavors Beyond Boundaries", imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80", tag: "Seasonal Menu" },
    { id: 102, title: "Purely Organic", description: "Farm to Fork, Every Single Day", imageUrl: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600", tag: "Freshly Picked" },
    { id: 103, title: "Chef's Special", description: "Handcrafted Culinary Masterpieces", imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80", tag: "Must Try" },
    { id: 104, title: "Midnight Feast", description: "The best flavors for the night owl", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80", tag: "Late Night" },
    { id: 105, title: "Dessert Heaven", description: "Sweet endings to beautiful stories", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1600&q=80", tag: "Sweet Treats" }
  ];

  const [promos, setPromos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Strip any old isActive properties for cleanliness
      return parsed.map(p => {
        const { isActive, ...rest } = p;
        return rest;
      });
    }
    return defaultPromoData;
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const handleReset = () => {
    if (window.confirm("Restore defaults?")) {
      setPromos(defaultPromoData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPromoData));
      window.dispatchEvent(new Event("promosUpdated"));
    }
  };

  const saveToLocal = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promos));
    setShowSuccess(true);
    window.dispatchEvent(new Event("promosUpdated"));
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromos(promos.map(p => p.id === activeId ? { ...p, imageUrl: reader.result } : p));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 pb-40 font-sans text-black">
      <div className="max-w-6xl mx-auto">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutGrid size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter leading-none">Deal Lab</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-2 italic">Creative Studio</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleReset} className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-all">
              <RefreshCcw size={20} className="text-gray-400" />
            </button>
            <button 
              onClick={() => setPromos([...promos, { id: Date.now(), title: "", description: "", imageUrl: "", tag: "NEW" }])} 
              className="px-8 py-4 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center gap-3"
            >
              <Plus size={18} strokeWidth={3} /> Add Card
            </button>
          </div>
        </header>

        {/* --- GRID (White Background Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {promos.map((promo) => (
            <div key={promo.id} className="group relative bg-white border-2 border-gray-100 rounded-[2.5rem] p-5 transition-all hover:border-black shadow-sm hover:shadow-2xl">
              
              {/* IMAGE AREA */}
              <div 
                onClick={() => { setActiveId(promo.id); fileInputRef.current.click(); }}
                className="relative aspect-[4/3] bg-gray-50 rounded-[1.8rem] overflow-hidden mb-6 border border-gray-100 cursor-pointer"
              >
                {promo.imageUrl ? (
                  <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300">
                    <Upload size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Media Upload</span>
                  </div>
                )}
              </div>

              {/* TEXT INPUTS (Pure White & Black) */}
              <div className="px-1 pb-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    placeholder="Enter heading..."
                    value={promo.title} 
                    onChange={(e) => setPromos(promos.map(p => p.id === promo.id ? {...p, title: e.target.value} : p))}
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-black focus:border-black outline-none transition-all placeholder:text-gray-200" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Caption</label>
                  <textarea 
                    placeholder="Describe this offer..."
                    value={promo.description} 
                    onChange={(e) => setPromos(promos.map(p => p.id === promo.id ? {...p, description: e.target.value} : p))}
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-600 font-medium h-24 resize-none focus:border-black outline-none transition-all placeholder:text-gray-200"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-gray-400" />
                    <input 
                      value={promo.tag || ""}
                      onChange={(e) => setPromos(promos.map(p => p.id === promo.id ? {...p, tag: e.target.value} : p))}
                      className="text-[10px] font-black uppercase text-black bg-transparent border-none outline-none w-24"
                      placeholder="TAG"
                    />
                  </div>
                  <button 
                    onClick={() => setPromos(promos.filter(p => p.id !== promo.id))} 
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- STICKY FOOTER (Glass Light Mode) --- */}
        <div className="fixed bottom-10 inset-x-0 flex justify-center px-6 z-50 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 p-2 rounded-[2.5rem] shadow-2xl pointer-events-auto">
            <button 
              onClick={saveToLocal}
              className={`px-14 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 transition-all ${showSuccess ? "bg-emerald-500 text-white" : "bg-black text-white hover:bg-gray-800"}`}
            >
              {showSuccess ? <CheckCircle size={20} /> : <Save size={20} />}
              {showSuccess ? "Published Successfully" : "Deploy To Live Website"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}