import { useProducts } from '../context/ProductContext';
import { Layers } from 'lucide-react';

export const CategoryFilter = () => {
    const { categories, selectedCategory, setSelectedCategory } = useProducts();

    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={() => setSelectedCategory('all')}
                className={`relative px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    selectedCategory === 'all' 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105' 
                    : 'bg-[#1a1a1a] text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300'
                }`}
            >
                Todos
            </button>
            
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`group relative px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                        selectedCategory === category.name 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-[0_0_15px_rgba(147,51,234,0.3)] scale-105' 
                        : 'bg-[#1a1a1a] text-gray-500 border-gray-800 hover:border-purple-500/50 hover:text-purple-400'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {selectedCategory === category.name && <Layers size={12} className="animate-pulse" />}
                        {category.name}
                    </div>
                </button>
            ))}
        </div>
    );
};