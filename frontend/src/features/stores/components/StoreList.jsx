import React, { useState, useEffect } from 'react';
import {
    MapPin, Edit, Trash2, Loader2, AlertTriangle,
    ExternalLink, Store as StoreIcon, Info, Calendar, Puzzle, Cpu
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { Link } from 'react-router-dom';
import { StoreSearch } from './StoreSearch';
import { Loading } from '../../../components/Loading';

export function StoreList() {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStores = async () => {
            setLoading(true);
            try {
                const data = await storeService.getStores()
                setStores(data)
                setError(null)
            } catch (err) {
                setError("Error al sincronizar con la base de datos de tiendas.");
            } finally {
                setLoading(false)
            }
        };

        loadStores();
    }, []);

    const filteredStored = stores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <Loading />

    return (
        <div className="flex flex-col">
            <header className="mb-16">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <Cpu className="text-purple-500" size={18} />
                            </div>
                            <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">Hardware Central</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
                            CATÁLOGO DE <br />
                            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">TIENDAS</span>
                        </h1>
                        <p className="text-gray-500 mt-4 font-medium text-lg">Tecnología de precisión para ingeniería unefista.</p>
                    </div>
                    <div className="w-full lg:max-w-md">
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-gray-800 text-gray-400 px-6 py-4 rounded-2xl hover:text-white hover:border-purple-500/50 transition-all text-[10px] font-black uppercase tracking-widest group mb-3"
                        >
                            <Puzzle size={18} className="group-hover:scale-110 transition-transform" />
                            Buscar por componente
                        </Link>
                        <StoreSearch 
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStored.map((store) => (
                    <div key={store.id} className="group bg-[#0a0a0a] border border-gray-800 rounded-[0.5rem] overflow-hidden flex flex-col hover:border-purple-500/40 transition-all duration-500">

                        {/* Imagen de Fachada o Placeholder */}
                        <div className="relative h-48 bg-gray-900 overflow-hidden">
                            {store.image ? (
                                <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                    <StoreIcon size={48} className="text-gray-800 group-hover:text-purple-500/20 transition-colors" />
                                </div>
                            )}
                        </div>

                        {/* Contenido */}
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase italic line-clamp-1">
                                    {store.name}
                                </h3>
                                <div className="flex gap-2">
                                    <button className="text-gray-600 hover:text-white transition-colors"><Edit size={16} /></button>
                                    <button className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 italic">
                                {store.description || "Sin descripción detallada."}
                            </p>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-start gap-3 text-gray-400">
                                    <MapPin size={16} className="text-purple-500 shrink-0 mt-0.5" />
                                    <span className="text-[11px] font-bold uppercase leading-tight tracking-tight">{store.address}</span>
                                </div>

                                <div className="flex items-center gap-3 text-gray-500">
                                    <Calendar size={14} className="shrink-0" />
                                    <span className="text-[9px] font-black uppercase">Registro: {new Date(store.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {store.latitude && store.longitude && (
                                <a
                                    href={`https://www.google.com/maps?q=${store.latitude},${store.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-8 flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all active:scale-95"
                                >
                                    <ExternalLink size={14} />
                                    Abrir Localización
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}