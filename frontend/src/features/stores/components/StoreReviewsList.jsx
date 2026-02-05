import React, { useEffect, useState } from 'react';
import { Star, Trash2, MessageSquare, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { reviewService } from '../services/reviewService';

export function StoreReviewsList({ reviews, currentUser, onReviewDeleted }) {
    const [deletingId, setDeletingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [localReviews, setLocalReviews] = useState(reviews);

    useEffect(() => {
        console.log('RE-RENDERIZADO')
        setLocalReviews(reviews);
    }, [reviews]);

    const showMessage = (text, type = 'success') => {
        setStatusMessage({ text, type });
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        setConfirmDeleteId(null);

        try {
            await reviewService.deleteReview(id);
            setLocalReviews(prev => prev.filter(r => r.id !== id));
            showMessage("Reseña eliminada con éxito", "success");

            if (onReviewDeleted) {
                setTimeout(() => onReviewDeleted(), 500);
            }
        } catch (err) {
            showMessage("Error al procesar la solicitud", "error");
        } finally {
            setDeletingId(null);
        }
    };

    if (!localReviews || localReviews.length === 0) {
        return (
            <div className="pt-6 mb-4 border-t border-white/5">
                <span className="text-[10px] md:text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] italic flex items-center gap-2">
                    <MessageSquare size={12} className="md:w-[10px]" /> Sin reseñas aún
                </span>
            </div>
        );
    }

    return (
        <div className="border-t border-white/5 pt-6 mb-4 relative">
            {statusMessage && (
                <div className="fixed md:absolute top-4 md:top-2 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
                    <div className={`flex items-center gap-2 px-5 py-2.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-[9px] font-black uppercase tracking-wider shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 ${statusMessage.type === 'success'
                            ? 'bg-black/95 border-green-500/50 text-green-500'
                            : 'bg-black/95 border-red-500/50 text-red-400'
                        }`}>
                        {statusMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {statusMessage.text}
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6 md:mb-4">
                <span className="text-[9px] md:text-[8px] font-black text-purple-500/60 uppercase tracking-[0.2em]">
                    Feedback Comunidad ({localReviews.length})
                </span>
            </div>

            <div className="space-y-4 md:space-y-3">
                {localReviews.map((rev) => {
                    const isOwner = currentUser && String(currentUser.id) === String(rev.user);
                    const isConfirming = confirmDeleteId === rev.id;

                    return (
                        <div
                            key={rev.id}
                            className={`relative bg-white/[0.03] p-4 md:p-3 rounded-2xl md:rounded-xl border transition-all duration-300 ${isConfirming ? 'border-red-500/40 bg-red-500/[0.08] ring-1 ring-red-500/20 scale-[1.02] md:scale-100' :
                                    deletingId === rev.id ? 'opacity-40 grayscale pointer-events-none' : 'border-white/5 hover:border-white/10'
                                }`}
                        >
                            {isConfirming && (
                                <div className="absolute inset-0 z-20 bg-black/95 rounded-2xl md:rounded-xl flex items-center justify-between px-4 md:px-6 animate-in fade-in zoom-in-95 duration-200">
                                    <span className="text-[10px] md:text-[8px] font-black text-red-500 uppercase tracking-widest">
                                        ¿Borrar reseña?
                                    </span>
                                    <div className="flex gap-3 md:gap-2">
                                        <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="p-2 md:p-1.5 hover:bg-white/10 rounded-full md:rounded-md text-gray-400 transition-colors"
                                        >
                                            <X size={18} className="md:w-3.5 md:h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rev.id)}
                                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 md:px-3 md:py-1 rounded-full md:rounded-md text-[10px] md:text-[8px] font-black uppercase transition-all shadow-lg active:scale-95"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-3 md:mb-2">
                                <div className="flex gap-1 md:gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={`md:w-2 md:h-2 ${i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-800"}`}
                                        />
                                    ))}
                                </div>

                                {isOwner && (
                                    <button
                                        onClick={() => setConfirmDeleteId(rev.id)}
                                        disabled={deletingId !== null}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-2 md:p-1 disabled:opacity-0 active:scale-110"
                                    >
                                        <Trash2 size={16} className={`md:w-3 md:h-3 ${deletingId === rev.id ? "animate-spin" : ""}`} />
                                    </button>
                                )}
                            </div>

                            <p className="text-[12px] md:text-[10px] text-gray-300 italic leading-relaxed mb-4 md:mb-3 pr-2">
                                "{rev.comment}"
                            </p>

                            <div className="flex items-center justify-between border-t border-white/5 pt-3 md:pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] md:text-[7px] font-bold text-gray-400 uppercase tracking-tight">
                                        {rev.user_name || 'Usuario'}
                                    </span>
                                    {isOwner && (
                                        <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full text-[8px] md:text-[5px] border border-purple-500/20 font-black">
                                            MI APORTE
                                        </span>
                                    )}
                                </div>
                                <span className="text-[9px] md:text-[7px] text-gray-600 font-mono">
                                    {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}