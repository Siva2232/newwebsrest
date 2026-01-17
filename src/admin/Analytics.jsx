import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend, ComposedChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts";
import { 
  TrendingUp, IndianRupee, PieChart as PieIcon, Activity, 
  Download, FileText, Wallet, Target, Search, Filter,
  Zap, ShieldCheck, History, ArrowUpRight, Layers, Box, FileSpreadsheet,
  AlertCircle, CheckCircle2, Info, Calendar, Percent
} from "lucide-react";
import { useProducts } from "../context/ProductContext";

// Export Libraries
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Analytics() {
  const { products = [] } = useProducts();
  const [timeframe, setTimeframe] = useState("Weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Date Filtration State (Preserved)
  const [dateRange, setDateRange] = useState({ 
    start: new Date().toISOString().split('T')[0], 
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
  });

  // --- 1. ENHANCED FISCAL INTELLIGENCE ENGINE ---
  const engine = useMemo(() => {
    // A. Multi-Layer Filter (Preserved)
    const filtered = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" ? true : 
                         statusFilter === "Live" ? p.available : !p.available;
      return matchSearch && matchStatus;
    });

    // B. Advanced Financial Metrics
    const inventoryValue = filtered.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    const multiplier = { Daily: 0.2, Weekly: 1, Monthly: 4.3, Yearly: 52 }[timeframe];
    
    const estRevenue = inventoryValue * multiplier;
    const taxLiability = estRevenue * 0.18;
    const opsCosts = estRevenue * 0.12; // New: 12% operational costs
    const netProfit = estRevenue - taxLiability - opsCosts;

    // C. Pie Chart Data (New Feature)
    const liveCount = filtered.filter(p => p.available).length;
    const outCount = filtered.length - liveCount;
    const pieData = [
      { name: 'Active Stock', value: liveCount, color: '#6366f1' },
      { name: 'Out of Stock', value: outCount, color: '#f43f5e' }
    ];

    // D. Projections (Preserved)
    const timeLabels = {
      Daily: ["Morning", "Noon", "Evening", "Night"],
      Weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      Monthly: ["Week 1", "Week 2", "Week 3", "Week 4"],
      Yearly: ["Q1", "Q2", "Q3", "Q4"]
    }[timeframe];

    const salesProjectionData = timeLabels.map((label, idx) => {
      const isFuture = idx > timeLabels.length / 2;
      const baseVal = (estRevenue / timeLabels.length);
      return {
        name: label,
        totalSales: isFuture ? null : Math.floor(baseVal * (0.8 + Math.random() * 0.4)),
        futureSales: !isFuture ? null : Math.floor(baseVal * (1.1 + Math.random() * 0.5)),
      };
    });

    return { filtered, inventoryValue, estRevenue, taxLiability, netProfit, opsCosts, salesProjectionData, pieData };
  }, [products, timeframe, searchTerm, statusFilter, dateRange]);

  // --- 2. EXPORT LOGIC (Preserved) ---
  const handleExport = (format) => {
    const data = engine.filtered.map(p => ({
      Name: p.name,
      Price: p.price,
      GST: (p.price * 0.18).toFixed(2),
      Status: p.available ? 'Live' : 'Stocked'
    }));
    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Financial_Audit");
      XLSX.writeFile(wb, `Audit_${timeframe}.xlsx`);
    } else {
      const doc = new jsPDF();
      doc.text("Fiscal Audit Report", 14, 20);
      doc.autoTable({ head: [['Product', 'Price', 'Tax']], body: data.map(o => [o.Name, o.Price, o.GST]) });
      doc.save("Report.pdf");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFDFF] pb-20 font-sans text-slate-900">
      {/* HEADER & FILTERS (Preserved) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200"><TrendingUp size={24}/></div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">Finance<span className="text-indigo-600">Core</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v2.4 Neural Audit</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-bold w-48 focus:ring-4 ring-indigo-500/10 outline-none" 
                placeholder="Audit SKU..." 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
               <Calendar size={12} className="ml-2 text-indigo-500" />
               <input type="date" className="bg-transparent text-[10px] font-black outline-none" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} />
               <span className="text-slate-300 px-1 text-[10px]">-</span>
               <input type="date" className="bg-transparent text-[10px] font-black outline-none" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} />
            </div>

            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-3 rounded-xl outline-none cursor-pointer">
                {["Daily", "Weekly", "Monthly", "Yearly"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        
        {/* KPI CARDS (New metrics added) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: "Net Profit", val: engine.netProfit, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Tax Liability", val: engine.taxLiability, icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50" },
             { label: "Operating Costs", val: engine.opsCosts, icon: Percent, color: "text-amber-600", bg: "bg-amber-50" },
             { label: "Gross Forecast", val: engine.estRevenue, icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
           ].map((k, i) => (
             <motion.div whileHover={{ y: -4 }} key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className={`${k.bg} ${k.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}><k.icon size={18}/></div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{k.label}</p>
                <p className="text-2xl font-black mt-1 text-slate-900">₹{Math.floor(k.val).toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className={`h-full ${k.bg.replace('50', '500')}`} />
                   </div>
                   <span className="text-[9px] font-black text-slate-400">70%</span>
                </div>
             </motion.div>
           ))}
        </section>

        {/* MIDDLE SECTION: Graphs & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Chart (Preserved) */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest mb-10 flex items-center gap-2"><Activity className="text-indigo-600" size={18}/> Revenue Projections</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={engine.salesProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="totalSales" fill="#0f172a" radius={[10, 10, 0, 0]} barSize={35} />
                  <Line type="monotone" dataKey="futureSales" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Feature: Stock Distribution Pie */}
          {/* Updated Inventory Health Card with Hover Effect */}
