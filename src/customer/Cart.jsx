import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { generateId } from "../utils/generateId";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  ShoppingBag, Trash2, Plus, Minus, ChevronLeft, 
  CheckCircle2, ReceiptText, ArrowRight, MessageSquare, UtensilsCrossed
} from "lucide-react";
import confetti from 'canvas-confetti';

export default function Cart() {
  const {
    cart, table, setTable, clearCart,
    totalAmount, updateQuantity, removeFromCart,
  } = useCart();

  const { addOrder } = useOrders();
  const navigate = useNavigate();

  // State Management
  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedDetails, setPlacedDetails] = useState(null);
  const [isSwiped, setIsSwiped] = useState(false);
  const [dragConstraints, setDragConstraints] = useState(0);

  // Swipe Animation Logic
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const textOpacity = useTransform(x, [0, 150], [0.4, 0]);

  // Dynamically calculate swipe width based on device screen
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setDragConstraints(containerWidth - 64 - 16); // handle width - padding
    }
  }, [cart]);

  const placeOrder = () => {
    if (!table || cart.length === 0) return;
    
    const orderId = generateId("ORD");
    localStorage.setItem("lastOrderId", orderId);

    const details = { 
      id: orderId, 
      table, 
      items: [...cart], 
      status: "Preparing", 
      createdAt: new Date().toISOString(), 
      notes: notes.trim() 
    };

    addOrder(details);
    setPlacedDetails({ orderId, table, total: totalAmount });
    
    setTimeout(() => {
        clearCart();
        setShowSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#10b981', '#fb923c', '#ffffff']
        });
    }, 300);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > dragConstraints * 0.8) {
      setIsSwiped(true);
      placeOrder();
    } else {
      setIsSwiped(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      
      {/* 1. Header Navigation */}
      <nav className="sticky top-0 z-[60] bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to={`/menu${table ? `?table=${table}` : ""}`} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-slate-900" />
          </Link>
          <div className="text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Checkout</h1>
            <p className="text-sm font-black text-slate-900 uppercase italic leading-none mt-1">Review Items</p>
          </div>
          <div className="w-10 flex justify-end">
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Main Content (Scrollable) */}
      {/* pb-64 ensures content isn't hidden by the floating swipe bar */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 pt-8 pb-64">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <SuccessView key="success" details={placedDetails} navigate={navigate} />
          ) : cart.length === 0 ? (
            <EmptyView key="empty" table={table} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              
              {/* Table Selection Card */}
              <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <UtensilsCrossed size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Serving At</p>
                    <p className="text-lg font-black uppercase italic">Table {table || '??'}</p>
                  </div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
                  <span className="text-[10px] font-black text-orange-400">EDIT</span>
                  <input 
                    type="number" 
                    value={table || ""} 
                    onChange={(e) => setTable(e.target.value)}
                    className="w-8 bg-transparent font-black text-center outline-none border-b border-orange-400/50"
                  />
                </div>
              </div>

              {/* Dish List */}
              <div className="space-y-4">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Order Summary</h2>
                {cart.map((item) => (
                  <motion.div layout key={item.id} className="flex gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative w-20 h-20 shrink-0">
                        <img src={item.image} className="w-full h-full rounded-2xl object-cover" alt="" />
                        <div className={`absolute -top-1 -left-1 w-4 h-4 border-2 bg-white flex items-center justify-center ${item.type === 'veg' ? 'border-emerald-500' : 'border-red-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'veg' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-black text-slate-900 text-sm uppercase">{item.name}</h3>
                      <p className="text-slate-400 font-bold text-[11px] mb-2 uppercase">₹{item.price}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center"><Minus size={12}/></button>
                          <span className="w-8 text-center text-xs font-black">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center"><Plus size={12}/></button>
                        </div>
                        <p className="font-black text-slate-900 text-sm italic">₹{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cooking Notes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2 text-slate-400">
                    <MessageSquare size={14} />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Kitchen Notes</h2>
                </div>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Extra spicy, no onions..."
                  className="w-full bg-white border border-slate-100 shadow-sm rounded-3xl p-5 text-sm min-h-[100px] outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Floating Swipe Bar (Elevated for Mobile Bottom Bars) */}
      {!showSuccess && cart.length > 0 && (
<div className="fixed bottom-20 sm:bottom-0 inset-x-0 p-6 z-[100]">
          <div className="max-w-md mx-auto">
            
            <div className="flex justify-between items-end mb-4 px-6">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Grand Total</p>
                <p className="text-2xl font-black text-slate-900 italic tracking-tighter">₹{totalAmount.toLocaleString()}</p>
              </div>
              {!table && <span className="text-[10px] font-black text-rose-500 animate-bounce">ENTER TABLE #</span>}
            </div>

            <div 
              ref={containerRef}
              className={`relative h-20 p-2 rounded-[2.5rem] flex items-center transition-all duration-500 shadow-2xl overflow-hidden ${
                table ? 'bg-slate-900' : 'bg-slate-100 grayscale pointer-events-none'
              }`}
            >
              <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Swipe to Order</p>
              </motion.div>

              <motion.div
                drag="x"
                x={x}
                dragConstraints={{ left: 0, right: dragConstraints }}
                dragElastic={0.05}
                dragSnapToOrigin={!isSwiped}
                onDragEnd={handleDragEnd}
                className="relative z-10 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
              >
                {isSwiped ? <CheckCircle2 className="text-white" size={24} strokeWidth={3} /> : <ArrowRight className="text-white animate-pulse" size={24} strokeWidth={3} />}
              </motion.div>
              <motion.div className="absolute left-0 top-0 bottom-0 bg-orange-500/10" style={{ width: x }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SuccessView = ({ details, navigate }) => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
    <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-[3rem] animate-pulse" />
        <div className="relative w-full h-full bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
            <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>
    </div>
    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Order Placed!</h2>
    <p className="text-slate-400 text-sm mt-4 mb-10 px-10">We've sent your request to the kitchen for Table <span className="text-slate-900 font-black">#{details.table}</span>.</p>
    <div className="space-y-4 max-w-xs mx-auto">
        <button onClick={() => navigate("/order-summary")} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
            Track Status <ReceiptText size={18} />
        </button>
        <button onClick={() => navigate("/menu")} className="w-full text-slate-400 py-4 font-black uppercase tracking-widest text-[10px] hover:text-slate-900">
            Add More Dishes
        </button>
    </div>
  </motion.div>
);

const EmptyView = ({ table }) => (
  <div className="text-center py-24">
    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={40} className="text-slate-200" />
    </div>
    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cart is empty</h3>
    <Link to={`/menu?table=${table}`} className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg mt-6">
      Back to Menu
    </Link>
  </div>
);