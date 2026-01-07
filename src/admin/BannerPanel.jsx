import React, { useState, useRef } from "react";
import { Trash2, Plus, RefreshCcw, Layout, Upload } from "lucide-react";

export default function BannerPanel() {
  const STORAGE_KEY = "bannerSlides";

  const defaultSlides = [
    { id: 1, title: "Art of Dining", description: "Discover Flavors Beyond Boundaries", imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80", tag: "Seasonal Menu" },
    { id: 2, title: "Purely Organic", description: "Farm to Fork, Every Single Day", imageUrl: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600", tag: "Fresh" },
    { id: 3, title: "Chef's Special", description: "Handcrafted Culinary Masterpieces", imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80", tag: "Must Try" },
    { id: 4, title: "Midnight Feast", description: "The best flavors for the night owl", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80", tag: "Late Night" },
    { id: 5, title: "Dessert Heaven", description: "Sweet endings to beautiful stories", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1600&q=80", tag: "Sweet" }
  ];

  const [slides, setSlides] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(s => {
        const { isActive, ...rest } = s;
        return rest;
      });
    }
    return defaultSlides;
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [activeUploadId, setActiveUploadId] = useState(null);

  const updateField = (id, field, value) => {
    setSlides(prev => prev.map(slide => slide.id === id ? { ...slide, [field]: value } : slide));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (activeUploadId) updateField(activeUploadId, "imageUrl", reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const saveToLocal = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    setShowSuccess(true);
    window.dispatchEvent(new Event("bannersUpdated"));
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Restore default banners?")) {
      setSlides(defaultSlides);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSlides));
      window.dispatchEvent(new Event("bannersUpdated"));
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 pb-44 font-sans text-black">
      <div className="max-w-5xl mx-auto">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        
        {/* --- SHARP HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-100 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <Layout size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-none">Banner Lab</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-1">Management Console</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleReset} className="p-4 bg-white border border-gray-200 hover:border-black transition-colors">
                <RefreshCcw size={18} className="text-black" />
            </button>
            <button 
              onClick={() => setSlides([...slides, { id: Date.now(), title: "", description: "", imageUrl: "", tag: "NEW" }])} 
              className="bg-black text-white px-8 py-4 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-gray-800 transition-all shadow-lg"
            >
                <Plus size={18} /> New Slide
            </button>
          </div>
        </header>

        {/* --- BANNER LIST (Zero Blur, High Clarity) --- */}
        <div className="space-y-6">
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="bg-white border-2 border-gray-200 p-6 transition-all hover:border-black hover:shadow-xl rounded-2xl"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* PREVIEW BOX – No border, no extra background, larger & rounded for less "white space" feel */}
                <div 
                  onClick={() => { setActiveUploadId(slide.id); fileInputRef.current.click(); }} 
                  className="relative w-full lg:w-96 aspect-[5/3] bg-gray-50 overflow-hidden cursor-pointer rounded-2xl"
                >
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Upload size={40} className="mb-4" />
                      <span className="text-sm font-bold uppercase tracking-wide">Click to Upload</span>
                    </div>
                  )}
                </div>

                {/* DATA AREA */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Heading</label>
                      <input 
                        value={slide.title} 
                        onChange={(e) => updateField(slide.id, "title", e.target.value)} 
                        className="w-full bg-white border border-gray-100 px-4 py-3 font-bold text-sm focus:border-black outline-none transition-all rounded-lg"
                        placeholder="Banner Title"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tagline</label>
                      <input 
                        value={slide.tag} 
                        onChange={(e) => updateField(slide.id, "tag", e.target.value)} 
                        className="w-full bg-white border border-gray-100 px-4 py-3 font-bold text-sm text-black focus:border-black outline-none transition-all rounded-lg"
                        placeholder="Tag Text"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detailed Description</label>
                        <textarea 
                          value={slide.description} 
                          onChange={(e) => updateField(slide.id, "description", e.target.value)} 
                          className="w-full bg-white border border-gray-100 px-4 py-3 font-medium text-sm text-gray-600 focus:border-black outline-none transition-all rounded-lg resize-none h-24"
                          placeholder="Short sentence describing this slide..."
                        />
                    </div>
                  </div>

                  {/* BOTTOM ACTIONS – Only delete, right-aligned, tighter spacing */}
                  <div className="flex items-center justify-end mt-6">
                    <button 
                      onClick={() => setSlides(slides.filter(o => o.id !== slide.id))} 
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* --- SOLID ACTION BAR --- */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 p-8 pointer-events-none">
          <div className="bg-white border border-gray-200 p-2 shadow-2xl pointer-events-auto">
            <button 
              onClick={saveToLocal} 
              className={`px-20 py-5 font-black uppercase text-[11px] tracking-[0.4em] transition-all ${showSuccess ? 'bg-emerald-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {showSuccess ? "Update Successful" : "Publish Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}