import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cpu, Store, Calculator, Download, Box, LayoutGrid, Minus, Plus, Trash2, XCircle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const WishlistPage = () => {
    const { wishlists, loading, updateItemQuantity, toggleComponentInList, clearWishlist } = useWishlist();

    const exportToPDF = (list) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`PRESUPUESTO: ${list.name.toUpperCase()}`, 14, 22);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString()}`, 14, 30);
        // doc.text(`ID PROYECTO: ${list.id}`, 14, 35);

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
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-[#0a0a0a]">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/10 border-t-purple-500 animate-spin"></div>
                    <Cpu className="absolute inset-0 m-auto text-purple-500/50" size={20} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-8 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-gray-900 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Box className="text-purple-500" size={14} />
                        <span className="text-purple-500 font-black text-[9px] uppercase tracking-[0.3em]">System.Inventory.v2</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Mis <span className="text-gray-600">Proyectos</span>
                    </h1>
                </div>
                {wishlists.length > 0 && (
                    <button 
                        onClick={() => clearWishlist()}
                        className="flex items-center gap-2 px-4 py-2 border border-red-500/20 bg-red-500/5 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                    >
                        <XCircle size={14} /> Vaciar Todo
                    </button>
                )}
            </header>

            {wishlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#111]/50 rounded-lg border border-gray-800 border-dashed">
                    <LayoutGrid size={32} className="text-gray-800 mb-4" />
                    <p className="text-gray-600 font-black uppercase tracking-widest text-[9px]">Stack de proyectos vacío</p>
                </div>
            ) : (
                wishlists.map((list) => {
                    const itemsToShow = list.items || [];
                    const grouped = groupItemsByStore(itemsToShow);

                    return (
                        <section key={list.id} className="mb-12 animate-in fade-in duration-500">
                            <div className="bg-[#111] rounded-lg border border-gray-800 p-6 shadow-xl">
                                <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8 border-b border-gray-800/50 pb-6">
                                    <div className="space-y-3">
                                        <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{list.name}</h2>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => exportToPDF(list)}
                                                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                                            >
                                                <Download size={12} /> Export PDF
                                            </button>
                                            <div className="px-3 py-2 bg-black border border-gray-800 rounded-lg">
                                                <span className="text-[9px] font-black text-gray-500 uppercase">
                                                    {itemsToShow.length} Items Registrados
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-black p-4 rounded-lg border border-gray-800 min-w-[240px]">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                            <Calculator size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] uppercase font-black text-gray-600 tracking-widest">Presupuesto Total</p>
                                            <p className="text-xl font-bold text-white">${list.total_budget?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                {itemsToShow.length === 0 ? (
                                    <div className="text-center py-10 bg-black/40 rounded-lg border border-gray-800/50">
                                        <p className="text-gray-700 font-black uppercase tracking-widest text-[8px]">No components mapped</p>
                                    </div>
                                ) : (
                                    Object.entries(grouped).map(([storeName, items]) => (
                                        <div key={storeName} className="mb-6 last:mb-0">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Store size={12} className="text-purple-500" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{storeName}</span>
                                                <div className="h-px flex-grow bg-gray-800/30"></div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-3 bg-black/40 border border-gray-800/40 rounded-lg hover:border-gray-700 transition-all">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-900 border border-gray-800 shrink-0">
                                                            <img 
                                                                src={item.component.image || 'https://via.placeholder.com/100'} 
                                                                className="w-full h-full object-cover opacity-80" 
                                                                alt={item.component.name} 
                                                            />
                                                        </div>

                                                        <div className="flex-grow text-center md:text-left">
                                                            <h4 className="text-[11px] font-bold text-gray-200 uppercase tracking-tight">{item.component.name}</h4>
                                                            <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">{item.component.category_name || 'General'}</p>
                                                            <p className="text-[9px] text-purple-500/80 font-bold mt-1">Unit: ${item.component.price}</p>
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="flex flex-col items-end">
                                                                <p className="text-[8px] font-black text-gray-700 uppercase mb-1">Cantidad</p>
                                                                <div className="flex items-center gap-1 bg-black border border-gray-800 rounded-md p-0.5">
                                                                    <button 
                                                                        onClick={() => updateItemQuantity(list.id, item.component.id, Math.max(1, item.quantity - 1))} 
                                                                        className="p-1 hover:text-white text-gray-600 transition-colors"
                                                                    >
                                                                        <Minus size={12} />
                                                                    </button>
                                                                    <span className="text-[10px] font-bold text-white px-2 min-w-[24px] text-center">{item.quantity}</span>
                                                                    <button 
                                                                        onClick={() => updateItemQuantity(list.id, item.component.id, item.quantity + 1)} 
                                                                        className="p-1 hover:text-white text-gray-600 transition-colors"
                                                                    >
                                                                        <Plus size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="text-right min-w-[90px]">
                                                                <p className="text-[8px] font-black text-gray-700 uppercase">Subtotal</p>
                                                                <p className="text-[12px] font-black text-purple-400 tracking-tight">
                                                                    ${(item.quantity * item.component.price).toFixed(2)}
                                                                </p>
                                                            </div>

                                                            <button 
                                                                onClick={() => toggleComponentInList(list.id, item.component.id)}
                                                                className="p-2 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
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