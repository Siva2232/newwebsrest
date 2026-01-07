import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import OfferModal from "../components/OfferModal";

export default function CustomerLayout() {
  const [activeOffers, setActiveOffers] = useState([]);

  useEffect(() => {
    const loadOffers = () => {
      // FIX: Use "promoDeals" to match your PromoPanel STORAGE_KEY
      const saved = localStorage.getItem("promoDeals");
      if (saved) {
        setActiveOffers(JSON.parse(saved));
      }
    };

    loadOffers(); 
    
    // FIX: Listen for "promosUpdated" event from your PromoPanel
    window.addEventListener("promosUpdated", loadOffers);
    return () => window.removeEventListener("promosUpdated", loadOffers);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar title="MY CAFE" />
      
      {/* This component now waits 6 seconds internally before showing */}
      <OfferModal offerData={activeOffers} />

      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </div>
  );
}