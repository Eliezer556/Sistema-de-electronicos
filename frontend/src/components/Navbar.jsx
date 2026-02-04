import { Link } from 'react-router-dom';
import { ShoppingCart, Package, LogOut, LayoutDashboard, LogIn, Cpu, User, Bell } from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';

export const Navbar = () => {
    // Extraemos hasStockAlert directamente del context global
    const { user, logout, isAuthenticated, hasStockAlert } = useAuth();
    const role = user?.role;

    return (
        <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800/50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo Estilo Futurista */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                        <Cpu className="text-purple-500" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        UNEFA <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ELECTRO</span>
                    </span>
                </Link>

                <div className="flex items-center space-x-8">
                    {isAuthenticated ? (
                        <>
                            {/* Saludo de Usuario */}
                            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-2xl">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-400">
                                    SISTEMA: <span className="text-gray-100 font-bold uppercase tracking-tight">
                                        {user?.first_name || user?.username || 'Operador'}
                                    </span>
                                </span>
                            </div>

                            {/* Enlaces de Acción por Rol */}
                            <div className="flex items-center gap-4">
                                {role === 'cliente' && (
                                    <Link title="Carrito de Compras" to="/wishlist"
                                        className="p-2.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all border border-transparent hover:border-purple-500/20">
                                        <ShoppingCart size={22} />
                                    </Link>
                                )}

                                {role === 'cliente' && (
                                    <Link
                                        title={hasStockAlert ? "Alertas de Stock Pendientes" : "Perfil de usuario"}
                                        to="/perfil-user"
                                        className={`relative p-2.5 rounded-xl transition-all border group ${hasStockAlert
                                            ? "text-amber-400 bg-amber-400/5 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                                            : "text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 border-transparent hover:border-purple-500/20"
                                            }`}
                                    >
                                        <div className="relative">
                                            <User size={22} className={hasStockAlert ? "animate-pulse" : ""} />

                                            {/* Indicador de Alerta (Badge) */}
                                            {hasStockAlert && (
                                                <>
                                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#0a0a0a]"></span>
                                                    </span>
                                                    {/* Icono de campana pequeño para reforzar el mensaje */}
                                                    <Bell size={10} className="absolute -bottom-1 -right-1 text-amber-500 fill-amber-500" />
                                                </>
                                            )}
                                        </div>
                                    </Link>
                                )}

                                {role === 'proveedor' && (
                                    <Link title="Panel de Tienda" to="/inventory"
                                        className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20">
                                        <Package size={22} />
                                    </Link>
                                )}

                                {role === 'admin' && (
                                    <Link title="Terminal de Control" to="/admin/dashboard"
                                        className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                                        <LayoutDashboard size={22} />
                                    </Link>
                                )}
                            </div>

                            <div className="h-8 w-px bg-gray-800"></div>

                            {/* Botón Salir */}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                            >
                                <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.2em]">Desconectar</span>
                                <div className="p-2 group-hover:bg-red-500/10 rounded-lg transition-colors">
                                    <LogOut size={20} className="group-hover:text-red-500" />
                                </div>
                            </button>
                        </>
                    ) : (
                        /* Botón de Ingreso Estilo Formulario */
                        <Link
                            to="/login"
                            className="relative group overflow-hidden px-8 py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all active:scale-95"
                        >
                            <div className="absolute inset-0 bg-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></div>
                            <span className="relative z-10 text-black group-hover:text-white flex items-center gap-2">
                                <LogIn size={16} /> ACCEDER
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};