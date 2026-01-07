import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, Check } from "lucide-react"; // Added for better UI

/* ---------- Veg / Non-Veg Icon ---------- */
function FoodTypeIcon({ type }) {
  const isVeg = type === "veg";
  return (
    <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${isVeg ? "border-green-600" : "border-red-600"}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </div>
  );
}

export default function ProductCard({ product, onAdd, onRemove, initialQty = 0 }) {
  const {
    name,
    description,
    price,
    image,
    available = true,
    type = "veg",
  } = product;

  // Track quantity locally for the UI transition
  const [quantity, setQuantity] = useState(initialQty);
  const [showCheck, setShowCheck] = useState(false);

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!available) return;

    setQuantity(prev => prev + 1);
    onAdd(product); // Existing logic to update global cart context
    
    // Show splash effect only on first add
    if (quantity === 0) {
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 800);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
      // Assuming you have a remove/update function in your context
      if (onRemove) onRemove(product.id); 
    }
  };

  return (
    <motion.div
      className="relative rounded-[2rem] overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      animate={available ? {} : { x: [0, -5, 5, -5, 5, 0] }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative aspect-[4/5]">
        {/* Image */}
        <img
          src={image || "https://via.placeholder.com/600x800"}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            !available ? "grayscale contrast-90" : "hover:scale-110"
          }`}
        />

        {/* Veg / Non-Veg Icon */}
        <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-sm">
          <FoodTypeIcon type={type} />
        </div>

        {/* OUT OF STOCK Overlay */}
        <AnimatePresence>
          {!available && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-[2px]"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="bg-white px-6 py-3 rounded-2xl shadow-2xl text-slate-900 font-black text-sm uppercase tracking-widest"
              >
                Sold Out
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Info Gradient */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-6 pt-20">
          <h3 className="text-white text-lg font-black leading-tight tracking-tight line-clamp-1">{name}</h3>

          {description && (
            <p className="text-slate-300/90 text-[10px] font-medium mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-2xl font-black tracking-tighter">
                ₹{price}
              </span>
            </div>

            {/* --- SMART QUANTITY TOGGLE --- */}
            {available && (
              <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                  {quantity === 0 ? (
                    /* Initial Add Button */
                    <motion.button
                      key="add-btn"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleIncrement}
                      whileTap={{ scale: 0.9 }}
                      className="relative bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden group"
                    >
                      <AnimatePresence>
                        {showCheck && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 2.5 }}
                            exit={{ scale: 3, opacity: 0 }}
                            className="absolute inset-0 bg-emerald-400 rounded-full"
                          />
                        )}
                      </AnimatePresence>
                      <Plus className="text-emerald-600 w-6 h-6 font-bold z-10 group-hover:rotate-90 transition-transform" />
                    </motion.button>
                  ) : (
                    /* - QTY + Selector */
                    <motion.div
                      key="qty-selector"
                      initial={{ width: 48, opacity: 0 }}
                      animate={{ width: 110, opacity: 1 }}
                      exit={{ width: 48, opacity: 0 }}
                      className="bg-white h-12 rounded-2xl flex items-center justify-between px-1 shadow-2xl border border-white/20"
                    >
                      <button
                        onClick={handleDecrement}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Minus size={18} strokeWidth={3} />
                      </button>
                      
                      <span className="text-slate-900 font-black text-sm w-4 text-center">
                        {quantity}
                      </span>

                      <button
                        onClick={handleIncrement}
                        className="w-9 h-9 flex items-center justify-center text-emerald-600"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}