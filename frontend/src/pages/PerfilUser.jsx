import React, { useState } from 'react';
import { 
    User, Mail, Shield, Lock, Save, Eye, 
    EyeOff, AlertCircle, CheckCircle2, UserX 
} from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';

export function PerfilUser() {
    // Extraemos deleteAccount del context
    const { user, changePassword, deleteAccount } = useAuth();
    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [pwdData, setPwdData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    
    // Estados para la eliminación de cuenta
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmUsername, setConfirmUsername] = useState('');

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-bold uppercase tracking-widest animate-pulse">
                    Cargando Perfil...
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setPwdData({ ...pwdData, [e.target.name]: e.target.value });
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        if (pwdData.new_password !== pwdData.confirm_password) {
            return setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
        }

        setLoading(true);
        // El REQUERIMIENTO 2 se cumple aquí: se envía old_password para validación en backend
        const result = await changePassword(pwdData.old_password, pwdData.new_password);
        
        if (result.success) {
            setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
            setPwdData({ old_password: '', new_password: '', confirm_password: '' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Error al validar contraseña actual.' });
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        const result = await deleteAccount();
        if (!result.success) {
            setMessage({ type: 'error', text: result.message });
            setLoading(false);
            setShowDeleteConfirm(false);
        }
        // Si tiene éxito, el context hace logout y redirige automáticamente
    };

    return (
        <div className="min-h-screen text-gray-200 p-6 md:p-10 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header: Perfil Principal */}
                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-purple-600 rounded-lg flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/10">
                            {user.username?.[0].toUpperCase()}
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                {user.username}
                            </h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="flex items-center gap-2 text-xs font-semibold bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-md text-gray-400">
                                    <Mail size={14} className="text-purple-500" /> {user.email}
                                </span>
                                <span className="flex items-center gap-2 text-xs font-semibold bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-md text-purple-400">
                                    <Shield size={14} /> {user.role?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Columna Izquierda: Info & Acciones */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Información de Cuenta</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-purple-500 uppercase">Estado</p>
                                    <p className="text-white text-sm">Verificado / Activo</p>
                                </div>
                                {/* <div>
                                    <p className="text-[10px] font-bold text-purple-500 uppercase">ID de Usuario</p>
                                    <p className="text-gray-400 font-mono text-xs">#{user.id || '0000'}</p>
                                </div> */}
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full bg-red-950/20 border border-red-900/30 p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase text-red-500 hover:bg-red-600 hover:text-white transition-all"
                        >
                            <UserX size={16} /> Eliminar mi cuenta
                        </button>
                    </div>

                    {/* Columna Derecha: Formulario de Contraseña */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmitPassword} className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8 shadow-xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <Lock size={20} className="text-purple-500" /> Seguridad
                                </h3>
                                <button 
                                    type="button" 
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 text-xs font-bold ${
                                    message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
                                }`}>
                                    {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Contraseña Actual</label>
                                    <input 
                                        type={showPasswords ? "text" : "password"}
                                        name="old_password"
                                        required
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                                        value={pwdData.old_password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Nueva Contraseña</label>
                                        <input 
                                            type={showPasswords ? "text" : "password"}
                                            name="new_password"
                                            required
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                                            value={pwdData.new_password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Confirmar Nueva</label>
                                        <input 
                                            type={showPasswords ? "text" : "password"}
                                            name="confirm_password"
                                            required
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
                                            value={pwdData.confirm_password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold uppercase py-4 rounded-lg hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4"
                                >
                                    <Save size={18} /> 
                                    {loading ? 'Procesando...' : 'Actualizar Credenciales'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* REQUERIMIENTO 3: Confirmación explícita antes de eliminación permanente */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f0f0f] border border-red-900/50 p-8 rounded-xl max-w-md w-full space-y-6 shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                            <AlertCircle size={32} />
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-white font-bold text-xl uppercase">Acción Irreversible</h4>
                            <p className="text-gray-500 text-sm">
                                Se eliminarán todos tus datos permanentemente. Para confirmar, escribe tu nombre de usuario: <span className="text-white font-mono">{user.username}</span>
                            </p>
                        </div>

                        <input 
                            type="text"
                            placeholder="Escribe tu username"
                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white text-center outline-none focus:border-red-600 transition-all"
                            value={confirmUsername}
                            onChange={(e) => setConfirmUsername(e.target.value)}
                        />

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={() => { setShowDeleteConfirm(false); setConfirmUsername(''); }}
                                className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-all"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                disabled={confirmUsername !== user.username || loading}
                                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Borrando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}