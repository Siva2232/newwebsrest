import React from "react";
import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { Plus, Package, CheckCircle2, AlertCircle, Edit3, Trash2, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProducts() {
  // Added 'deleteProduct' from context
  const { products, toggleAvailability, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Inventory", value: products.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Live Items", value: products.filter(p => p.available).length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Unavailable", value: products.length - products.filter(p => p.available).length, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 italic uppercase">Catalog <span className="text-blue-600">Pro</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Manage Inventory & Digital Menu</p>
        </div>
        
        <button
          onClick={() => navigate("/admin/products/add")}
          className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all duration-300 shadow-2xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Product
        </button>
      </header>

      {/* Analytics Dashboard */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center"
            >
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="text-slate-200" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Your vault is empty</h3>
              <p className="text-slate-400 font-medium mt-2">Start your collection by adding a new product above.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onToggle={toggleAvailability} 
                  onDelete={handleDelete}
                  onEdit={(id) => navigate(`/admin/products/edit/${id}`)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ProductCard({ product, onToggle, onDelete, onEdit }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[1/1] overflow-hidden">
        <img
          src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${!product.available && "grayscale opacity-50"}`}
        />
        
        {/* Availability Badge Overlay */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border shadow-sm ${
            product.available 
            ? "bg-emerald-500 text-white border-emerald-400" 
            : "bg-slate-900 text-white border-slate-700"
          }`}>
            {product.available ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
              {product.name}
            </h3>
            <div className="flex items-center text-blue-600 font-black">
              <IndianRupee size={14} strokeWidth={3} />
              <span className="text-xl tracking-tighter italic">{product.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
            {/* Toggle Switch Button */}
            <button
              onClick={() => onToggle(product.id)}
              className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 ${
                product.available 
                ? "bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-500" 
                : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              }`}
            >
              {product.available ? "Set as Out of Stock" : "Set as In Stock"}
            </button>
            
            {/* Secondary Actions */}
            <div className="flex gap-3">
                <button 
                   onClick={() => onEdit(product.id)}
                   className="flex-1 py-3.5 bg-slate-900 text-white hover:bg-blue-600 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-100"
                >
                    <Edit3 size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Edit</span>
                </button>
                <button 
                   onClick={() => onDelete(product.id, product.name)}
                   className="flex-1 py-3.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Trash2 size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Delete</span>
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}