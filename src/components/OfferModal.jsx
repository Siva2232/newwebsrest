import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";

export default function OfferModal({ offerData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [offers, setOffers] = useState([]);

  const STORAGE_KEY = "promoDeals";
  const SLIDE_DURATION = 5000;

  // Default mock data (shown on first visit when localStorage is empty)
  const defaultOffers = [
    { 
      id: 101, 
      title: "Art of Dining", 
      description: "Discover Flavors Beyond Boundaries", 
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80", 
      tag: "Seasonal Menu"
    },
    { 
      id: 102, 
      title: "Purely Organic", 
      description: "Farm to Fork, Every Single Day", 
      imageUrl: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600", 
      tag: "Freshly Picked"
    },
    { 
      id: 103, 
      title: "Chef's Special", 
      description: "Handcrafted Culinary Masterpieces", 
      imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80", 
      tag: "Must Try"
    },
    { 
      id: 104, 
      title: "Midnight Feast", 
      description: "The best flavors for the night owl", 
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80", 
      tag: "Late Night"
    },
    { 
      id: 105, 
      title: "Dessert Heaven", 
      description: "Sweet endings to beautiful stories", 
      imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1600&q=80", 
      tag: "Sweet Treats"
    }
  ];

  // --- DATA LOADING & SYNC ---
  useEffect(() => {
    const loadOffers = () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved === null) {
        // First visit ever → show default mock data
        setOffers(defaultOffers);
      } else {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Filter: only published (fallback true) + complete cards (has image + title)
            const valid = parsed.filter(
              (p) => (p.isPublished ?? true) && p.imageUrl && p.title?.trim()
            );
            setOffers(valid);
          } else {
            setOffers([]);
          }
        } catch (e) {
          console.error("Failed to parse promo data", e);
          setOffers(defaultOffers); // Fallback to defaults on corruption
        }
      }
    };

    if (offerData && offerData.length > 0) {
      // Preview mode (e.g., admin passing prop) → show exactly what's passed, no filtering
      setOffers(offerData);
    } else {
      // Live mode → load from localStorage with fallback
      loadOffers();
      window.addEventListener("promosUpdated", loadOffers);
      return () => window.removeEventListener("promosUpdated", loadOffers);
    }
  }, [offerData]);

  // Reset to first slide when offers change
  useEffect(() => {
    setCurrentIndex(0);
    setSlideProgress(0);
  }, [offers.length]);

  // --- OPEN MODAL DELAY ---
  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem("hasSeenOffer");
    if (offers.length > 0 && !hasSeenOffer) {
      const timer = setTimeout(() => setIsOpen(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [offers.length]);

  // --- NAVIGATION ---
  const handleNext = useCallback(() => {
    setSlideProgress(0);
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  }, [offers.length]);

  const handlePrev = useCallback(() => {
    setSlideProgress(0);
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  }, [offers.length]);

  // --- AUTO-PLAY ---
  useEffect(() => {
    if (!isOpen || offers.length <= 1) return;

    const step = 50;
    const interval = setInterval(() => {
      setSlideProgress((p) => {
        if (p >= 100) {
          handleNext();
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOffer}
            className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-auto"
          />

          {/* Story Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-[340px] aspect-[10/14] bg-black overflow-hidden rounded-3xl shadow-2xl border border-white/10 pointer-events-auto"
          >
            {/* Progress Bars */}
            <div className="absolute top-5 inset-x-6 z-50 flex gap-1.5">
              {offers.map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    animate={{
                      width: i === currentIndex ? `${slideProgress}%` : i < currentIndex ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ))}
            </div>

            {/* Tap Zones */}
            <div className="absolute inset-0 z-40 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
              <div className="w-2/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
            </div>

            {/* Slide Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <img src={current.imageUrl} alt={current.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-8 inset-x-6 z-50">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-white text-black px-3 py-1 rounded-full">
                      <Sparkles size={12} className="fill-black" />
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {current.tag || "Special Offer"}
                      </span>
                    </div>
                    <h2 className="text-white text-3xl font-black uppercase italic leading-none tracking-tighter">
                      {current.title}
                    </h2>
                    <p className="text-white/90 text-sm font-medium leading-relaxed">
                      {current.description}
                    </p>
                    <button
                      onClick={closeOffer}
                      className="w-full mt-4 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                      Got It <ArrowRight size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Close */}
            <button
              onClick={closeOffer}
              className="absolute top-5 right-5 z-60 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}