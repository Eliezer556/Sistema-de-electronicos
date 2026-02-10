import React, { useEffect, useState } from 'react';
import { Star, Trash2, MessageSquare, AlertCircle, CheckCircle2, X, PencilLine, Save } from 'lucide-react';
import { reviewService } from '../services/reviewService';

export function StoreReviewsList({ storeId, reviews, currentUser, onReviewDeleted }) {
    const [deletingId, setDeletingId] = useState(null);
    const [updating, setUpdating] = useState(null)
    const [editData, setEditData] = useState({ rating: 0, comment: '' });
    const [statusMessage, setStatusMessage] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [localReviews, setLocalReviews] = useState(reviews);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!storeId) return;
            setLoading(true);
            try {
                const data = await reviewService.getStoreReviews(storeId);
                setLocalReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [storeId]);

    useEffect(() => {
        if (reviews) {
            setLocalReviews(reviews);
        }
    }, [reviews]);

    const showMessage = (text, type = 'success') => {
        setStatusMessage({ text, type });
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const startEdit = (rev) => {
        setUpdating(rev.id);
        setEditData({ rating: rev.rating, comment: rev.comment });
    };

    const handleUpdate = async (id) => {
        try {
            await reviewService.updateReview(id, editData);
            showMessage("Reseña actualizada con éxito", "success");
            setUpdating(null);
            
            if (onReviewDeleted) await onReviewDeleted();
        } catch (err) {
            showMessage("Error al actualizar", "error");
        }
    }

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await reviewService.deleteReview(id);
            showMessage("Reseña eliminada con éxito", "success");
            if (onReviewDeleted) {
                await onReviewDeleted(); 
            }
        } catch (err) {
            showMessage("Error al eliminar", "error");
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
        <div className="border-t border-white/10 pt-8 mb-6 relative">
            {statusMessage && (
                <div className="fixed md:absolute top-6 md:top-2 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 ${statusMessage.type === 'success'
                        ? 'bg-black/95 border-green-500/50 text-green-500'
                        : 'bg-black/95 border-red-500/50 text-red-400'
                        }`}>
                        {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {statusMessage.text}
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <span className="text-xs md:text-sm font-bold text-purple-400 uppercase tracking-[0.15em]">
                    Feedback Comunidad ({localReviews.length})
                </span>
            </div>

            <div className="space-y-6 md:space-y-4">
                {localReviews.map((rev) => {
                    const isOwner = currentUser && String(currentUser.id) === String(rev.user);
                    const isConfirming = confirmDeleteId === rev.id;
                    const isEditing = updating === rev.id;

                    return (
                        <div
                            key={rev.id}
                            className={`relative bg-white/[0.04] p-5 md:p-6 rounded-2xl border transition-all duration-300 ${isConfirming
                                ? 'border-red-500/40 bg-red-500/[0.08] ring-1 ring-red-500/20 scale-[1.01]'
                                : deletingId === rev.id
                                    ? 'opacity-40 grayscale pointer-events-none'
                                    : 'border-white/10 hover:border-white/20'
                                }`}
                        >
                            {isConfirming && (
                                <div className="absolute inset-0 z-20 bg-black/95 rounded-2xl flex items-center justify-between px-6 animate-in fade-in zoom-in-95 duration-200">
                                    <span className="text-xs md:text-sm font-bold text-red-500 uppercase tracking-widest">
                                        ¿Borrar reseña definitivamente?
                                    </span>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rev.id)}
                                            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full text-xs font-bold uppercase transition-all shadow-lg active:scale-95"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-white/10"}`}
                                        />
                                    ))}
                                </div>

                                {isOwner && (
                                    <div className='flex gap-2'>
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => handleUpdate(rev.id)} className="text-green-500 hover:text-green-400 p-2 bg-green-500/10 rounded-lg transition-colors"><Save size={18} /></button>
                                                <button onClick={() => setUpdating(null)} className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-lg transition-colors"><X size={18} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(rev)}
                                                    disabled={updating !== null}
                                                    className="text-gray-400 hover:text-purple-400 transition-colors p-2 hover:bg-white/5 rounded-lg disabled:opacity-0"
                                                >
                                                    <PencilLine size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(rev.id)}
                                                    disabled={deletingId !== null}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white/5 rounded-lg disabled:opacity-0"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <textarea
                                    value={editData.comment}
                                    onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                    className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-sm md:text-base text-white focus:outline-none focus:border-purple-500/50 mb-4 resize-none min-h-[100px]"
                                    autoFocus
                                />
                            ) : (
                                <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-6 pr-2 font-medium">
                                    "{rev.comment}"
                                </p>
                            )}

                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] md:text-xs font-bold text-gray-300 uppercase tracking-tight">
                                        {rev.user_name || 'Usuario'}
                                    </span>
                                    {isOwner && (
                                        <span className="text-purple-400 bg-purple-500/10 px-3 py-1 rounded-md text-[10px] border border-purple-500/20 font-bold">
                                            TU RESEÑA
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] md:text-xs text-gray-500 font-medium">
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