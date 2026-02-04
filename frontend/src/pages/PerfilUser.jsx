import React, { useState, useEffect } from 'react';
import {
    User, Mail, Lock, Eye,
    EyeOff, AlertCircle, CheckCircle2, UserX,
    BellRing, Package, Check, TriangleAlert
} from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';
// import { productService } from '../features/products/services/productService';

const AlertasSkeleton = () => (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-800 rounded-full" />
                <div className="h-4 w-32 bg-gray-800 rounded" />
            </div>
            <div className="h-5 w-24 bg-gray-800 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black border border-gray-800 p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-800 rounded" />
                    <div className="h-2 w-1/2 bg-gray-800 rounded" />
                </div>
            </div>
            <div className="bg-black border border-gray-800 p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-800 rounded" />
                    <div className="h-2 w-1/2 bg-gray-800 rounded" />
                </div>
            </div>
        </div>
    </div>
);

export function PerfilUser() {
    const { user, changePassword, deleteAccount, checkStockAlerts } = useAuth();
    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingAlerts, setLoadingAlerts] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [alerts, setAlerts] = useState({ low_stock: [], out_of_stock: [], total_alerts: 0 });
    const [pwdData, setPwdData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmUsername, setConfirmUsername] = useState('');

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, []);


    useEffect(() => {
        const fetchUserAlerts = async () => {
            // Validamos que exista el usuario y tenga el rol permitido
            if (user && (user.role === 'cliente' || user.role === 'seller')) {
                setLoadingAlerts(true);
                try {
                    const result = await checkStockAlerts();

                    // ✅ Verificamos si el resultado contiene las propiedades que vimos en el XHR
                    if (result && (result.low_stock || result.out_of_stock)) {
                        setAlerts({
                            low_stock: result.low_stock || [],
                            out_of_stock: result.out_of_stock || [],
                            total_alerts: result.total_alerts || 0
                        });
                    }
                } catch (error) {
                    console.error("Error al obtener alertas:", error);
                } finally {
                    setLoadingAlerts(false);
                }
            } else {
                setLoadingAlerts(false);
            }
        };
        fetchUserAlerts();
    }, [user, checkStockAlerts]);
    
    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-purple-500 font-bold uppercase tracking-widest animate-pulse">
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
        const result = await changePassword(pwdData.old_password, pwdData.new_password);
        if (result.success) {
            setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
            setPwdData({ old_password: '', new_password: '', confirm_password: '' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Error al validar contraseña.' });
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
    };

    return (
        <div className="min-h-screen text-gray-200 p-6 md:p-10 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-purple-600 rounded-lg flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                            {user.username?.[0].toUpperCase()}
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{user.username}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="flex items-center gap-2 text-xs font-semibold bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-md text-gray-400">
                                    <Mail size={14} className="text-purple-500" /> {user.email}
                                </span>
                                <span className="flex items-center gap-2 text-xs font-semibold bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-md text-purple-400">
                                    <User size={14} /> {user.role?.toUpperCase() || 'CLIENTE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {loadingAlerts ? (
                    <AlertasSkeleton />
                ) : (
                    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-xl animate-in zoom-in-95 duration-300">
                        {alerts.total_alerts > 0 ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <BellRing className="text-purple-500 animate-pulse" size={20} />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Avisos de disponibilidad</h3>
                                    </div>
                                    <span className="text-[10px] bg-purple-600 text-white px-2 py-1 rounded-full font-bold">
                                        {alerts.total_alerts} ACTUALIZACIONES
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {alerts.out_of_stock.map((item) => (
                                        <div key={item.id} className="bg-black border border-red-900/20 p-4 rounded-lg flex items-center gap-4">
                                            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                                <TriangleAlert size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                                <p className="text-[10px] text-red-500 font-bold uppercase">Agotado temporalmente</p>
                                            </div>
                                        </div>
                                    ))}
                                    {alerts.low_stock.map((item) => (
                                        <div key={item.id} className="bg-black border border-orange-900/20 p-4 rounded-lg flex items-center gap-4">
                                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                                <BellRing size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                                <p className="text-[10px] text-orange-500 font-bold">¡Quedan pocas unidades!</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                <div className="bg-green-500/10 p-3 rounded-full mb-3">
                                    <Check className="text-green-500" size={15} />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sin alertas pendientes</h3>
                                <p className="text-[11px] text-gray-500 mt-1">Tus productos favoritos están disponibles o con stock estable.</p>
                            </div>
                        )}
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 border-b border-gray-800 pb-2">Mi Cuenta</h3>
                            <div className="space-y-4 text-sm text-gray-400">
                                <p className="hover:text-purple-400 cursor-pointer transition-colors">Historial de pedidos</p>
                                <p className="hover:text-purple-400 cursor-pointer transition-colors">Direcciones de envío</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full bg-red-950/10 border border-red-900/30 p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase text-red-500 hover:bg-red-600 hover:text-white transition-all"
                        >
                            <UserX size={16} /> Eliminar Cuenta
                        </button>
                    </div>

                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmitPassword} className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <Lock size={20} className="text-purple-500" /> Seguridad
                                </h3>
                                <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="text-gray-500 hover:text-purple-400 transition-colors">
                                    {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 text-xs font-bold ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
                                    }`}>
                                    {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Contraseña Actual</label>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        name="old_password"
                                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                                        value={pwdData.old_password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nueva Contraseña</label>
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            name="new_password"
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                                            value={pwdData.new_password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Confirmar</label>
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            name="confirm_password"
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                                            value={pwdData.confirm_password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white font-bold uppercase py-4 rounded-lg hover:bg-purple-700 transition-all shadow-[0_4px_15px_rgba(147,51,234,0.4)] disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {loading ? 'Procesando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f0f0f] border border-red-900/50 p-8 rounded-xl max-w-md w-full space-y-6">
                        <div className="text-center space-y-2">
                            <h4 className="text-white font-bold text-xl uppercase">¿Eliminar cuenta?</h4>
                            <p className="text-gray-500 text-sm">Escribe <span className="text-white font-mono">{user.username}</span> para confirmar.</p>
                        </div>
                        <input
                            type="text"
                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white text-center focus:border-red-600 outline-none"
                            value={confirmUsername}
                            onChange={(e) => setConfirmUsername(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors">Cancelar</button>
                            <button onClick={handleDeleteAccount} disabled={confirmUsername !== user.username || loading} className="flex-1 bg-red-600 text-white py-3 rounded-lg disabled:opacity-20 hover:bg-red-700 transition-colors">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}