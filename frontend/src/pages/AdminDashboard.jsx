import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Package, Activity, DollarSign } from 'lucide-react';
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
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={loadData} className="text-blue-600 underline">Reintentar</button>
        </div>
    );

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-blue-600" /> Dashboard UNEFA Store
                </h1>
                <button 
                    onClick={loadData}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Actualizar
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Valor Inventario</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.inventory_summary.total_value.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-lg text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Agotados</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.inventory_summary.out_of_stock_count}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Componentes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.inventory_summary.total_components}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-green-500" /> Búsquedas Populares
                    </h2>
                    <div className="space-y-4">
                        {stats.top_searches.length > 0 ? stats.top_searches.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <span className="text-gray-700 font-medium capitalize">{item.query}</span>
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                                    {item.count} búsquedas
                                </span>
                            </div>
                        )) : <p className="text-gray-400 text-sm">Sin historial de búsquedas.</p>}
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-orange-500" /> Alertas de Stock
                    </h2>
                    <div className="space-y-4">
                        {stats.stock_demands.length > 0 ? stats.stock_demands.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <span className="text-gray-700 font-medium">{item.component__name}</span>
                                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                                    {item.total} interesados
                                </span>
                            </div>
                        )) : <p className="text-gray-400 text-sm">Sin solicitudes de stock.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};