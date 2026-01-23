import React, { useState } from 'react';
import { ShoppingCart, Eye, CheckCircle2, AlertCircle, Cpu, Bell } from 'lucide-react';
import { useWishlist } from '../../wishlist/context/WishlistContext';

export const ProductCard = ({ product, onViewDetail }) => {
    const { wishlists, toggleComponentInList, isInSpecificWishlist } = useWishlist();
    const [status, setStatus] = useState({ type: null, message: '' });

    const mainWishlist = wishlists[0];
    const isFavorite = mainWishlist ? isInSpecificWishlist(mainWishlist.id, product.id) : false;
    const imageUrl = product.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen';

    const showFeedback = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: null, message: '' }), 3500);
    };

    const handleWishlistClick = () => {
        if (!mainWishlist) return showFeedback('error', 'Crea una lista primero');
        toggleComponentInList(mainWishlist.id, product.id);
        if (!isFavorite) showFeedback('success', 'Añadido');
    };

    return (
        <div className="group bg-[#121212] rounded-[2rem] overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-500 flex flex-col relative">
            {status.type && (
                <div className={`absolute inset-x-0 top-0 z-30 p-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {status.message}
                </div>
            )}

            <div className="relative h-48 overflow-hidden">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-black text-white">${product.price}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Stock: {product.stock}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button 
                        onClick={() => onViewDetail(product)}
                        className="flex items-center justify-center gap-2 bg-[#1a1a1a] text-gray-400 py-3 rounded-xl text-[10px] font-black uppercase border border-gray-800 hover:text-white"
                    >
                        <Eye size={14} /> Detalle
                    </button>
                    <button 
                        onClick={handleWishlistClick}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${isFavorite ? 'bg-purple-600 text-white' : 'bg-white text-black'}`}
                    >
                        {isFavorite ? <CheckCircle2 size={14} /> : <ShoppingCart size={14} />}
                        {isFavorite ? 'En Lista' : 'Añadir'}
                    </button>
                </div>
            </div>
        </div>
    );
};