import React, { useState } from 'react';
import { 
    ShoppingCart, CheckCircle2, AlertCircle, Cpu, 
    ArrowLeft, FileText, Package, Database, HardDrive, ExternalLink 
} from 'lucide-react';
import { useWishlist } from '../../wishlist/context/WishlistContext';

export const ProductDetail = ({ product, onBack }) => {
    const { wishlists, toggleComponentInList, isInSpecificWishlist } = useWishlist();
    const [status, setStatus] = useState({ type: null, message: '' });

    const mainWishlist = wishlists[0];
    const isFavorite = mainWishlist ? isInSpecificWishlist(mainWishlist.id, product.id) : false;
    const imageUrl = product.image || 'https://via.placeholder.com/600x400?text=Sin+Imagen';

    const showFeedback = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    };

    const handleWishlistClick = () => {
        if (!mainWishlist) return showFeedback('error', 'Crea una lista primero');
        toggleComponentInList(mainWishlist.id, product.id);
        if (!isFavorite) showFeedback('success', 'Componente añadido');
    };

    return (
        <div className="min-h-screen bg-[#080808] text-gray-200 p-4 md:p-12 animate-in fade-in duration-500">
            {/* Header de navegación refinado */}
            <div className="max-w-6xl mx-auto mb-10">
                <button 
                    onClick={onBack}
                    className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                    Regresar al inventario
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Columna Imagen (4/12) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="aspect-square bg-[#111] rounded-2xl border border-gray-800 flex items-center justify-center p-8 relative group overflow-hidden">
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-md border border-white/5 text-[9px] font-mono text-gray-400">
                                ID: {product.id.toString().padStart(4, '0')}
                            </span>
                        </div>
                    </div>
                    
                    {/* Acciones Secundarias: Datasheet */}
                    {product.datasheet_url && (
                        <a 
                            href={product.datasheet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 rounded-xl text-[11px] font-bold uppercase tracking-tighter transition-all text-gray-300"
                        >
                            <FileText size={16} className="text-blue-500" />
                            Ver Datasheet Técnico
                            <ExternalLink size={12} className="opacity-50" />
                        </a>
                    )}
                </div>

                {/* Columna Información (7/12) */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="mb-6 border-b border-gray-800 pb-6">
                        <div className="flex items-center gap-2 text-blue-500 mb-3">
                            <Cpu size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{product.category_name}</span>
                        </div>
                        
                        <h1 className="text-3xl font-medium text-white mb-2 tracking-tight">{product.name}</h1>
                        <p className="text-gray-500 text-sm font-mono tracking-tight uppercase">MPN: {product.mpn || 'N/A'}</p>
                    </div>

                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-4xl font-light text-white">${product.price}</span>
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                {product.stock > 0 ? `En Stock (${product.stock} unidades)` : 'Sin Existencias'}
                            </span>
                        </div>
                    </div>

                    {/* Ficha Técnica Estructurada */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <div className="p-4 bg-[#111] rounded-xl border border-gray-800/50">
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Tienda de origen</p>
                            <p className="text-sm text-gray-200">{product.store_name}</p>
                        </div>
                        <div className="p-4 bg-[#111] rounded-xl border border-gray-800/50">
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Disponibilidad</p>
                            <p className="text-sm text-gray-200">{product.stock_status}</p>
                        </div>
                    </div>

                    {/* Especificaciones Dinámicas */}
                    {product.technical_specs && Object.keys(product.technical_specs).length > 0 && (
                        <div className="mb-10">
                            <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest flex items-center gap-2">
                                <Database size={12} /> Especificaciones de Hardware
                            </h4>
                            <div className="bg-[#0d0d0d] rounded-2xl border border-gray-800 divide-y divide-gray-800">
                                {Object.entries(product.technical_specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between p-4 text-sm">
                                        <span className="text-gray-500">{key}</span>
                                        <span className="text-gray-200 font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-auto space-y-4">
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest flex items-center gap-2">
                                <Database size={12} /> Descripcion del componente
                            </h4>
                            <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={handleWishlistClick}
                                disabled={product.stock <= 0}
                                className={`flex-[3] py-5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                                    isFavorite 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                    : 'bg-white text-black hover:bg-blue-500 hover:text-white'
                                } disabled:opacity-30 disabled:grayscale`}
                            >
                                {isFavorite ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
                                {isFavorite ? 'En el Proyecto' : 'Añadir al Proyecto'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Toast Refinado */}
            {status.type && (
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest shadow-2xl animate-in slide-in-from-bottom-5 ${
                    status.type === 'success' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {status.message}
                </div>
            )}
        </div>
    );
};