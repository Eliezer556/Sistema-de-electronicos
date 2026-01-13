import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/NavBar';
import { ShieldCheck, Zap } from 'lucide-react';

export const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#050505] text-gray-300 selection:bg-purple-500/30 selection:text-purple-200">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-[20%] w-[50%] h-[30%] bg-indigo-900/5 blur-[100px] rounded-full"></div>
            </div>

            <Navbar />
            <main className="relative flex-grow w-full max-w-[1600px] mx-auto px-6 md:px-12 py-8">
                <Outlet />
            </main>
            <footer className="relative z-10 border-t border-gray-800/30 bg-black/20 backdrop-blur-md pt-12 pb-8">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                                    UNEFA ELECTRO <span className="text-gray-600">v2.0</span>
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-600 max-w-xs leading-relaxed font-medium uppercase tracking-wider">
                                Plataforma de intercambio tecnológico de alto rendimiento para la comunidad de ingeniería.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-x-10 gap-y-4 items-center">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Soporte</span>
                                <Link to="/legal" className="text-[11px] hover:text-white transition-colors uppercase font-bold">Documentación</Link>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Seguridad</span>
                                <Link to="/privacidad" className="text-[11px] hover:text-white transition-colors uppercase font-bold">Protocolos</Link>
                            </div>
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-800/50">
                                <ShieldCheck size={20} className="text-gray-700" />
                                <Zap size={20} className="text-gray-700" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-900 pt-6">
                        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.2em]">
                            © 2026 Núcleo Aragua. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.2em]">System Status: Optimal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};