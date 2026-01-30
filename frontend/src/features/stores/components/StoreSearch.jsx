import { Search, X } from 'lucide-react';

export function StoreSearch({ searchTerm, setSearchTerm }) {
    return (
        <div className="relative group w-full">
            {/* Icono de Lupa */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors">
                <Search size={16} />
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tienda"
                className="w-full bg-black/40 border border-gray-800 text-white text-xs pl-11 pr-10 py-3.5 rounded-xl focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
            />

            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}