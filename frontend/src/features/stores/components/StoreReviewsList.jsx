import React, { useState } from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import { reviewService } from '../services/reviewService';

export function StoreReviewsList({ reviews, currentUser, onReviewDeleted }) {
    const [deletingId, setDeletingId] = useState(null);

    // Si no hay reseñas, mostramos un estado vacío elegante
    if (!reviews || reviews.length === 0) {
        return (
            <div className="pt-4 mb-4 border-t border-white/5">
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em] italic flex items-center gap-2">
                    <MessageSquare size={10} /> Sin reseñas aún
                </span>
            </div>
        );
    }

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta reseña?")) return;
        
        setDeletingId(id);
        try {
            await reviewService.deleteReview(id);
            onReviewDeleted(); // Refresca la lista de tiendas en el padre
        } catch (err) {
            console.error("Error al eliminar reseña:", err);
            alert("No se pudo eliminar la reseña");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="border-t border-white/5 pt-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <span className="text-[8px] font-black text-purple-500/50 uppercase tracking-[0.2em]">
                    Feedback Comunidad ({reviews.length})
                </span>
            </div>
            
            {/* Contenedor con scroll para mantener la Card compacta */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-500/20">
                {reviews.map((rev) => (
                    <div 
                        key={rev.id} 
                        className="relative bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all group/item"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={8} 
                                        fill={i < rev.rating ? "currentColor" : "none"} 
                                        className={i < rev.rating ? "text-yellow-500" : "text-gray-800"} 
                                    />
                                ))}
                            </div>
                            
                            {/* Botón borrar: visible solo si el usuario es dueño de la reseña */}
                            {currentUser && (currentUser.id === rev.user) && (
                                <button 
                                    onClick={() => handleDelete(rev.id)} 
                                    disabled={deletingId === rev.id}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-1 disabled:opacity-30"
                                >
                                    <Trash2 size={10} />
                                </button>
                            )}
                        </div>

                        <p className="text-[10px] text-gray-400 italic leading-relaxed mb-2">
                            "{rev.comment}"
                        </p>

                        <div className="flex items-center justify-between">
                            <span className="text-[7px] font-bold text-gray-600 uppercase tracking-tighter">
                                {rev.user_name || 'Usuario Anónimo'}
                            </span>
                            <span className="text-[7px] text-gray-700">
                                {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}