import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  LayoutGrid, 
  LogOut, 
  Users, 
  Circle, 
  ChevronRight, 
  Trash2,
  UtensilsCrossed
} from "lucide-react";

export default function Tables() {
  const navigate = useNavigate();

  // 1. Persistent Table Config (The Physical Furniture)
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem("restaurant_tables_config");
    // Default to 5 tables if nothing is saved
    return saved ? JSON.parse(saved) : [
      { id: 1, capacity: 2 },
      { id: 2, capacity: 4 },
      { id: 3, capacity: 4 },
      { id: 4, capacity: 6 },
      { id: 5, capacity: 2 }
    ];
  });

  // 2. Persistent Orders (The Occupancy Logic)
  const [activeOrders, setActiveOrders] = useState(() => {
    const saved = localStorage.getItem("active_orders");
    return saved ? JSON.parse(saved) : {}; 
  });

  useEffect(() => {
    localStorage.setItem("restaurant_tables_config", JSON.stringify(tables));
  }, [tables]);

  // Handle Navigation
  const goToMenu = (id) => navigate(`/menu?table=${id}`);

  // Handle Table Release (Logic: Remove order from local storage)
  const releaseTable = (e, id) => {
    e.stopPropagation(); // Prevents navigating to menu when clicking release
    const updatedOrders = { ...activeOrders };
    delete updatedOrders[`table-${id}`];
    setActiveOrders(updatedOrders);
    localStorage.setItem("active_orders", JSON.stringify(updatedOrders));
  };

  const addNewTable = () => {
    const nextId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
    setTables([...tables, { id: nextId, capacity: 4 }]);
  };

  const removeTable = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Remove this table station permanently?")) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-12 font-sans">
      {/* --- PREMIUM HEADER --- */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Live Management System</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter uppercase italic">
            Floor <span className="text-zinc-300">Plan</span>
          </h1>
        </div>

        <button 
          onClick={addNewTable}
          className="group flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-zinc-200 hover:shadow-orange-200"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          Add Station
        </button>
      </div>

      {/* --- TABLE GRID --- */}
      <div className="max-w-7xl mx-auto">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {tables.map((table) => {
              const isOccupied = !!activeOrders[`table-${table.id}`];

              return (
                <motion.div
                  key={table.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => goToMenu(table.id)}
                  className={`group relative flex flex-col rounded-[3rem] p-8 transition-all duration-500 cursor-pointer border-2
                    ${isOccupied 
                      ? "bg-white border-rose-500 shadow-[0_20px_60px_-15px_rgba(244,63,94,0.15)]" 
                      : "bg-white border-zinc-100 hover:border-zinc-900 shadow-sm hover:shadow-2xl shadow-zinc-200/50"}`}
                >
                  {/* Status Indicator */}
                  <div className={`absolute top-8 right-8 flex items-center gap-2 px-3 py-1 rounded-full border ${isOccupied ? "border-rose-100 bg-rose-50" : "border-emerald-100 bg-emerald-50"}`}>
                    <div className={`w-1 h-1 rounded-full ${isOccupied ? "bg-rose-500" : "bg-emerald-500"}`} />
                    <span className={`text-[9px] font-black uppercase tracking-tight ${isOccupied ? "text-rose-600" : "text-emerald-600"}`}>
                      {isOccupied ? "Occupied" : "Available"}
                    </span>
                  </div>

                  {/* Icon Station */}
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-10 transition-all duration-500
                    ${isOccupied ? "bg-rose-500 text-white rotate-12" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white group-hover:-rotate-12"}`}>
                    <LayoutGrid size={28} strokeWidth={1.5} />
                  </div>

                  {/* Table Info */}
                  <div className="mb-8">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Dining Station</p>
                    <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">
                      T-{table.id < 10 ? `0${table.id}` : table.id}
                    </h3>
                  </div>

                  {/* Actions / Details */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Users size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{table.capacity || 4} Seater</span>
                    </div>

                    {isOccupied ? (
                      <button
                        onClick={(e) => releaseTable(e, table.id)}
                        className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Release Table"
                      >
                        <LogOut size={18} />
                      </button>
                    ) : (
                      <div className="p-3 bg-zinc-50 text-zinc-300 rounded-2xl group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    )}
                  </div>

                  {/* Permanent Delete Icon (Only visible on hover) */}
                  <button 
                    onClick={(e) => removeTable(e, table.id)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-zinc-100 rounded-full flex items-center justify-center text-zinc-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* --- EMPTY STATE --- */}
        {tables.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 border-4 border-dashed border-zinc-100 rounded-[4rem]">
            <UtensilsCrossed size={48} className="text-zinc-200 mb-6" />
            <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">No Stations Configured</p>
            <button onClick={addNewTable} className="mt-4 text-orange-500 font-bold hover:underline underline-offset-8">Click to add your first table</button>
          </div>
        )}
      </div>
    </div>
  );
}