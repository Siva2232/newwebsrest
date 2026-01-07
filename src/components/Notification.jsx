import React, { useEffect, useRef, useState } from "react";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  Clock,
  ArrowRight,
  X,
  Zap,
  Ticket
} from "lucide-react";

export default function Notification() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Filter for Preparing/Pending orders
  const pendingOrders = orders
    .filter((o) => o.status === "Preparing" || o.status === "Pending")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {/* --- Trigger Button --- */}
      <button
        onClick={() => setOpen(!open)}
        className={`group relative p-3 rounded-2xl transition-all duration-500 ${
          open ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-600'
        }`}
      >
        <Bell className={`w-6 h-6 ${open ? 'animate-none' : 'group-hover:rotate-12 transition-transform'}`} />
        {pendingOrders.length > 0 && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* --- Notification Panel --- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed sm:absolute right-4 sm:right-0 left-4 sm:left-auto sm:mt-4 w-auto sm:w-[400px] top-20 sm:top-auto bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/50 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden z-50 origin-top-right"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 pb-4 flex items-center justify-between bg-gradient-to-b from-slate-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Zap size={18} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-none">Incoming</h3>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      {pendingOrders.length} Orders Pending
                    </p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              {/* List */}
              <div className="px-3 sm:px-4 pb-4 max-h-[60vh] sm:max-h-[450px] overflow-y-auto no-scrollbar">
                {pendingOrders.length === 0 ? (
                  <div className="py-16 sm:py-20 text-center space-y-4">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="text-slate-200" size={32} strokeWidth={1} />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">No new activity</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {pendingOrders.map((order, idx) => (
                      <NotificationItem 
                        key={order.id} 
                        order={order} 
                        idx={idx} 
                        onClick={() => { navigate("/admin/orders"); setOpen(false); }} 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* View All Footer */}
              {pendingOrders.length > 0 && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                  <button 
                    onClick={() => { navigate("/admin/orders"); setOpen(false); }}
                    className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    Enter Orders Portal <ArrowRight size={14} />
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

const NotificationItem = ({ order, idx, onClick }) => {
  const [timeAgo, setTimeAgo] = useState("Just now");
  const total = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // REAL-TIME UPDATE LOGIC
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const created = new Date(order.createdAt);
      const diffInSeconds = Math.floor((now - created) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo("Just now");
      } else if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        setTimeAgo(`${mins}m ago`);
      } else {
        const hours = Math.floor(diffInSeconds / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };

    calculateTime(); // Initial call
    const timer = setInterval(calculateTime, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, [order.createdAt]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      onClick={onClick}
      className="group relative p-3 sm:p-4 bg-white rounded-[1.5rem] sm:rounded-[1.8rem] border border-slate-100 active:bg-slate-50 sm:hover:border-indigo-200 transition-all cursor-pointer overflow-hidden"
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
            <Ticket size={16} className="text-slate-400 group-hover:text-indigo-600" />
          </div>
          <div>
            <p className="font-black text-slate-900 tracking-tight text-sm sm:text-base">Table {order.table}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[8px] sm:text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">New Order</span>
              <span className="text-[8px] sm:text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Clock size={10} /> {timeAgo}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-slate-900 tracking-tight text-sm sm:text-base">₹{total}</p>
          <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">{order.items.length} Items</p>
        </div>
      </div>
    </motion.div>
  );
};