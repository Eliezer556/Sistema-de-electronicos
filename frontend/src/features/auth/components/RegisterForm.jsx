import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store as StoreIcon, User, Mail, Lock, BadgeCheck, AlertCircle, MapPin, Building2, Rocket, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterForm = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('cliente');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: '', username: '', password: '',
        first_name: '', last_name: '',
        store_name: '', store_address: ''
    });

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) newErrors.email = "Email inválido";
        if (formData.username.length < 4) newErrors.username = "Mínimo 4 caracteres";
        if (formData.password.length < 6) newErrors.password = "Mínimo 6 caracteres";
        if (!formData.first_name.trim()) newErrors.first_name = "Requerido";
        if (!formData.last_name.trim()) newErrors.last_name = "Requerido";

        if (role === 'proveedor') {
            if (!formData.store_name.trim()) newErrors.store_name = "Nombre de tienda requerido";
            if (!formData.store_address.trim()) newErrors.store_address = "Dirección requerida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        const result = await register({ ...formData, role });

        if (result.success) {
            navigate('/');
        } else {
            if (result.errors) {
                const backendErrors = {};
                Object.keys(result.errors).forEach(key => {
                    backendErrors[key] = Array.isArray(result.errors[key]) 
                        ? result.errors[key][0] 
                        : result.errors[key];
                });
                setErrors(backendErrors);
            } else {
                setErrors({ server: result.message || "Error al procesar el registro" });
            }
        }
        setLoading(false);
    };

    const inputStyle = (field) => `
        w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border rounded-xl transition-all duration-300 outline-none text-gray-200 placeholder-gray-500
        ${errors[field] ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'}
    `;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="max-w-xl w-full bg-[#121212] rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-800/50 backdrop-blur-xl relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl mb-4 text-purple-500 border border-purple-500/20">
                        <Rocket size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">ÚNETE A <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">UNEFA ELECTRO</span></h2>
                    <p className="text-gray-500 mt-2 font-medium">Potencia tu experiencia tecnológica</p>
                </div>

                <div className="flex p-1.5 bg-[#1a1a1a] rounded-2xl mb-8 border border-gray-800">
                    <button
                        type="button"
                        onClick={() => { setRole('cliente'); setErrors({}); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${role === 'cliente' ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <User size={18} /> Cliente
                    </button>
                    <button
                        type="button"
                        onClick={() => { setRole('proveedor'); setErrors({}); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${role === 'proveedor' ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <StoreIcon size={18} /> Proveedor
                    </button>
                </div>

                {errors.server && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 rounded-2xl animate-pulse">
                        <AlertCircle size={20} />
                        <p className="text-sm font-semibold">{errors.server}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <User className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                            <input type="text" placeholder="Nombre" className={inputStyle('first_name')} value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                            {errors.first_name && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 ml-2 font-bold">{errors.first_name}</span>}
                        </div>
                        <div className="relative group">
                            <User className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                            <input type="text" placeholder="Apellido" className={inputStyle('last_name')} value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                            {errors.last_name && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 ml-2 font-bold">{errors.last_name}</span>}
                        </div>
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input type="email" placeholder="Email" className={inputStyle('email')} value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        {errors.email && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 ml-2 font-bold">{errors.email}</span>}
                    </div>

                    <div className="relative group">
                        <BadgeCheck className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input type="text" placeholder="Username" className={inputStyle('username')} value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                        {errors.username && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 ml-2 font-bold">{errors.username}</span>}
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input type="password" placeholder="Contraseña" className={inputStyle('password')} value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        {errors.password && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 ml-2 font-bold">{errors.password}</span>}
                    </div>

                    {role === 'proveedor' && (
                        <div className="pt-6 mt-6 border-t border-gray-800 space-y-4">
                            <div className="relative group">
                                <StoreIcon className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input type="text" placeholder="Nombre de Tienda" className={inputStyle('store_name').replace('purple', 'blue')} value={formData.store_name}
                                    onChange={(e) => setFormData({ ...formData, store_name: e.target.value })} />
                                {errors.store_name && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 ml-2 font-bold">{errors.store_name}</span>}
                            </div>
                            <div className="relative group">
                                <MapPin className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input type="text" placeholder="Dirección de Tienda" className={inputStyle('store_address').replace('purple', 'blue')} value={formData.store_address}
                                    onChange={(e) => setFormData({ ...formData, store_address: e.target.value })} />
                                {errors.store_address && <span className="text-[10px] text-red-400 uppercase tracking-widest mt-1 ml-2 font-bold">{errors.store_address}</span>}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group overflow-hidden bg-white text-black py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all active:scale-[0.97] disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                            {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Registrar"}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};