import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export const ResetPasswordConfirm = () => {
    // IMPORTANTE: Estos nombres deben coincidir con tu Route: path="/reset-password/:uid/:token"
    const { uid, token } = useParams(); 
    const navigate = useNavigate();
    
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.new !== passwords.confirm) {
            return setStatus({ type: 'error', msg: 'LAS CONTRASEÑAS NO COINCIDEN' });
        }

        setLoading(true);
        setStatus({ type: '', msg: '' });

        // Enviamos 'uid' (que es el uidb64 que viene de la URL)
        const result = await authService.confirmPasswordReset(uid, token, passwords.new);

        if (result.success) {
            setStatus({ type: 'success', msg: 'SISTEMA ACTUALIZADO. REDIRIGIENDO...' });
            setTimeout(() => navigate('/login'), 2500);
        } else {
            setStatus({ type: 'error', msg: result.message || 'Error al restablecer' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
            <div className="max-w-md w-full bg-[#121212] rounded-[2.5rem] p-8 md:p-12 border border-gray-800 shadow-2xl relative">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Nueva Credencial</h2>
                    <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Reconfiguración de seguridad</p>
                </div>

                {status.msg && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-pulse ${
                        status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
                    }`}>
                        {status.type === 'error' ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
                        <p className="text-sm font-bold">{status.msg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="password"
                            required
                            placeholder="Nuevo código de acceso"
                            className="w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="password"
                            required
                            placeholder="Repetir código de acceso"
                            className="w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || status.type === 'success'}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Cambio'}
                    </button>
                </form>
            </div>
        </div>
    );
};