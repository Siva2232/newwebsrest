import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Notification from "../components/Notification";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Table,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings,
  ChevronDown,
  Sparkles,
  ImagePlus,
  AlertTriangle,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";

export default function AdminLayout() {
  const { products = [] } = useProducts();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showStockAlert, setShowStockAlert] = useState(false); // ← NEW state for stock dropdown

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const stockRef = useRef(null);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
    { name: "Products", icon: Package, path: "products" },
    { name: "Orders", icon: ShoppingCart, path: "orders" },
    { name: "Tables", icon: Table, path: "tables" },
    { name: "Add Banner", icon: ImagePlus, path: "banner" },
    { name: "Add Offers", icon: Sparkles, path: "offers" },
  ];

  // Count out-of-stock products
  const outOfStockProducts = products.filter(p => p && !p.available);
  const lowStockCount = outOfStockProducts.length;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("isAdminLoggedIn");
      navigate("/login", { replace: true });
    }
    setIsProfileOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem("showWelcomeMessage") === "true") {
      setShowWelcome(true);
      localStorage.removeItem("showWelcomeMessage");
      setTimeout(() => setShowWelcome(false), 4000);
    }
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      // Close stock alert when clicking outside
      if (stockRef.current && !stockRef.current.contains(e.target)) {
        setShowStockAlert(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-[70] h-screen flex flex-col
          bg-white border-r border-slate-200 transition-all duration-500 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[90px]" : "w-72"}
        `}
      >
        {/* ... Sidebar content remains the same ... */}
        <div className="h-24 flex items-center px-6 justify-between">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed && 'lg:hidden'}`}>
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              My Cafe<span className="text-indigo-600"> Admin</span>
            </span>
          </div>
          <button
            onClick={() => (isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed))}
            className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/admin/${item.path}`}
              className={({ isActive }) => `
                group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300
                ${isActive
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              <item.icon size={22} className="flex-shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? "lg:opacity-0 lg:absolute lg:left-20" : "opacity-100"}`}>
                {item.name}
              </span>
              {isCollapsed && (
                <div className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className={`bg-slate-50 rounded-2xl p-4 flex items-center gap-3 ${isCollapsed && 'lg:justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">B</div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">Standard Plan</p>
                <p className="text-[10px] text-slate-400 truncate">Unlimited Products</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-6 lg:px-10 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:block">
              Internal Management System
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Notification />

            {/* STOCK ALERT WITH DROPDOWN */}
            <div className="relative" ref={stockRef}>
              <button
                onClick={() => setShowStockAlert(!showStockAlert)}
                className={`relative p-3 rounded-full transition-all duration-200 ${
                  lowStockCount > 0
                    ? "hover:bg-red-50 text-red-600"
                    : "hover:bg-slate-100 text-slate-400"
                }`}
              >
                <AlertTriangle size={24} className={lowStockCount > 0 ? "animate-pulse" : ""} />

                {lowStockCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md px-1.5">
                    {lowStockCount > 99 ? "99+" : lowStockCount}
                  </span>
                )}
              </button>

              {/* Out of Stock Dropdown */}
              <AnimatePresence>
                {showStockAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100]"
                  >
                    {/* Header */}
                    <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={20} className="text-red-600" />
                          <h3 className="font-bold text-red-800">Out of Stock</h3>
                        </div>
                        <span className="text-xs font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full">
                          {lowStockCount} {lowStockCount === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                      {outOfStockProducts.length > 0 ? (
                        outOfStockProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              navigate(`/admin/products/edit/${product.id}`);
                              setShowStockAlert(false);
                            }}
                            className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-4"
                          >
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                              <img
                                src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">{product.name}</p>
                              <p className="text-sm text-slate-500">
                                ₹{product.price?.toLocaleString() || "—"}
                              </p>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 px-3 py-1 rounded-full">
                              OUT
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center text-slate-400">
                          <Package size={48} className="mx-auto mb-4 opacity-40" />
                          <p className="font-medium">No items are out of stock right now</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {outOfStockProducts.length > 0 && (
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <button
                          onClick={() => {
                            navigate("/admin/products?filter=out-of-stock");
                            setShowStockAlert(false);
                          }}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                        >
                          Manage All Products →
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {/* ... your existing profile button and dropdown code ... */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="avatar" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-800 leading-none">Alex Rivera</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">Super Admin</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden p-2"
                  >
                    <div className="p-4 border-b border-slate-50">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Account</p>
                      <p className="text-sm font-bold text-slate-800">admin@luxehub.com</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <Settings size={18} /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Welcome Toast */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white p-1 pr-6 rounded-2xl flex items-center gap-4 shadow-2xl border border-slate-700"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-xl">👋</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-indigo-400">System Ready</p>
              <p className="font-bold">Welcome back, Chief.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}