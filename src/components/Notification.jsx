import React, { useEffect, useRef, useState } from "react";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  ArrowRight,
  X,
  Zap,
  Ticket,
  CheckCircle2,
  Trash2,
  ChefHat
} from "lucide-react";

export default function Notification() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [isNewOrder, setIsNewOrder] = useState(false); // For visual pulse
  const ref = useRef(null);

  // --- AUDIO CONFIGURATION ---
  // Using a "Kitchen Service Bell" sound for a realistic restaurant vibe
  const audioRef = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2847/2847-preview.mp3"));

  const pendingOrders = orders
    .filter((o) => (o.status === "Preparing" || o.status === "Pending") && !dismissedIds.includes(o.id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // --- NEW ORDER DETECTION ---
  const lastOrderCount = useRef(pendingOrders.length);
  
  useEffect(() => {
    if (pendingOrders.length > lastOrderCount.current) {
      // 1. Play Kitchen Bell Sound
      audioRef.current.currentTime = 0; // Reset sound to start
      audioRef.current.play().catch(() => console.log("User interaction required for sound"));

      // 2. Trigger Visual Alert (Pulse)
      setIsNewOrder(true);
      setTimeout(() => setIsNewOrder(false), 3000); // Pulse for 3 seconds
    }
    lastOrderCount.current = pendingOrders.length;
  }, [pendingOrders.length]);

  const markAsRead = (id) => setDismissedIds(prev => [...prev, id]);
  const clearAll = () => setDismissedIds(prev => [...prev, ...pendingOrders.map(o => o.id)]);

  return (
    <div className="relative" ref={ref}>
      {/* --- Visual Bell Trigger --- */}
      <button
        onClick={() => setOpen(!open)}
        className={`group relative p-3 rounded-2xl transition-all duration-500 ${
          open ? 'bg-zinc-900 text-white shadow-xl' : 'hover:bg-zinc-100 text-zinc-600'
        }`}
      >
        <motion.div
          animate={isNewOrder ? { 
            rotate: [0, -20, 20, -20, 20, 0],
            scale: [1, 1.2, 1]
          } : {}}
          transition={{ duration: 0.5, repeat: isNewOrder ? 3 : 0 }}
        >
          <Bell className="w-6 h-6" />
        </motion.div>

        {pendingOrders.length > 0 && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isNewOrder ? 'bg-orange-400' : 'bg-rose-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 border-2 border-white ${isNewOrder ? 'bg-orange-500' : 'bg-rose-500'}`}></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
              className="fixed sm:absolute right-4 sm:right-0 w-[calc(100vw-32px)] sm:w-[420px] top-20 sm:top-16 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-zinc-100 rounded-[2.5rem] overflow-hidden z-50 origin-top-right"
            >
              {/* Header with Clear All */}
              <div className="p-6 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                    <ChefHat size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-zinc-900 tracking-tight leading-none">New Orders</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 mt-1.5">Kitchen Feed</p>
                  </div>
                </div>
                
                {pendingOrders.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-50 text-zinc-400 hover:text-rose-500 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Order List */}
              <div className="p-4 max-h-[480px] overflow-y-auto no-scrollbar">
                <AnimatePresence mode="popLayout">
                  {pendingOrders.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                      <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="text-zinc-200" size={32} strokeWidth={1} />
                      </div>
                      <p className="text-zinc-400 font-bold text-sm">Kitchen is clear</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {pendingOrders.map((order, idx) => (
                        <OrderItem 
                          key={order.id} 
                          order={order} 
                          idx={idx} 
                          onMarkRead={() => markAsRead(order.id)}
                          onView={() => { navigate("/admin/orders"); setOpen(false); }}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* View Portal Button */}
              {pendingOrders.length > 0 && (
                <div className="p-4 bg-zinc-50/50 border-t border-zinc-50">
                  <button 
                    onClick={() => { navigate("/admin/orders"); setOpen(false); }}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Manage All Orders <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const OrderItem = ({ order, idx, onMarkRead, onView }) => {
  const total = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="group bg-white rounded-[2rem] border border-zinc-100 hover:border-orange-200 transition-all p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div onClick={onView} className="flex-1 cursor-pointer flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex flex-col items-center justify-center group-hover:bg-orange-50 transition-colors">
            <Ticket size={18} className="text-zinc-400 group-hover:text-orange-600" />
          </div>
          <div>
            <p className="font-black text-zinc-900 text-base">Table {order.table}</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {order.items.length} Items • ₹{total}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
          className="p-3 text-zinc-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all"
        >
          <CheckCircle2 size={24} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
};