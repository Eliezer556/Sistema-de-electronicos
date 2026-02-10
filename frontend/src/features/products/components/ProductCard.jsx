import React, { useState } from 'react';
import { ShoppingCart, Eye, CheckCircle2, Bell, X, Tag, BarChart2 } from 'lucide-react'; // Añadido BarChart2
import { useWishlist } from '../../wishlist/context/WishlistContext';
import { productService } from '../services/productService';
import { useAuth } from '../../auth/context/AuthContext';
import { PriceComparison } from './PriceComparison'; // Importamos el componente

export const ProductCard = ({ product, onViewDetail }) => {
    const { wishlists, toggleComponentInList, isInSpecificWishlist } = useWishlist();
    const { checkStockAlerts } = useAuth();
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isNotifying, setIsNotifying] = useState(product.is_notifying || false);
    
    // Estado para controlar la visibilidad de la comparativa
    const [showComparison, setShowComparison] = useState(false);

    const mainWishlist = wishlists[0];
    const isFavorite = mainWishlist ? isInSpecificWishlist(mainWishlist.id, product.id) : false;
    const imageUrl = product.image || 'https://via.placeholder.com/300x200?text=Sin+Imagen';

    const showFeedback = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: null, message: '' }), 3500);
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
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
        <div className="group bg-[#121212] rounded-[2rem] overflow-hidden border border-gray-800/50 hover:border-purple-500/30 transition-all duration-500 flex flex-col relative h-full">
            
            {/* MODAL DE COMPARACIÓN - Renderizado condicional */}
            {showComparison && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-[#121212] border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl">
                        <button 
                            onClick={() => setShowComparison(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <PriceComparison productId={product.id} product={product} />
                    </div>
                </div>
            )}

            {/* Feedback Overlay */}
            {status.type && (
                <div className={`absolute inset-x-0 top-0 z-50 p-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-in fade-in slide-in-from-top duration-300`}>
                    {status.message}
                </div>
            )}

            {/* BADGE DE OFERTA */}
            {product.is_on_offer && (
                <div className="absolute top-4 left-4 z-30 bg-orange-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                    <Tag size={10} fill="black" />
                    Oferta
                </div>
            )}

            {/* Botones de acción rápida superiores */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
                <button
                    onClick={handleNotificationClick}
                    className={`p-2.5 rounded-2xl border transition-all duration-300 ${isNotifying
                        ? 'bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                        : 'bg-black/60 border-gray-800 text-gray-100 hover:border-gray-600'
                        }`}
                >
                    <Bell size={16} fill={isNotifying ? "currentColor" : "none"} />
                </button>

                {/* BOTÓN PARA ABRIR COMPARATIVA */}
                <button
                    onClick={(e) => { e.stopPropagation(); setShowComparison(true); }}
                    className="p-2.5 rounded-2xl border bg-black/60 border-gray-800 text-gray-100 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
                    title="Comparar precios"
                >
                    <BarChart2 size={16} />
                </button>
            </div>

            <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onViewDetail(product)}>
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
                            <span className="w-1 h-1 bg-yellow-500 rounded-full animate-ping" />
                            Monitoreo activo
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>

                <div className="flex justify-between items-end mb-6">
                    <div className="flex flex-col">
                        {product.is_on_offer ? (
                            <>
                                <span className="text-[10px] text-gray-500 line-through font-bold">${Number(product.price).toLocaleString()}</span>
                                <span className="text-xl font-black text-orange-500">${Number(product.offer_price).toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="text-xl font-black text-white">${Number(product.price).toLocaleString()}</span>
                        )}
                    </div>
                    <div className="text-right pb-1">
                        <span className={`text-[10px] uppercase font-bold ${product.stock < 10 && product.stock > 0 ? 'text-orange-500' : 'text-gray-500'}`}>
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
                    {product.stock <= 0 ? (
                        <button disabled className='flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed'>
                            <X size={15} /> Agotado
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