import React from 'react';
import { useProducts } from '../context/ProductContext';
import { Cpu, DollarSign, Box, Hash, FilterX } from 'lucide-react';

export const TechnicalFilters = () => {
    const { filters, setFilters, searchTerm } = useProducts();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            min_price: '',
            max_price: '',
            montaje: '',
            encapsulado: '',
            mpn: ''
        });
    };

    const hasActiveFilters = Object.values(filters).some(val => val !== '');

    return (
        <div className="w-full bg-[#1a1a1a]/40 backdrop-blur-md border border-gray-800/50 rounded-[2rem] p-6 mt-5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Cpu className="text-blue-400" size={14} />
                    </div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                        Parámetros Técnicos Avanzados
                    </h3>
                </div>
                
                {hasActiveFilters && (
                    <button 
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-[9px] font-bold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                    >
                        <FilterX size={12} /> Limpiar Filtros
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Filtro de Montaje */}
                <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Box size={12} /> Tipo de Montaje
                    </label>
                    <select
                        name="montaje"
                        value={filters.montaje}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-300 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Todos los tipos</option>
                        <option value="SMD">SMD (Superficial)</option>
                        <option value="TH">Through-Hole (Inserción)</option>
                    </select>
                </div>

                {/* Filtro de MPN */}
                <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Hash size={12} /> Manufacturer Part Number
                    </label>
                    <input
                        type="text"
                        name="mpn"
                        value={filters.mpn}
                        onChange={handleChange}
                        placeholder="Ej: NE555P..."
                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-300 placeholder:text-gray-700 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                {/* Rango de Precios (Mín - Máx) */}
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign size={12} /> Rango de Presupuesto ($)
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            name="min_price"
                            value={filters.min_price}
                            onChange={handleChange}
                            placeholder="Mín"
                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-300 placeholder:text-gray-700 outline-none focus:border-blue-500/50 transition-all"
                        />
                        <div className="h-[1px] w-4 bg-gray-800"></div>
                        <input
                            type="number"
                            name="max_price"
                            value={filters.max_price}
                            onChange={handleChange}
                            placeholder="Máx"
                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-300 placeholder:text-gray-700 outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Indicador de búsqueda activa */}
            {searchTerm && (
                <div className="mt-6 pt-6 border-t border-gray-800/50">
                    <p className="text-[10px] text-gray-600 italic">
                        Filtrando resultados para: <span className="text-blue-400 font-bold">"{searchTerm}"</span>
                    </p>
                </div>
            )}
        </div>
    );
};