import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        const result = await authService.requestPasswordReset(email);

        if (result.success) {
            setStatus({ 
                type: 'success', 
                msg: 'Si el correo está registrado, recibirás un enlace en breve.' 
            });
        } else {
            setStatus({ type: 'error', msg: result.message });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
            <div className="max-w-md w-full bg-[#121212] rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-800/50 backdrop-blur-xl relative z-10">
                <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8">
                    <ArrowLeft size={14} /> Volver al login
                </Link>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">RECUPERAR <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ACCESO</span></h2>
                    <p className="text-gray-500 mt-2 font-medium uppercase text-xs tracking-[0.2em]">Restablecimiento de credenciales</p>
                </div>

                {status.msg && (
                    <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${
                        status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
                    }`}>
                        {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                        <p className="text-sm font-semibold">{status.msg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            type="email"
                            required
                            className="w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl outline-none text-gray-200 focus:border-blue-500 transition-all"
                            placeholder="Email registrado"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || status.type === 'success'}
                        className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all hover:bg-blue-600 hover:text-white disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Enviando...' : status.type === 'success' ? 'Enviado' : <>Enviar Enlace <Send size={16}/></>}
                    </button>
                </form>
            </div>
        </div>
    );
};