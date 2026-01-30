import { Star, Navigation, Map as MapIcon, RotateCcw } from 'lucide-react';

export function StoreFilters({ filters, setFilters, userLocation }) {
    const handleRatingClick = (rating) => {
        setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? 0 : rating }));
    };

    return (
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-[0.5rem] p-6 mb-8 flex flex-wrap items-center gap-8">
            {/* Filtro de Rating */}
            <div className="space-y-3">
                <label className="text-[9px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Star size={12} fill="currentColor" /> Calificación Mínima
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            className={`transition-all ${filters.minRating >= star ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'}`}
                        >
                            <Star size={20} fill={filters.minRating >= star ? "currentColor" : "none"} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Filtro de Distancia */}
            <div className="space-y-3 flex-grow max-w-xs">
                <label className="text-[9px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center justify-between">
                    <span className="flex items-center gap-2"><Navigation size={12} /> Radio de cercanía</span>
                    <span className="text-white">{filters.maxDistance} KM</span>
                </label>
                <input 
                    type="range"
                    min="1"
                    max="50"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                    disabled={!userLocation}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-30 disabled:cursor-not-allowed"
                />
                {!userLocation && <p className="text-[8px] text-gray-600 italic">Activa el GPS para filtrar por distancia</p>}
            </div>

            <button 
                onClick={() => setFilters({ minRating: 0, maxDistance: 10 })}
                className="ml-auto p-3 text-gray-600 hover:text-purple-400 transition-colors"
                title="Resetear filtros"
            >
                <RotateCcw size={16} />
            </button>
        </div>
    );
}