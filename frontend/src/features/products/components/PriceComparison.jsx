import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Loader2, ExternalLink, AlertCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PriceComparison = ({ productId, product, currentPrice, currentImage, currentStore }) => {
    const [comparisons, setComparisons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                setLoading(true);
                const response = await productService.getPriceComparison(productId);
                if (response.success) {
                    setComparisons(response.data);
                } else {
                    setError('No se pudieron obtener los precios');
                }
            } catch (err) {
                setError('Error de conexión con el servidor');
            } finally {
                setLoading(false);
            }
        };

        if (productId) fetchPrices();
    }, [productId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse">Buscando mejores precios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-red-400 gap-2">
                <AlertCircle size={32} />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* PRODUCTO ACTUAL - CABECERA */}
            <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-4">
                <p className="text-[12px] text-purple-400 font-bold uppercase tracking-tighter mb-3">Producto Actual</p>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700">

                        <img src={product.image} alt={product} className="w-full h-full object-cover" />

                        <div className="w-full h-full flex items-center justify-center text-gray-600"><Package size={20} /></div>

                    </div>
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold text-white leading-tight truncate">{product.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-purple-400 font-black text-xl">${Number(product.price).toLocaleString()}</span>
                            <span className="text-gray-500 text-xs truncate">en {product.store_name}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[#0f0f0f] px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Otras Tiendas</span>
                </div>
            </div>

            {/* LISTA DE COMPARACIÓN */}
            <div className="grid gap-3">
                {comparisons.length > 0 ? (
                    comparisons.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden flex-shrink-0 border border-gray-800">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700"><Package size={16} /></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-purple-400 font-bold uppercase truncate">
                                    {item.store_name}
                                </p>
                                <h3 className="text-sm font-medium text-gray-300 truncate">{item.name}</h3>
                                {/* {item.mpn && <p className="text-[9px] text-gray-600 font-mono">MPN: {item.mpn}</p>} */}
                            </div>

                            <div className="text-right flex flex-col items-end gap-1">
                                <span className="text-md font-black text-white">${Number(item.price).toLocaleString()}</span>
                                <button
                                    onClick={() => navigate(`/componente/${item.id}`)}
                                    className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-[10px] font-bold uppercase"
                                >
                                    Ver producto <ExternalLink size={10} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-900/30 rounded-2xl border border-dashed border-gray-800">
                        <p className="text-gray-500 text-sm italic">No se encontraron otras ofertas para este MPN.</p>
                    </div>
                )}
            </div>
        </div>
    );
};