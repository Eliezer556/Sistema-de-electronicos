import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, TrendingUp, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { searchService } from '../services/searchService';

export const SearchBar = () => {
    const { searchTerm, setSearchTerm } = useProducts();
    const [suggestions, setSuggestions] = useState({ popular: [], recent: [] });
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    const fetchSuggestions = async () => {
        const result = await searchService.getSuggestions();
        if (result.success) {
            setSuggestions(result.data);
            setShowDropdown(true);
        }
    };

    const handleSaveSearch = async (queryToSave) => {
        const query = queryToSave || searchTerm;
        if (!query || !query.trim() || query.trim().length < 3) return;

        await searchService.saveSearch(query.trim());
    };

    const handleSelectSuggestion = (value) => {
        setSearchTerm(value);
        handleSaveSearch(value);
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`h-4 w-4 transition-colors ${showDropdown ? 'text-purple-500' : 'text-gray-500'}`} />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-11 py-3 border border-gray-800 rounded-2xl bg-[#1a1a1a]/50 backdrop-blur-md focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 focus:bg-[#1a1a1a] text-sm transition-all text-white placeholder-gray-600 outline-none"
                    placeholder="Buscar componentes..."
                    value={searchTerm}
                    onFocus={fetchSuggestions}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSaveSearch();
                            setShowDropdown(false);
                        }
                    }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm('');
                            setShowDropdown(false);
                        }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center group/btn"
                    >
                        <div className="p-1 rounded-md group-hover/btn:bg-white/10 transition-colors">
                            <X className="h-4 w-4 text-gray-500 group-hover/btn:text-white" />
                        </div>
                    </button>
                )}
            </div>

            {showDropdown && (suggestions.popular.length > 0 || suggestions.recent.length > 0) && (
                <div className="absolute top-full mt-3 w-full bg-[#121212]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 z-50 overflow-hidden py-3 animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.recent.length > 0 && (
                        <div className="px-4 py-2 mb-2">
                            <p className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
                                <History size={12} className="text-gray-600" /> RECIENTES
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.recent.map((s, idx) => (
                                    <button
                                        key={`recent-${idx}`}
                                        type="button"
                                        onClick={() => handleSelectSuggestion(s)}
                                        className="text-[11px] bg-[#1a1a1a] hover:bg-purple-500/10 text-gray-300 hover:text-purple-400 px-3 py-1.5 rounded-lg transition-all border border-gray-800 hover:border-purple-500/30 font-medium"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {suggestions.popular.length > 0 && (
                        <div className="mt-2">
                            <p className="px-4 flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">
                                <TrendingUp size={12} className="animate-pulse" /> POPULARES
                            </p>
                            {suggestions.popular.map((s, idx) => (
                                <button
                                    key={`popular-${idx}`}
                                    type="button"
                                    onClick={() => handleSelectSuggestion(s)}
                                    className="w-full text-left px-4 py-3 text-xs text-gray-400 hover:bg-white/5 flex items-center justify-between group transition-all"
                                >
                                    <span className="group-hover:text-white transition-colors">{s}</span>
                                    <Sparkles size={12} className="text-gray-700 group-hover:text-blue-400 transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};