<motion.div 
  whileHover={{ scale: 1.02 }}
  className="lg:col-span-4 bg-slate-900 hover:bg-white p-8 rounded-[3rem] text-white hover:text-slate-900 shadow-2xl border border-transparent hover:border-slate-200 transition-all duration-300 flex flex-col items-center justify-center group"
>
  <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-indigo-400 group-hover:text-indigo-600">
    Inventory Health
  </h3>
  
  <div className="h-[250px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie 
          data={engine.pieData} 
          innerRadius={60} 
          outerRadius={80} 
          paddingAngle={5} 
          dataKey="value"
          stroke="none"
        >
          {engine.pieData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        {/* Tooltip background adjusted for better visibility */}
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            color: '#000000'
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="w-full space-y-3 mt-4">
    {engine.pieData.map((d, i) => (
      <div 
        key={i} 
        className="flex justify-between items-center bg-white/5 group-hover:bg-slate-50 p-3 rounded-xl border border-white/10 group-hover:border-slate-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
          <span className="text-[10px] font-bold uppercase tracking-tight">{d.name}</span>
        </div>
        <span className="text-xs font-black italic group-hover:text-indigo-600">{d.value} Units</span>
      </div>
    ))}
  </div>
</motion.div>
        </div>

        {/* AUDIT LEDGER (Preserved functionality) */}
        <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3"><History className="text-rose-500" size={18}/> Financial Ledger</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Tracking {engine.filtered.length} active fiscal entities</p>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => handleExport('xlsx')} className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
                    <FileSpreadsheet size={14}/> Excel
                 </button>
                 <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">
                    <FileText size={14}/> PDF
                 </button>
              </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-50">
                        <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Entity</th>
                        <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Price</th>
                        <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Tax Provision</th>
                        <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {engine.filtered.slice(0, 8).map((p, i) => (
                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
                           <td className="py-5 font-bold text-sm">{p.name}</td>
                           <td className="py-5 font-black text-indigo-600 text-sm italic">₹{p.price}</td>
                           <td className="py-5 font-bold text-xs text-slate-400">₹{(p.price * 0.18).toFixed(0)}</td>
                           <td className="py-5">
                             <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.available ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                {p.available ? 'Audit Passed' : 'Verification Required'}
                             </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
        </div>

      </main>
    </div>
  );
}