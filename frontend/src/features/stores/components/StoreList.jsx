import React, { useState, useEffect, useMemo } from 'react';
import { Cpu, Puzzle, Store as StoreIcon, Star, Navigation, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeService } from '../services/storeService'
import { StoreSearch } from './StoreSearch';
import { Loading } from '../../../components/Loading'
import { StoreCard } from './StoreCard';
import { StoreFullPage } from './StoreCard';
import { useAuth } from '../../auth/context/AuthContext';

export const getDistance = (lat1, lon1, lat2, lon2) => {
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

    // Estado para manejar la vista de detalle
    const [selectedStore, setSelectedStore] = useState(null);

    const { user } = useAuth()

    const fetchStores = async () => {
        try {
            const data = await storeService.getStores();
            setStores(data);
        } catch (err) {
            console.error("Error fetching stores:", err);
        }
    };

    const USUARIO_PRUEBA = {
        id: 1,
        name: 'juan',
        correo: 'juan@gmail.com',
        clave: '123123'
    }

    useEffect(() => {
        console.log('StoreList.jsx tu usuario: ', user)
    }, [])

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await fetchStores();
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => setUserLocation({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude
                    }),
                    () => console.warn("Location access denied")
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
                const dist = getDistance(
                    userLocation.lat,
                    userLocation.lon,
                    parseFloat(store.latitude),
                    parseFloat(store.longitude)
                );
                matchesDistance = dist <= filters.maxDistance;
            }
            return matchesSearch && matchesRating && matchesDistance;
        });
    }, [stores, searchTerm, filters, userLocation]);

    if (loading) return <Loading />;

    if (selectedStore) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
                <div className="w-full">
                    <button
                        onClick={() => setSelectedStore(null)}
                        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-500 transition-colors"
                    >
                        <RotateCcw size={14} /> Volver a las tiendas
                    </button>

                    <StoreFullPage
                        store={selectedStore}
                        userLocation={userLocation}
                        currentUser={user}
                        userTesting={USUARIO_PRUEBA}
                        onVoteSuccess={fetchStores} 
                    />
                </div>
            </div>
        );
    }

    // --- VISTA DE LISTA ---
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <Cpu className="text-purple-500" size={18} />
                            </div>
                            <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">
                                Partner.Network.v2
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                            Nuestras <span className="text-gray-600 italic-none">Tiendas</span>
                        </h1>
                    </div>

                    <div className="w-full lg:max-w-md space-y-3">
                        <Link to="/" className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 text-gray-400 px-6 py-4 rounded-xl hover:text-white hover:border-purple-500/50 transition-all text-[10px] font-black uppercase tracking-widest group">
                            <Puzzle size={16} className="group-hover:rotate-12 transition-transform" />
                            Buscar por componente
                        </Link>
                        <StoreSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-wrap items-center gap-10 shadow-2xl">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Star size={12} className="text-purple-500" /> Calificación Mínima
                        </label>
                        <div className="flex gap-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setFilters(prev => ({
                                        ...prev,
                                        minRating: prev.minRating === star ? 0 : star
                                    }))}
                                    className={`transition-all transform hover:scale-110 ${filters.minRating >= star ? 'text-yellow-400' : 'text-gray-800 hover:text-gray-600'
                                        }`}
                                >
                                    <Star size={18} fill={filters.minRating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 flex-grow max-w-xs">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center justify-between">
                            <span className="flex items-center gap-2 text-purple-500">
                                <Navigation size={12} /> Radio de cercanía
                            </span>
                            <span className="text-white bg-purple-500/20 px-2 py-0.5 rounded text-[10px]">
                                {filters.maxDistance} KM
                            </span>
                        </label>
                        <input
                            type="range" min="1" max="50"
                            value={filters.maxDistance}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                maxDistance: parseInt(e.target.value)
                            }))}
                            disabled={!userLocation}
                            className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-20"
                        />
                    </div>

                    <button
                        onClick={() => setFilters({ minRating: 0, maxDistance: 10 })}
                        className="ml-auto flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white border border-transparent hover:border-white/10 rounded-lg transition-all"
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </header>

            {filteredStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map((store) => (
                        <div key={store.id} onClick={() => setSelectedStore(store)} className="cursor-pointer">
                            <StoreCard
                                store={store}
                                userLocation={userLocation}
                                userTesting={USUARIO_PRUEBA}
                                currentUser={user}
                                onVoteSuccess={fetchStores}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#111] rounded-3xl border border-dashed border-white/10">
                    <StoreIcon size={40} className="mx-auto text-gray-800 mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">
                        No se encontraron tiendas
                    </p>
                </div>
            )}
        </div>
    );
}