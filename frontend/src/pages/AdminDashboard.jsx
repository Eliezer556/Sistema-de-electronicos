import React, { useEffect, useState } from 'react';
import { 
    TrendingUp, AlertTriangle, Package, Activity, 
    DollarSign, RefreshCcw, Users 
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        const result = await analyticsService.getStats();
        if (result.success) {
            setStats(result.data);
            setError(null);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#0a0a0a] gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Sincronizando Terminal...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center">
            <AlertTriangle size={40} className="text-red-500 mb-4 opacity-20" />
            <p className="text-red-500 font-mono text-xs mb-6 tracking-tighter">{error}</p>
            <button 
                onClick={loadData} 
                className="px-5 py-2.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-red-500 hover:text-white transition-all"
            >
                Reintentar Conexión
            </button>
        </div>
    );

    const maxSearch = Math.max(...stats.top_searches.map(s => s.count), 1);
    const maxDemand = Math.max(...stats.stock_demands.map(d => d.total), 1);

    return (
        <div className="p-6 space-y-6 bg-[#0a0a0a] min-h-screen text-gray-300">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-900 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-purple-500">
                        <Activity size={14} />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Core Analytics</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Control <span className="text-gray-600">Center</span>
                    </h1>
                </div>
                <button 
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-gray-800 rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-purple-500/50 hover:text-white transition-all group shadow-lg"
                >
                    <RefreshCcw size={12} className="group-active:rotate-180 transition-transform duration-500" />
                    Sync Data
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    label="Valoración Inventario" 
                    value={`$${stats.inventory_summary.total_value.toLocaleString()}`} 
                    icon={<DollarSign size={18} />} 
                    color="text-emerald-400"
                    bg="bg-emerald-400/5"
                />
                <StatCard 
                    label="Stock Crítico" 
                    value={stats.inventory_summary.out_of_stock_count} 
                    icon={<AlertTriangle size={18} />} 
                    color="text-red-400"
                    bg="bg-red-400/5"
                />
                <StatCard 
                    label="Componentes Totales" 
                    value={stats.inventory_summary.total_components} 
                    icon={<Package size={18} />} 
                    color="text-blue-400"
                    bg="bg-blue-400/5"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-[#111] p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <TrendingUp size={14} className="text-emerald-500" /> 
                            Tendencias Globales
                        </h2>
                    </div>
                    
                    <div className="space-y-4">
                        {stats.top_searches.length > 0 ? stats.top_searches.map((item, idx) => (
                            <div key={idx} className="space-y-2 group">
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-gray-300 font-bold uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{item.query}</span>
                                    <span className="text-gray-500 font-mono">{item.count} hits</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000"
                                        style={{ width: `${(item.count / maxSearch) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : <EmptyState text="Sin registros de búsqueda" />}
                    </div>
                </section>

                <section className="bg-[#111] p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Users size={14} className="text-orange-500" /> 
                            Demanda de Stock
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {stats.stock_demands.length > 0 ? stats.stock_demands.map((item, idx) => (
                            <div key={idx} className="space-y-2 group">
                                <div className="flex justify-between text-[11px] mb-1">
                                    <span className="text-gray-300 font-bold uppercase tracking-tight group-hover:text-orange-400 transition-colors">{item.component__name}</span>
                                    <span className="text-gray-500 font-mono">{item.total} reqs</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000"
                                        style={{ width: `${(item.total / maxDemand) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : <EmptyState text="No hay alertas de demanda" />}
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-[#111] p-5 rounded-lg border border-gray-800 hover:border-gray-700 transition-all relative group overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3 ${bg} ${color} rounded-lg border border-white/5`}>
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-2xl font-bold text-white tracking-tighter">{value}</p>
            </div>
        </div>
    </div>
);

const EmptyState = ({ text }) => (
    <div className="text-center py-6 opacity-20">
        <p className="text-[9px] font-mono uppercase tracking-[0.2em]">{text}</p>
    </div>
);