import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Cpu, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../wishlist/context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth();
    const { fetchWishlists } = useWishlist();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            if (fetchWishlists) await fetchWishlists();

            const userRole = result.user?.role;
            if (userRole === 'admin') navigate('/admin/dashboard');
            else if (userRole === 'proveedor') navigate('/inventory');
            else navigate('/');
        } else {
            setError(result.message || 'Credenciales inválidas. Intente de nuevo.');
        }
        setLoading(false);
    };

    const inputStyle = `
        w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl transition-all duration-300 
        outline-none text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10
    `;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full bg-[#121212] rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-800/50 backdrop-blur-xl relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-4 text-blue-400 border border-blue-500/20">
                        <Cpu size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">BIENVENIDO A <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">UNEFA ELECTRO</span></h2>
                    <p className="text-gray-500 mt-2 font-medium uppercase text-xs tracking-[0.2em]">Acceso al terminal de sistema</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 rounded-2xl animate-pulse">
                        <AlertCircle size={20} />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            type="email"
                            required
                            className={inputStyle}
                            placeholder="Identificador (Email)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            type="password"
                            required
                            className={inputStyle}
                            placeholder="Código de acceso"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group overflow-hidden bg-white text-black py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all active:scale-[0.97] disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Autenticar sistema <ArrowRight size={18} />
                                </>
                            )}
                        </span>
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-800/50 text-center">
                    <p className="text-gray-600 text-xs font-medium uppercase">
                        {/* ¿No tienes una cuenta activa? <br /> */}
                        <Link to="/register" className="inline-block mt-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                            Registrar nuevo usuario
                        </Link>
                        </p>
                    <Link
                        to="/forgot-passwword"
                        className="text-[10px] font-bold text-gray-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>
        </div>
    );
};