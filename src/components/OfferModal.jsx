import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, BellRing } from "lucide-react";

export default function OfferModal({ offerData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [offers, setOffers] = useState(offerData || []);

  const STORAGE_KEY = "promoDeals";
  const SLIDE_DURATION = 4500; // 4.5 seconds per slide

  // --- DATA LOADING & SYNC ---
  useEffect(() => {
    const loadOffers = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setOffers(parsed);
        } catch (e) { console.error("Sync error", e); }
      }
    };

    if (!offerData || offerData.length === 0) {
      loadOffers();
      window.addEventListener("promosUpdated", loadOffers);
    } else {
      setOffers(offerData);
    }
    return () => window.removeEventListener("promosUpdated", loadOffers);
  }, [offerData]);

  // --- OPEN MODAL DELAY ---
  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem("hasSeenOffer");
    if (offers.length > 0 && !hasSeenOffer) {
      const timer = setTimeout(() => setIsOpen(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [offers]);

  // --- STABLE NAVIGATION LOGIC ---
  const handleNext = useCallback(() => {
    setSlideProgress(0); // Reset progress immediately
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  }, [offers.length]);

  const handlePrev = useCallback(() => {
    setSlideProgress(0);
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  }, [offers.length]);

  // --- AUTO-PLAY TIMER ---
  useEffect(() => {
    if (!isOpen || offers.length <= 1) return;

    const step = 50;
    const interval = setInterval(() => {
      setSlideProgress((p) => {
        if (p >= 100) {
          handleNext(); // Move to next via the stable function
          return 0;
        }
        return p + (100 / (SLIDE_DURATION / step));
      });
    }, step);

    return () => clearInterval(interval);
  }, [isOpen, handleNext, offers.length]);

  const closeOffer = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenOffer", "true");
  };

  if (offers.length === 0) return null;
  const current = offers[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOffer}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Story Card Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-[320px] aspect-[10/14] bg-black overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 z-10"
          >
            {/* Top Instagram Progress Bars */}
            <div className="absolute top-4 inset-x-5 z-50 flex gap-1.5">
              {offers.map((_, i) => (
                <div key={i} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    style={{ 
                      width: i === currentIndex ? `${slideProgress}%` : i < currentIndex ? "100%" : "0%" 
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Tap Zones for Navigation (Fixes skipping issue) */}
            <div className="absolute inset-0 z-40 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
              <div className="w-2/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
            </div>

            {/* Slide Animation (X-axis movement) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <img src={current.imageUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-6 inset-x-6 z-50 pointer-events-none">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1 bg-white text-black px-2 py-0.5 rounded-md">
                      <Sparkles size={10} className="fill-black" />
                      <span className="text-[9px] font-black uppercase">{current.tag || "OFFER"}</span>
                    </div>
                    <h2 className="text-white text-2xl font-black uppercase italic leading-none tracking-tighter">
                      {current.title}
                    </h2>
                    <p className="text-slate-300 text-[11px] font-medium leading-relaxed line-clamp-2">
                      {current.description}
                    </p>
                    <button 
                      onClick={closeOffer}
                      className="pointer-events-auto w-full mt-2 py-3 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      View Now <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Close Button */}
            <button onClick={closeOffer} className="absolute top-8 right-4 z-[60] p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all">
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}