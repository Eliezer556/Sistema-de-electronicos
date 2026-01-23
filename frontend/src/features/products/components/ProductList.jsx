import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { ProductDetail } from './ProductDetail';
import { RefreshCcw, Cpu, SearchX, Store } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { Link } from 'react-router-dom';
import { Loading } from '../../../components/Loading';

export const ProductList = () => {
    const {
        products,
        loading,
        error,
        fetchData,
        searchTerm,
        setSearchTerm
    } = useProducts();

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="max-w-lg mx-auto mt-20 p-10 bg-[#121212] border border-red-500/20 rounded-[2.5rem] text-center backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <div className="inline-flex p-4 bg-red-500/10 rounded-2xl mb-6 text-red-500">
                    <RefreshCcw size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Error de Sistema</h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">{error}</p>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-red-500 hover:text-white transition-all mx-auto active:scale-95"
                >
                    <RefreshCcw size={16} /> Reiniciar Enlace
                </button>
            </div>
        );
    }

    // Lógica de renderizado condicional para el detalle
    if (selectedProduct) {
        return (
            <ProductDetail 
                product={selectedProduct} 
                onBack={() => setSelectedProduct(null)} 
            />
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
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
                            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">COMPONENTES</span>
                        </h1>
                        <p className="text-gray-500 mt-4 font-medium text-lg">Tecnología de precisión para ingeniería unefista.</p>
                    </div>
                    <div className="w-full lg:max-w-md">
                        <Link
                            to="/stores"
                            className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-gray-800 text-gray-400 px-6 py-4 rounded-2xl hover:text-white hover:border-purple-500/50 transition-all text-[10px] font-black uppercase tracking-widest group mb-3"
                        >
                            <Store size={18} className="group-hover:scale-110 transition-transform" />
                            Buscar por tienda
                        </Link>
                        <SearchBar />
                    </div>
                </div>

                <div className="bg-[#1a1a1a]/50 p-8 rounded-[2rem] border border-gray-800/50 backdrop-blur-sm shadow-inner">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[1px] w-8 bg-purple-500/50"></div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                            Filtrar por arquitectura
                        </p>
                    </div>
                    <CategoryFilter />
                </div>
            </header>

            {products.length === 0 ? (
                <div className="text-center py-28 bg-[#121212]/30 rounded-[3.5rem] border border-dashed border-gray-800/50">
                    <div className="inline-flex p-6 bg-[#1a1a1a] rounded-[2rem] mb-6 text-gray-800 border border-gray-800">
                        <SearchX size={48} />
                    </div>
                    <p className="text-white font-bold text-2xl mb-3 tracking-tight">
                        {searchTerm
                            ? `Búsqueda sin resultados: "${searchTerm}"`
                            : "No se encontraron componentes"}
                    </p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="text-purple-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-all py-3 px-8 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 active:scale-95"
                    >
                        Limpiar Terminal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onViewDetail={(p) => setSelectedProduct(p)} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
};