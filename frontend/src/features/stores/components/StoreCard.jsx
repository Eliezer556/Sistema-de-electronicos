import React, { useMemo } from 'react';
import { MapPin, Store as StoreIcon, ExternalLink, Star, Navigation, X, MessageSquare, ArrowLeft } from 'lucide-react';
import { getDistance } from './StoreList';
import { InteractiveRating } from './InteractiveRating';
import { StoreReviewsList } from './StoreReviewsList';
import { StoreApiMap } from '../../../storeApi/StoreApiMap';

const MAPTILER_KEY = "Zz7Zqun983rj2N26CNUp";

export function StoreFullPage({ store, onClose, currentUser, onVoteSuccess }) {
    if (!store) return null;

    return (
        <div className="relative w-full min-h-screen bg-[#050505] flex flex-col overflow-hidden animate-in fade-in duration-500">
            {/* Nav interna ajustada */}
            <nav className="h-14 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cerrar Detalle</span>
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-white text-[11px] font-black uppercase italic tracking-tighter">{store.name}</span>
                </div>
            </nav>

            {/* Contenedor de Contenido: Ahora fluye en el layout */}
            <div className="flex-grow flex flex-col lg:flex-row">
                {/* Panel Izquierdo: Info y Mapa */}
                <div className="w-full lg:w-3/5 p-6 lg:p-10 space-y-8 border-r border-white/5">
                    <div className="relative aspect-video bg-gray-900 overflow-hidden border border-white/10 rounded-sm">
                        {store.image ? (
                            <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-purple-950/10">
                                <StoreIcon size={50} className="text-white/5" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-purple-600 text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest">
                                {store.category || 'Premium Store'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">{store.name}</h1>
                            <p className="text-gray-400 text-sm leading-relaxed italic border-l-2 border-purple-500 pl-4 py-1">
                                {store.description || "Componentes de alta fidelidad y servicio técnico especializado."}
                            </p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm text-center flex flex-col justify-center">
                            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Rating Global</div>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-4xl font-black text-yellow-500 italic tracking-tighter">{store.rating_average || '0.0'}</span>
                                <Star size={16} fill="#eab308" className="text-yellow-500" />
                            </div>
                            <div className="mt-2 pt-2 border-t border-white/5">
                                <span className="text-[9px] font-bold text-gray-500 uppercase">
                                    {store.total_reviews || 0} reseñas
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación y Mapa */}
                    <div className="space-y-4">
                        <div className="p-4 md:p-5 bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between rounded-sm">
                            <div className="flex gap-4 items-start w-full min-w-0">
                                <div className="p-2 bg-purple-500/10 rounded-sm shrink-0">
                                    <MapPin className="text-purple-500" size={18} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">
                                        Ubicación Física
                                    </div>
                                    <div className="text-[11px] md:text-xs text-white font-bold uppercase truncate leading-tight" title={store.address}>
                                        {store.address}
                                    </div>
                                </div>
                            </div>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto px-5 py-3 bg-white text-black hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3 rounded-sm group shrink-0"
                            >
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                                    Abrir GPS
                                </span>
                                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>

                        <div className="rounded-sm overflow-hidden border border-white/10 h-[350px] relative">
                            <StoreApiMap
                                lat={parseFloat(store.latitude)}
                                lon={parseFloat(store.longitude)}
                                apiKey={MAPTILER_KEY}
                            />
                        </div>
                    </div>
                </div>

                {/* Panel Derecho: Activity Feed */}
                <div className="w-full lg:w-2/5 bg-black/20 p-6 lg:p-10">
                    <div className="sticky top-24 space-y-8">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="text-purple-500" size={18} />
                            <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Comunidad</h2>
                            <div className="h-px flex-grow bg-white/10" />
                        </div>

                        {currentUser?.role === 'cliente' && (
                            <div className="bg-white/[0.03] p-6 border border-white/5 rounded-sm">
                                <h3 className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                                    Tu Opinión
                                </h3>
                                <InteractiveRating storeId={store.id} onVoteSuccess={onVoteSuccess} />
                            </div>
                        )}

                        <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <StoreReviewsList
                                reviews={store.reviews}
                                currentUser={currentUser}
                                onReviewDeleted={onVoteSuccess}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StoreCard({ store, userLocation, currentUser, onVoteSuccess }) {
    const [isPageOpen, setIsPageOpen] = React.useState(false);

    const distance = useMemo(() => {
        if (!userLocation || !store.latitude || !store.longitude) return null;
        return getDistance(userLocation.lat, userLocation.lon, store.latitude, store.longitude)?.toFixed(1);
    }, [userLocation, store]);

    return (
        <>
            <div
                onClick={() => setIsPageOpen(true)}
                className="group bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden flex flex-col hover:border-purple-500/40 transition-all duration-500 cursor-pointer"
            >
                <div className="relative h-40 bg-gray-950 overflow-hidden">
                    {store.image ? (
                        <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <StoreIcon size={32} className="text-white/5 group-hover:text-purple-500/20 transition-colors" />
                        </div>
                    )}
                    {distance && (
                        <div className="absolute top-0 left-0 bg-purple-600 text-white text-[7px] font-black px-2 py-1 flex items-center gap-1 uppercase tracking-tighter">
                            <Navigation size={7} fill="currentColor" /> {distance} KM
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-xs font-black text-white tracking-widest uppercase italic line-clamp-1">{store.name}</h3>
                        <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 border border-white/5 shrink-0">
                            <span className="text-[9px] font-black text-yellow-500">{store.rating_average || '0.0'}</span>
                        </div>
                    </div>

                    <div className="mt-auto flex justify-between items-center text-[7px] font-bold uppercase tracking-[0.15em]">
                        <span className="text-gray-500">{store.total_reviews || 0} REVIEWS</span>
                        <span className="text-purple-500 group-hover:translate-x-1 transition-transform">DETAILS +</span>
                    </div>
                </div>
            </div>

            {isPageOpen && (
                <StoreFullPage
                    store={store}
                    currentUser={currentUser}
                    onVoteSuccess={onVoteSuccess}
                    onClose={() => setIsPageOpen(false)}
                />
            )}
        </>
    );
}