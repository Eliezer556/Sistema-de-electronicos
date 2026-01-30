import React, { useState, useEffect, useMemo } from 'react';
import {
    MapPin, Cpu, Puzzle, 
    Store as StoreIcon, ExternalLink, 
    Star, Navigation, RotateCcw, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeService } from '../services/storeService';
import { reviewService } from '../services/reviewService';
import { StoreSearch } from './StoreSearch';
import { Loading } from '../../../components/Loading';

const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export function StoreList() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ minRating: 0, maxDistance: 10 });

    const currentUser = JSON.parse(localStorage.getItem('user')); 

    const fetchStores = async () => {
        try {
            const data = await storeService.getStores();
            setStores(data);
        } catch (err) {
            console.error("Error al cargar tiendas:", err);
        }
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await fetchStores();
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                    () => console.log("GPS denegado")
                );
            }
            setLoading(false);
        };
        initData();
    }, []);

    const filteredStores = useMemo(() => {
        return stores.filter(store => {
            const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                store.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRating = (store.rating || 0) >= filters.minRating;
            let matchesDistance = true;
            if (userLocation && store.latitude && store.longitude) {
                const dist = getDistance(userLocation.lat, userLocation.lon, parseFloat(store.latitude), parseFloat(store.longitude));
                matchesDistance = dist <= filters.maxDistance;
            }
            return matchesSearch && matchesRating && matchesDistance;
        });
    }, [stores, searchTerm, filters, userLocation]);

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col">
            <header className="mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <Cpu className="text-purple-500" size={18} />
                            </div>
                            <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">Hardware Central</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">
                            Catálogo de <br />
                            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Tiendas</span>
                        </h1>
                    </div>
                    <div className="w-full lg:max-w-md">
                        <Link to="/" className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-gray-800 text-gray-400 px-6 py-4 rounded-2xl hover:text-white hover:border-purple-500/50 transition-all text-[10px] font-black uppercase tracking-widest group mb-3">
                            <Puzzle size={18} /> Buscar por componente
                        </Link>
                        <StoreSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-gray-800 rounded-[0.5rem] p-6 mb-8 flex flex-wrap items-center gap-8">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Star size={12} fill="currentColor" /> Calificación Mínima
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === star ? 0 : star }))}
                                    className={`transition-all ${filters.minRating >= star ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'}`}
                                >
                                    <Star size={20} fill={filters.minRating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

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
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-30"
                        />
                    </div>

                    <button 
                        onClick={() => setFilters({ minRating: 0, maxDistance: 10 })}
                        className="ml-auto p-3 text-gray-600 hover:text-purple-400 transition-colors"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStores.map((store) => (
                    <StoreCard 
                        key={store.id} 
                        store={store} 
                        userLocation={userLocation} 
                        currentUser={currentUser} 
                        onVoteSuccess={fetchStores} 
                    />
                ))}
            </div>
        </div>
    );
}

function StoreCard({ store, userLocation, currentUser, onVoteSuccess }) {
    const distance = useMemo(() => {
        if (!userLocation) return null;
        return getDistance(userLocation.lat, userLocation.lon, store.latitude, store.longitude)?.toFixed(1);
    }, [userLocation, store]);

    return (
        <div className="group bg-[#0a0a0a] border border-gray-800 rounded-[0.5rem] overflow-hidden flex flex-col hover:border-purple-500/40 transition-all duration-500">
            <div className="relative h-48 bg-gray-900 overflow-hidden">
                {store.image ? (
                    <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-950">
                        <StoreIcon size={48} className="text-gray-800 group-hover:text-purple-500/20" />
                    </div>
                )}
                {distance && (
                    <div className="absolute top-4 left-4 bg-purple-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                        <Navigation size={10} fill="currentColor" /> {distance} KM
                    </div>
                )}
            </div>

            <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase italic line-clamp-1">{store.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">
                        <span className="text-sm font-black text-yellow-400">{store.rating || 0}</span>
                        <Star size={12} className="text-yellow-400" fill="currentColor" />
                    </div>
                </div>

                <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                            key={s} 
                            size={16} 
                            className={(store.rating || 0) >= s ? 'text-yellow-400' : 'text-gray-800'} 
                            fill={(store.rating || 0) >= s ? "currentColor" : "none"} 
                        />
                    ))}
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 italic">{store.description || "Sin descripción."}</p>

                <div className="mt-auto space-y-4">
                    <div className="flex items-start gap-3 text-gray-400">
                        <MapPin size={16} className="text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-bold uppercase leading-tight">{store.address}</span>
                    </div>

                    {currentUser?.role === 'cliente' && (
                        <div className="pt-4 border-t border-gray-800/50">
                            <InteractiveRating storeId={store.id} onVoteSuccess={onVoteSuccess} />
                        </div>
                    )}

                    <a href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all active:scale-95"
                    >
                        <ExternalLink size={14} /> Ver Ubicación
                    </a>
                </div>
            </div>
        </div>
    );
}

function InteractiveRating({ storeId, onVoteSuccess }) {
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [voted, setVoted] = useState(false);

    const handleVote = async (val) => {
        setSubmitting(true);
        try {
            await reviewService.createReview({ 
                store: storeId, 
                rating: val, 
                comment: "Puntuado desde catálogo" 
            });
            setVoted(true);
            onVoteSuccess();
        } catch (err) {
            alert("Ya has calificado esta tienda.");
        } finally {
            setSubmitting(false);
        }
    };

    if (voted) return (
        <div className="flex items-center justify-center gap-2 text-green-500 text-[10px] font-black uppercase py-2">
            <CheckCircle2 size={14} /> ¡Gracias por calificar!
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Tu puntuación</span>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                        key={s} 
                        onMouseEnter={() => setHover(s)} 
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleVote(s)} 
                        disabled={submitting}
                        className="transition-all duration-200 hover:scale-125 disabled:opacity-30"
                    >
                        <Star 
                            size={24} 
                            className={`transition-colors ${(hover || 0) >= s ? 'text-yellow-400' : 'text-gray-800'}`}
                            fill={(hover || 0) >= s ? "currentColor" : "none"} 
                            strokeWidth={2} 
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}