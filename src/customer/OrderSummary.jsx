import { useOrders } from "../context/OrderContext";
import { useNavigate, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import OrderProgress from "../components/OrderProgress";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  ChevronLeft, 
  RotateCcw, 
  Timer, 
  Receipt, 
  Sparkles, 
  ArrowRight,
  BellRing
} from "lucide-react";

export default function OrderSummary() {
  const { orders } = useOrders();
  const navigate = useNavigate();

  // Primary: Find by ID, Secondary: Most recent order
  const lastOrderId = localStorage.getItem("lastOrderId");
  const order = orders.find((o) => o.id === lastOrderId) || orders[orders.length - 1];

  useEffect(() => {
    if (order?.status === "Served") {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#10b981']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#10b981']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center bg-[#F8FAFC]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8"
        >
          <Receipt size={40} className="text-slate-300" />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">NO ACTIVE ORDER</h2>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed max-w-[260px]">
          We couldn't find your receipt. This happens if the session expired or no order was placed.
        </p>
        <Link to="/menu" className="w-full max-w-[200px] bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all">
          Browse Menu
        </Link>
      </div>
    );
  }

  const totalAmount = order.items?.reduce((sum, i) => sum + (i.price * i.qty), 0) || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* --- PREMIUM GLASS NAVBAR --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/menu")} 
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={22} className="text-slate-900" />
          </button>
          <div className="text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-0.5 flex items-center justify-center gap-1">
              <Sparkles size={10} /> Live Tracking
            </h1>
            <p className="text-sm font-bold text-slate-900">Order Summary</p>
          </div>
          <button className="p-2 -mr-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <BellRing size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 pb-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden"
        >
          {/* ID & Table Header */}
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150">
              <Receipt size={100} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <span className="inline-block px-2 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 text-slate-300">
                  Transaction Hash
                </span>
                <p className="text-lg font-mono font-bold tracking-tighter uppercase">
                  {order.id.slice(-10)}
                </p>
                <div className="flex items-center gap-2 text-slate-400 mt-2">
                  <Timer size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {format(new Date(order.createdAt), "h:mm a • MMM d")}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Table</span>
                <p className="text-6xl font-black tracking-tighter leading-none">#{order.table}</p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="p-8 border-b border-slate-50">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Current Phase</span>
              <StatusBadge status={order.status} />
            </div>
            <OrderProgress status={order.status} />
          </div>

          {/* Item Manifest */}
          <div className="p-8 space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Order Manifest</h3>
            <div className="space-y-5">
              {order.items.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.id} 
                  className="flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 shadow-sm">
                    <img 
                      src={item.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] font-black text-indigo-500 mt-0.5 uppercase tracking-wider">
                      {item.qty} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-black text-slate-900 font-mono">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="p-8 bg-slate-50/50 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Payable</p>
                <p className="text-xs font-bold text-slate-500">Incl. all taxes & charges</p>
              </div>
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Dynamic Cooking Notes */}
          {order.notes && (
            <div className="m-6 mt-0 p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 flex gap-4 items-start">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shrink-0 shadow-lg shadow-indigo-100">
                <Receipt size={14} />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Kitchen Request</p>
                <p className="text-xs text-slate-600 italic leading-relaxed">"{order.notes}"</p>
              </div>
            </div>
          )}
        </motion.div>

        <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          Pulse Server Connection: Active 📡
        </p>
      </main>

      {/* --- FLOATING BOTTOM ACTION BAR --- */}
      <div className="fixed bottom-0 inset-x-0 p-6 z-50 mb-19 lg:mb-0 lg:relative lg:p-0">
        <div className="max-w-md mx-auto">
          <motion.div 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 mt-25"></div>
            <Link 
              to={`/menu?table=${order.table}`} 
              className="relative flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all"
            >
              <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
              Add More Items
              <ArrowRight size={14} className="opacity-50" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}