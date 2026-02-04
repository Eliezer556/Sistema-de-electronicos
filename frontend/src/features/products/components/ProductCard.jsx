import React, { useState } from 'react';
import { ShoppingCart, Eye, CheckCircle2, Bell, X } from 'lucide-react';
import { useWishlist } from '../../wishlist/context/WishlistContext';
import { productService } from '../services/productService';
import { useAuth } from '../../auth/context/AuthContext';

export const ProductCard = ({ product, onViewDetail }) => {
    const { wishlists, toggleComponentInList, isInSpecificWishlist } = useWishlist();
    const { checkStockAlerts } = useAuth();
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isNotifying, setIsNotifying] = useState(product.is_notifying || false);

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
        if (!isFavorite) showFeedback('success', 'Añadido a Wishlist');
    };

    const handleNotificationClick = async (e) => {
        e.stopPropagation();
        try {
            const result = await productService.toggleStockNotification(product.id);
            if (result.success) {
                setIsNotifying(result.data.is_notifying);
                showFeedback('success', result.data.message);
                await checkStockAlerts();
            }
        } catch (error) {
            showFeedback('error', 'Error al configurar alerta');
        }
    };

    return (
        <div className="group bg-[#121212] rounded-[2rem] overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-500 flex flex-col relative">
            {status.type && (
                <div className={`absolute inset-x-0 top-0 z-40 p-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-in fade-in slide-in-from-top duration-300`}>
                    {status.message}
                </div>
            )}

            <button
                onClick={handleNotificationClick}
                className={`absolute top-4 right-4 z-30 p-2.5 rounded-2xl border transition-all duration-300 group/bell ${isNotifying
                    ? 'bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                    : 'bg-black/60 border-gray-800 text-gray-100 hover:border-gray-600 hover:text-white'
                    }`}
                title={isNotifying ? "Quitar alerta de stock" : "Avisarme cuando haya poco stock"}
            >
                <Bell size={16} fill={isNotifying ? "currentColor" : "none"} className={isNotifying ? "animate-pulse" : ""} />
            </button>

            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-60" />
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="mb-2 h-4">
                    {isNotifying && (
                        <span className="text-[8px] font-black text-yellow-500 uppercase tracking-tighter flex items-center gap-1">
                            <span className="w-1 h-1 bg-yellow-500 rounded-full" />
                            Monitoreo de stock activo
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-black text-white">${product.price}</span>
                    <div className="text-right">
                        <span className={`text-[10px] uppercase font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-gray-500'}`}>
                            Stock: {product.stock}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                        onClick={() => onViewDetail(product)}
                        className="flex items-center justify-center gap-2 bg-[#1a1a1a] text-gray-400 py-3 rounded-xl text-[10px] font-black uppercase border border-gray-800 hover:border-gray-600 hover:text-white transition-colors"
                    >
                        <Eye size={14} /> Detalle
                    </button>
                    {product.stock === 0 ? (
                        <button
                            disabled
                            className='flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase bg-gray-800 text-gray-500 cursor-not-allowed'
                        >
                            <X size={15} />
                            Agotado
                        </button>
                    ) : (
                        <button
                            onClick={handleWishlistClick}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${isFavorite
                                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                : 'bg-white text-black hover:bg-gray-200'
                                }`}
                        >
                            {isFavorite ? <CheckCircle2 size={14} /> : <ShoppingCart size={14} />}
                            {isFavorite ? 'En Lista' : 'Añadir'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};