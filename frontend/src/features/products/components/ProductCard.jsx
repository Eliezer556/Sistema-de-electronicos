import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Bell, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import { useWishlist } from '../../wishlist/context/WishlistContext';
import api from '../../../api/axios';

export const ProductCard = ({ product }) => {
    const { wishlists, toggleComponentInList, isInSpecificWishlist } = useWishlist();
    const [status, setStatus] = useState({ type: null, message: '' });

    const mainWishlist = wishlists[0];
    const isFavorite = mainWishlist ? isInSpecificWishlist(mainWishlist.id, product.id) : false;
    const imageUrl = product.image ? product.image : 'https://via.placeholder.com/300x200?text=Sin+Imagen';

    const handleWishlistClick = () => {
        if (!mainWishlist) return;
        toggleComponentInList(mainWishlist.id, product.id);
    };

    const showFeedback = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: null, message: '' }), 3500);
    };

    const handleNotifyMe = async () => {
        if (!mainWishlist) {
            showFeedback('error', 'Crea una lista primero');
            return;
        }
        try {
            const response = await api.post(`/wishlist/${mainWishlist.id}/notify-me/`, {
                product_id: product.id
            });
            if (response.status === 201 || response.status === 200) {
                showFeedback('success', '¡Alerta activada!');
            }
        } catch (error) {
            showFeedback('error', 'Error al activar');
        }
    };

    return (
        <div className="group bg-[#121212] rounded-[2rem] overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-500 flex flex-col relative shadow-2xl hover:shadow-purple-500/10">
            
            {status.type && (
                <div className={`absolute inset-x-0 top-0 z-30 p-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 animate-in slide-in-from-top ${
                    status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {status.message}
                </div>
            )}

            <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 opacity-60"></div>
                
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-4 left-4 z-20 p-2.5 rounded-xl backdrop-blur-md transition-all transform active:scale-90 ${
                        isFavorite 
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                        : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                    }`}
                >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-4 right-4 z-20 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-400 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg tracking-widest">
                    {product.category_name || 'General'}
                </div>
            </div>

            <div className="p-6 flex-grow flex flex-col relative">
                <div className="flex-grow">
                    <p className="text-[10px] text-blue-400 font-black mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Cpu size={12} /> {product.store_name || 'UNEFA Store'}
                    </p>
                    <h3 className="text-xl font-bold text-white line-clamp-1 mb-2 group-hover:text-purple-400 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 leading-relaxed">
                        {product.description || 'Sin descripción técnica disponible.'}
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-800/50 pt-4">
                    <div>
                        <span className="text-2xl font-black text-white tracking-tighter">
                            ${product.price}
                        </span>
                    </div>
                    <div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase ${
                            product.stock > 0 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] text-gray-400 py-3 rounded-xl hover:bg-[#252525] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-gray-800">
                        <Eye size={14} /> Detalle
                    </button>

                    {product.stock > 0 ? (
                        <button className="flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95">
                            <ShoppingCart size={14} /> Añadir
                        </button>
                    ) : (
                        <button
                            onClick={handleNotifyMe}
                            disabled={status.type === 'success'}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${
                                status.type === 'success' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white'
                            }`}
                        >
                            {status.type === 'success' ? (
                                <CheckCircle2 size={14} />
                            ) : (
                                <Bell size={14} />
                            )}
                            {status.type === 'success' ? 'Ok' : 'Avisarme'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};