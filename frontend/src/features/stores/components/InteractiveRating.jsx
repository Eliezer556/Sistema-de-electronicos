import React, { useState } from 'react';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { reviewService } from '../services/reviewService';

export function InteractiveRating({ storeId, onVoteSuccess }) {
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSubmit = async () => {
        if (rating === 0) {
            setStatus({ type: 'error', msg: 'Debes seleccionar una puntuación' });
            return;
        }
        setSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            await reviewService.createReview({
                store: storeId,
                rating,
                comment: comment || "Sin comentarios"
            });

            // 1. Notificamos al padre INMEDIATAMENTE para que dispare el fetch
            // Esto hace que la lista de abajo se actualice "automáticamente"
            if (onVoteSuccess) onVoteSuccess();

            // 2. Mostramos el éxito visualmente
            setStatus({ type: 'success', msg: 'Reseña publicada con éxito' });

            // 3. Limpiamos el formulario después de un breve delay
            setTimeout(() => {
                setShowForm(false);
                setRating(0);
                setComment("");
                setStatus({ type: '', msg: '' });
            }, 1000);

        } catch (err) {
            setStatus({ type: 'error', msg: 'Ya has calificado esta tienda anteriormente' });
        } finally {
            setSubmitting(false);
        }
    };

    if (!showForm) return (
        <button onClick={() => setShowForm(true)} className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-all mb-2">
            + Escribir Reseña
        </button>
    );

    return (
        <div className="flex flex-col gap-3 p-4 bg-black/40 rounded-xl border border-white/5 mb-4">
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Tu Calificación</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} disabled={submitting}>
                            <Star size={14} className={(hover || rating) >= s ? 'text-yellow-400' : 'text-gray-800'} fill={(hover || rating) >= s ? "currentColor" : "none"} />
                        </button>
                    ))}
                </div>
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tu opinión..." disabled={submitting} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-[10px] text-gray-300 focus:outline-none focus:border-purple-500/50 resize-none h-16" />
            {status.msg && (
                <div className={`flex items-center gap-2 text-[9px] font-bold uppercase p-2 rounded-md ${status.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {status.type === 'error' ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                    {status.msg}
                </div>
            )}
            <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={submitting} className="flex-grow bg-purple-600 text-white text-[9px] font-black uppercase py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors">
                    {submitting ? 'Enviando...' : 'Publicar'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-2 text-gray-500 hover:text-white text-[9px] font-black uppercase">Cancelar</button>
            </div>
        </div>
    );
}