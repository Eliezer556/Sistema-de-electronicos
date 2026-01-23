import React, { useEffect, useState } from 'react';
import { 
    TrendingUp, AlertTriangle, Package, Activity, 
    DollarSign, RefreshCcw, BarChart3, Users 
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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Sincronizando Terminal...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center">
            <AlertTriangle size={48} className="text-red-500 mb-4 opacity-20" />
            <p className="text-red-500 font-mono text-sm mb-6 tracking-tighter">{error}</p>
            <button 
                onClick={loadData} 
                className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all"
            >
                Reintentar Conexión
            </button>
        </div>
    );

    return (
        <div className="p-8 space-y-10 bg-[#0a0a0a] min-h-screen text-gray-300">
            {/* Header Profesional */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-purple-500">
                        <Activity size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Analytics</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Control <span className="text-gray-500">Panel</span>
                    </h1>
                </div>
                <button 
                    onClick={loadData}
                    className="flex items-center gap-2 px-5 py-3 bg-[#111] border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-purple-500/50 hover:text-white transition-all group shadow-xl"
                >
                    <RefreshCcw size={14} className="group-active:rotate-180 transition-transform duration-500" />
                    Actualizar Datos
                </button>
            </header>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Valoración de Inventario" 
                    value={`$${stats.inventory_summary.total_value.toLocaleString()}`} 
                    icon={<DollarSign size={20} />} 
                    color="text-emerald-400"
                    bg="bg-emerald-400/5"
                />
                <StatCard 
                    label="Stock Crítico (Agotados)" 
                    value={stats.inventory_summary.out_of_stock_count} 
                    icon={<AlertTriangle size={20} />} 
                    color="text-red-400"
                    bg="bg-red-400/5"
                />
                <StatCard 
                    label="Total Componentes" 
                    value={stats.inventory_summary.total_components} 
                    icon={<Package size={20} />} 
                    color="text-blue-400"
                    bg="bg-blue-400/5"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tabla de Búsquedas */}
                <section className="bg-[#111] p-8 rounded-[2.5rem] border border-gray-800 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                            <TrendingUp size={16} className="text-emerald-500" /> 
                            Tendencias de Búsqueda
                        </h2>
                        <span className="text-[9px] font-mono text-gray-600">Top Queries</span>
                    </div>
                    
                    <div className="space-y-3">
                        {stats.top_searches.length > 0 ? stats.top_searches.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[#0d0d0d] p-4 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors group">
                                <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors capitalize tracking-tight">
                                    {item.query}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Impacto</span>
                                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-500/20">
                                        {item.count} hits
                                    </span>
                                </div>
                            </div>
                        )) : <EmptyState text="Sin registros de terminal" />}
                    </div>
                </section>

                {/* Tabla de Alertas */}
                <section className="bg-[#111] p-8 rounded-[2.5rem] border border-gray-800">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Users size={16} className="text-orange-500" /> 
                            Demanda Retenida
                        </h2>
                        <span className="text-[9px] font-mono text-gray-600">Stock Alerts</span>
                    </div>

                    <div className="space-y-3">
                        {stats.stock_demands.length > 0 ? stats.stock_demands.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[#0d0d0d] p-4 rounded-2xl border border-gray-800/50 hover:border-orange-500/20 transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-200 font-bold tracking-tight">{item.component__name}</span>
                                    <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">Ref: Component-{idx + 100}</span>
                                </div>
                                <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg text-[10px] font-black border border-orange-500/20">
                                    {item.total} Solicitudes
                                </span>
                            </div>
                        )) : <EmptyState text="No hay alertas de reabastecimiento" />}
                    </div>
                </section>
            </div>
        </div>
    );
};

/* Sub-componentes para organización */
const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-[#111] p-6 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-all shadow-2xl relative group overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-full -mr-8 -mt-8 blur-3xl opacity-50`}></div>
        <div className="flex items-center gap-5 relative z-10">
            <div className={`p-4 ${bg} ${color} rounded-2xl border border-white/5`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-light text-white tracking-tighter">{value}</p>
            </div>
        </div>
    </div>
);

const EmptyState = ({ text }) => (
    <div className="text-center py-10 opacity-30">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em]">{text}</p>
    </div>
);