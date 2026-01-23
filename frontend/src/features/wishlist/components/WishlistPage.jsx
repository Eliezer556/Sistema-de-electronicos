import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cpu, Store, Calculator, Download, Box, LayoutGrid, Minus, Plus, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const WishlistPage = () => {
    const { wishlists, loading, updateItemQuantity, toggleComponentInList } = useWishlist();

    const exportToPDF = (list) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`PRESUPUESTO: ${list.name.toUpperCase()}`, 14, 22);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`ID PROYECTO: ${list.id}`, 14, 35);

        const tableColumn = ["COMPONENTE", "TIENDA", "CANT.", "P. UNIT", "SUBTOTAL"];
        const tableRows = list.items.map(item => [
            item.component.name,
            item.component.store_name || 'UNEFA Store',
            item.quantity,
            `$${item.component.price}`,
            `$${(item.quantity * item.component.price).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 45,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [147, 51, 234], fontStyle: 'bold' },
            styles: { fontSize: 9 }
        });

        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`TOTAL NETO: $${list.total_budget.toFixed(2)}`, 140, finalY);
        doc.save(`Prototipo_${list.name}.pdf`);
    }

    const groupItemsByStore = (items) => {
        return items.reduce((acc, item) => {
            const storeName = item.component.store_name || 'Almacén Central';
            if (!acc[storeName]) acc[storeName] = [];
            acc[storeName].push(item);
            return acc;
        }, {});
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh]">
                <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                    <Cpu className="absolute inset-0 m-auto text-purple-500 animate-pulse" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Box className="text-purple-500" size={20} />
                        <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">Laboratorio v2.0</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        PROYECTOS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ENGINEERING LISTS</span>
                    </h1>
                </div>
            </header>

            {wishlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#0a0a0a] rounded-[3rem] border border-gray-900 border-dashed">
                    <LayoutGrid size={48} className="text-gray-800 mb-6" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No se han inicializado proyectos</p>
                </div>
            ) : (
                wishlists.map((list) => {
                    const itemsToShow = list.items || [];
                    const grouped = groupItemsByStore(itemsToShow);

                    return (
                        <section key={list.id} className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-[#111] rounded-[2.5rem] border border-gray-800/50 p-8 md:p-10 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] -z-10"></div>
                                
                                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-12 border-b border-gray-800 pb-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-white tracking-tight">{list.name}</h2>
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={() => exportToPDF(list)}
                                                className="group flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Download size={14} /> 
                                                Exportar Blueprint
                                            </button>
                                            <div className="px-4 py-3 bg-[#1a1a1a] rounded-xl border border-gray-800">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                    {itemsToShow.length} Componentes Únicos
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 rounded-3xl border border-gray-800 min-w-[280px]">
                                        <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                                            <Calculator size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] mb-1">Costo Estimado</p>
                                            <p className="text-3xl font-black text-white">${list.total_budget?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                {itemsToShow.length === 0 ? (
                                    <div className="text-center py-20 bg-black/20 rounded-[2rem] border border-gray-800/30">
                                        <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Lista de materiales vacía</p>
                                    </div>
                                ) : (
                                    Object.entries(grouped).map(([storeName, items]) => (
                                        <div key={storeName} className="mb-8 last:mb-0">
                                            <div className="flex items-center gap-4 mb-6">
                                                <Store size={14} className="text-purple-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{storeName}</span>
                                                <div className="h-[1px] flex-grow bg-gray-800/50"></div>
                                            </div>

                                            <div className="space-y-3">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#0a0a0a] border border-gray-800/50 rounded-2xl hover:border-purple-500/30 transition-all">
                                                        {/* Imagen Mini */}
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-900 shrink-0">
                                                            <img 
                                                                src={item.component.image || 'https://via.placeholder.com/100'} 
                                                                className="w-full h-full object-cover" 
                                                                alt={item.component.name} 
                                                            />
                                                        </div>

                                                        {/* Info Principal */}
                                                        <div className="flex-grow text-center md:text-left">
                                                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">{item.component.name}</h4>
                                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{item.component.category_name || 'General'}</p>
                                                        </div>

                                                        {/* Precio Unitario */}
                                                        <div className="shrink-0 text-center">
                                                            <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Precio Unit.</p>
                                                            <p className="text-sm font-black text-white">${item.component.price}</p>
                                                        </div>

                                                        {/* Control de Cantidad Minimalista */}
                                                        {/* <div className="flex items-center bg-black border border-gray-800 rounded-xl p-1 shrink-0">
                                                            <button 
                                                                onClick={() => updateItemQuantity(list.id, item.component.id, item.quantity - 1)}
                                                                className="p-2 hover:text-purple-500 text-gray-500 transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-10 text-center text-xs font-black text-white">{item.quantity}</span>
                                                            <button 
                                                                onClick={() => updateItemQuantity(list.id, item.component.id, item.quantity + 1)}
                                                                className="p-2 hover:text-purple-500 text-gray-500 transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div> */}

                                                        {/* Subtotal de Fila */}
                                                        <div className="shrink-0 text-center min-w-[80px]">
                                                            <p className="text-[9px] font-black text-purple-500/50 uppercase mb-1">Subtotal</p>
                                                            <p className="text-sm font-black text-purple-400">${(item.quantity * item.component.price).toFixed(2)}</p>
                                                        </div>

                                                        {/* Eliminar */}
                                                        <button 
                                                            onClick={() => toggleComponentInList(list.id, item.component.id)}
                                                            className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    );
                })
            )}
        </div>
    );
};

export default WishlistPage;