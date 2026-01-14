import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import RestaurantLoader from "../components/RestaurantLoader";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ShoppingCart,
  Utensils,
  ArrowRight,
  Filter,
  Table as TableIcon,
  AlertCircle,
  Check,
} from "lucide-react";

// ── TEMPORARY MOCK DATA (for development / when context is not providing data) ──
const MOCK_PRODUCTS = [
  { id: "PROD-001", name: "Chicken Biryani", price: 220, type: "non-veg", description: "Aromatic & spicy rice dish with tender chicken", category: "Main Courses", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-002", name: "Paneer Butter Masala", price: 180, type: "veg", description: "Creamy & rich cottage cheese curry", category: "Main Courses", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-003", name: "Veg Noodles", price: 150, type: "veg", description: "Stir-fried noodles with fresh vegetables", category: "Main Courses", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-004", name: "Mutton Curry", price: 250, type: "non-veg", description: "Rich & spicy slow-cooked mutton gravy", category: "Main Courses", image: "https://images.unsplash.com/photo-1603894584713-b48dc4294024?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-005", name: "Veg Salad", price: 120, type: "veg", description: "Fresh garden vegetables with light dressing", category: "Starters", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-006", name: "Butter Naan", price: 60, type: "veg", description: "Soft tandoori bread brushed with butter", category: "Main Courses", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-007", name: "Dal Tadka", price: 160, type: "veg", description: "Tempered yellow lentils with aromatic spices", category: "Main Courses", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-008", name: "Chicken Tikka Masala", price: 240, type: "non-veg", description: "Grilled chicken in creamy tomato sauce", category: "Main Courses", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-009", name: "Palak Paneer", price: 190, type: "veg", description: "Cottage cheese in creamy spinach gravy", category: "Main Courses", image: "https://images.unsplash.com/photo-1601050638917-3606f50922c2?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-010", name: "Gulab Jamun", price: 90, type: "veg", description: "Soft fried dumplings soaked in rose syrup", category: "Desserts", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-011", name: "Mango Lassi", price: 80, type: "veg", description: "Refreshing sweet yogurt drink with mango", category: "Beverages", image: "https://images.unsplash.com/photo-1571006682864-74888cdf8d58?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-012", name: "Masala Chai", price: 50, type: "veg", description: "Spiced Indian tea with milk", category: "Beverages", image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-013", name: "Fresh Lime Soda", price: 60, type: "veg", description: "Zesty lime soda – sweet or salted", category: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-014", name: "Vegetable Samosa", price: 80, type: "veg", description: "Crispy pastry filled with spiced potatoes and peas", category: "Starters", image: "https://images.unsplash.com/photo-1601050638917-3606f50922c2?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-015", name: "Chicken 65", price: 180, type: "non-veg", description: "Spicy deep-fried chicken appetizer", category: "Starters", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-016", name: "Onion Bhaji", price: 100, type: "veg", description: "Crispy fried onion fritters with spices", category: "Starters", image: "https://images.unsplash.com/photo-1601050638917-3606f50922c2?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-017", name: "Butter Chicken", price: 260, type: "non-veg", description: "Tender chicken in rich buttery tomato sauce", category: "Main Courses", image: "https://images.unsplash.com/photo-1603894584713-b48dc4294024?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-018", name: "Lamb Rogan Josh", price: 280, type: "non-veg", description: "Aromatic Kashmiri lamb curry with yogurt and spices", category: "Main Courses", image: "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-019", name: "Aloo Gobi", price: 140, type: "veg", description: "Spiced potato and cauliflower stir-fry", category: "Main Courses", image: "https://images.unsplash.com/photo-1631209121151-5464195156f4?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-020", name: "Rasmalai", price: 120, type: "veg", description: "Soft cheese patties in creamy milk syrup with pistachios", category: "Desserts", image: "https://images.unsplash.com/photo-1645177623570-5896a7605963?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-021", name: "Jalebi", price: 80, type: "veg", description: "Crispy pretzel-shaped sweets soaked in sugar syrup", category: "Desserts", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-022", name: "Falooda", price: 130, type: "veg", description: "Chilled rose-flavored milk drink with vermicelli and basil seeds", category: "Beverages", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80", available: true },
  { id: "PROD-023", name: "Thandai", price: 100, type: "veg", description: "Cooling spiced milk drink with nuts and saffron", category: "Beverages", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", available: true },
];

const MOCK_ORDERED_CATEGORIES = ["Starters", "Main Courses", "Desserts", "Beverages"];

export default function Menu() {
  const { addToCart, removeFromCart, cart = [], table, setTable } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fallback to mock data if context doesn't provide products/categories
  const products = MOCK_PRODUCTS; // ← using mock directly for now
  const orderedCategories = MOCK_ORDERED_CATEGORIES;

  const [searchQuery, setSearchQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");
  const [showTableModal, setShowTableModal] = useState(false);
  const [manualTableInput, setManualTableInput] = useState(table || "");
  const [tableError, setTableError] = useState("");

  const sectionRefs = useRef({});
  const [showLoader, setShowLoader] = useState(false);

  // Automatic table from QR code
  useEffect(() => {
    const urlTable = searchParams.get("table");
    if (urlTable && urlTable.trim() !== "") {
      const cleanTable = urlTable.trim().replace(/^0+/, "") || "1";
      setTable(cleanTable);
      setManualTableInput(cleanTable);
    } else if (!table) {
      setTimeout(() => setShowTableModal(true), 1200);
    }
  }, [searchParams, setTable, table, navigate]);

  // Manual table handlers
  const handleSetManualTable = () => {
    const cleaned = manualTableInput.trim().replace(/[^0-9]/g, "");
    if (!cleaned) {
      setTableError("Please enter a table number");
      return;
    }
    if (Number(cleaned) < 1 || Number(cleaned) > 99) {
      setTableError("Table number must be 1–99");
      return;
    }
    setTable(cleaned);
    setTableError("");
    setShowTableModal(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSetManualTable();
  };

  // Banner carousel logic (your original)
  const [activeSlides, setActiveSlides] = useState([]);

  const defaultSlides = [
    { id: 1, title: "Art of Dining", description: "Discover Flavors Beyond Boundaries", imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80", tag: "Seasonal Menu" },
    { id: 2, title: "Purely Organic", description: "Farm to Fork, Every Single Day", imageUrl: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600", tag: "Fresh" },
    { id: 3, title: "Chef's Special", description: "Handcrafted Culinary Masterpieces", imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80", tag: "Must Try" },
    { id: 4, title: "Midnight Feast", description: "The best flavors for the night owl", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80", tag: "Late Night" },
    { id: 5, title: "Dessert Heaven", description: "Sweet endings to beautiful stories", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1600&q=80", tag: "Sweet" }
  ];

  useEffect(() => {
    const syncBanners = () => {
      const saved = localStorage.getItem("bannerSlides");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const valid = parsed.filter(s => s.imageUrl && s.imageUrl.trim().length > 0);
          setActiveSlides(valid.length > 0 ? valid : defaultSlides);
        } catch (e) {
          setActiveSlides(defaultSlides);
        }
      } else {
        setActiveSlides(defaultSlides);
      }
    };

    syncBanners();
    window.addEventListener("bannersUpdated", syncBanners);
    window.addEventListener("storage", syncBanners);

    return () => {
      window.removeEventListener("bannersUpdated", syncBanners);
      window.removeEventListener("storage", syncBanners);
    };
  }, []);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlides]);

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  const suggestions = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length < 2) return [];
    return products.filter((p) => (p.name?.toLowerCase() || "").includes(trimmed)).slice(0, 6);
  }, [products, searchQuery]);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("menuLoaderShown");
    if (!hasShown) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        sessionStorage.setItem("menuLoaderShown", "true");
        setShowLoader(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      <AnimatePresence>{showLoader && <RestaurantLoader />}</AnimatePresence>

      {!showLoader && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
          {/* HEADER */}
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">The Menu</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Est. 2024 • Organic</p>
                  </div>
                </div>

                {table && (
                  <div
                    onClick={() => setShowTableModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Table {table}</span>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you craving?"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-100/50 border-none text-sm font-semibold focus:ring-2 focus:ring-slate-900/10 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                    <X size={18} strokeWidth={2.5} />
                  </button>
                )}
                <AnimatePresence>
                  {isSearchFocused && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
                    >
                      {suggestions.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { setSearchQuery(p.name); setIsSearchFocused(false); }}
                          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                        >
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-900">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{p.category}</p>
                            </div>
                          </div>
                          <p className="text-xs font-black text-slate-900">₹{p.price}</p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Filters & Category Bar */}
            <div className="border-t border-slate-50 py-3 bg-white/50">
              <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 shrink-0">
                  {['all', 'veg', 'non-veg'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFoodTypeFilter(type)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${
                        foodTypeFilter === type ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {type === 'veg' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      {type === 'non-veg' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                      {type === 'all' ? 'All' : type}
                    </button>
                  ))}
                </div>
                <div className="h-6 w-[1px] bg-slate-200 shrink-0" />
                <div className="overflow-x-auto no-scrollbar flex gap-2">
                  {orderedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className="px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border border-slate-100 bg-white text-slate-500 hover:border-slate-900 hover:text-slate-900 active:scale-95 shadow-sm"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Banner Slider */}
          {!searchQuery && activeSlides.length > 0 && (
            <div className="relative h-[45vh] overflow-hidden bg-slate-900">
              <div
                className="absolute inset-0 flex transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ transform: `translateX(-${slide * 100}%)` }}
              >
                {activeSlides.map((s, i) => (
                  <div key={s.id || i} className="w-full h-full flex-shrink-0 relative">
                    <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                    <div className="absolute bottom-12 left-6 right-6 max-w-7xl mx-auto">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-orange-400 text-[10px] font-black uppercase tracking-[0.4em] inline-block mb-2"
                      >
                        {s.tag || "Exclusive Offer"}
                      </motion.span>
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-white uppercase tracking-tighter leading-none"
                      >
                        {s.title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-300 text-sm font-medium mt-3 max-w-md"
                      >
                        {s.description}
                      </motion.p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {activeSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      slide === i ? "w-10 bg-orange-500" : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <main className="max-w-7xl mx-auto w-full px-4 py-12">
            {(() => {
              const q = searchQuery.toLowerCase().trim();
              let foundMatch = false;

              const renderedSections = orderedCategories.map((cat) => {
                const filtered = products.filter((p) => {
                  const matchesSearch = (p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
                  const matchesCategory = (p.category || "Other") === cat;
                  let matchesFoodType = true;
                  const pType = (p.type || "").toLowerCase();
                  if (foodTypeFilter === "veg") matchesFoodType = pType === "veg";
                  if (foodTypeFilter === "non-veg") matchesFoodType = pType === "non-veg";
                  return matchesSearch && matchesCategory && matchesFoodType;
                });

                if (filtered.length > 0) {
                  foundMatch = true;
                  return (
                    <section key={cat} ref={(el) => (sectionRefs.current[cat] = el)} className="mb-20 scroll-mt-48">
                      <div className="flex items-end justify-between mb-8 border-b-2 border-slate-900/5 pb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Collection</span>
                          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{cat}</h2>
                        </div>
                        <span className="text-xs font-black text-slate-300">{filtered.length} Dishes</span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                        {filtered.map((product, idx) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <ProductCard
                              product={product}
                              initialQty={cart.find(i => i.id === product.id)?.qty || 0}
                              onAdd={() => product.available !== false && addToCart(product)}
                              onRemove={() => removeFromCart(product.id)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  );
                }
                return null;
              });

              if (!foundMatch) {
                return (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Filter className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase">No Dishes Found</h3>
                    <p className="text-slate-400 text-sm mt-1">Try resetting filters or changing your search.</p>
                    <button
                      onClick={() => { setSearchQuery(""); setFoodTypeFilter("all"); }}
                      className="mt-6 text-xs font-black uppercase text-orange-500 underline"
                    >
                      Reset All
                    </button>
                  </div>
                );
              }
              return renderedSections;
            })()}
          </main>

          {/* Floating Cart Button */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none mb-19 sm:mb-0"
              >
                <Link to={`/cart${table ? `?table=${table}` : ""}`} className="pointer-events-auto group">
                  <div className="bg-slate-950 text-white px-8 py-4 rounded-[2rem] flex items-center gap-8 shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <ShoppingCart size={24} />
                        <span className="absolute -top-3 -right-3 bg-orange-500 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-950">
                          {totalItems}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Items Added</p>
                        <p className="text-sm font-bold leading-none italic">View Selection</p>
                      </div>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-800" />
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table Selection Modal */}
          <AnimatePresence>
            {showTableModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                onClick={() => setShowTableModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.88, y: 40 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.88, y: 40 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <TableIcon size={24} className="text-emerald-600" />
                        Select Your Table
                      </h3>
                      <button onClick={() => setShowTableModal(false)} className="text-slate-400 hover:text-slate-700">
                        <X size={24} />
                      </button>
                    </div>

                    <p className="text-slate-600 mb-6">
                      Scan the QR code on your table or enter your table number manually
                    </p>

                    <div className="relative mb-6">
                      <input
                        type="text"
                        value={manualTableInput}
                        onChange={(e) => {
                          setManualTableInput(e.target.value.replace(/[^0-9]/g, ""));
                          setTableError("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Table number (e.g. 7)"
                        className="w-full pl-14 pr-5 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 text-xl font-bold text-center"
                        maxLength={3}
                        autoFocus
                      />
                      <TableIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                    </div>

                    {tableError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
                        <AlertCircle size={18} />
                        <span>{tableError}</span>
                      </div>
                    )}

                    <button
                      onClick={handleSetManualTable}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3"
                    >
                      <Check size={22} />
                      Confirm Table
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}