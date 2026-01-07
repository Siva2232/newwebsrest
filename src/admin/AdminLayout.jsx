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
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  ChevronDown,
  Sparkles,
  ImagePlus
} from "lucide-react";

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { name: "Products", icon: Package, path: "products" },
  { name: "Orders", icon: ShoppingCart, path: "orders" },
  { name: "Tables", icon: Table, path: "tables" },
  { name: "Add Banner", icon: ImagePlus, path: "banner" },
  // New Great UI addition:
  { name: "Add Offers", icon: Sparkles, path: "offers" }, 
];

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
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
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6 justify-between">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed && 'lg:hidden'}`}>
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">My Cafe<span className="text-indigo-600"> Admin</span></span>
          </div>
          
          <button 
            onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
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

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-100">
          <div className={`bg-slate-50 rounded-2xl p-4 flex items-center gap-3 ${isCollapsed && 'lg:justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">B</div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">Base Plan</p>
                <p className="text-[10px] text-slate-400 truncate">Unlimited Products</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
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
            
            {/* Divider */}
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
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

        {/* Dashboard Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Premium Toast */}
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