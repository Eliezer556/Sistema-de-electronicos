import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';
import { StoreManagement } from './StoreManagment';
import {
    Package, Plus, FileSpreadsheet, FileSliders, Trash2, Settings,
    Edit, Search, Loader2, X, Image as ImageIcon, Save, Settings2, Link as LinkIcon, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';

export const InventoryDashboard = () => {
    // --- ESTADOS ---
    const [components, setComponents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'store'

    const [formData, setFormData] = useState({
        name: '', mpn: '', description: '', price: '', stock: '',
        category: '', datasheet_url: '', is_available: true, image: null,
        is_on_offer: false,
        offer_price: ''
    });

    const [techSpecs, setTechSpecs] = useState([{ key: '', value: '' }]);

    // --- CARGA DE DATOS ---
    const loadData = async () => {
        setLoading(true);
        try {
            const [compData, catData, sData] = await Promise.all([
                inventoryService.getInventory(),
                inventoryService.getCategories(),
                inventoryService.getStoreData()
            ]);

            setComponents(compData || []);
            setCategories(catData || []);

            // Si sData es un array, toma el primer elemento. Si es objeto, úsalo directo.
            const finalStoreData = Array.isArray(sData) ? sData[0] : sData;
            setStoreData(finalStoreData);

        } catch (error) {
            console.error("Error cargando datos:", error);
            setErrors({ server: "Error de conexión con el servidor." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('TIENDA ACTUAL: ', storeData)
    }, [])

    useEffect(() => {
        loadData();
    }, []);

    // --- LÓGICA DE INVENTARIO ---
    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
        if (!formData.mpn.trim()) newErrors.mpn = "El MPN es obligatorio";
        if (!formData.category) newErrors.category = "Seleccione una categoría";
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Precio inválido";
        if (formData.stock === '' || parseInt(formData.stock) < 0) newErrors.stock = "Stock inválido";

        // Cambio de is_on_sale a is_on_offer aquí
        if (formData.is_on_offer && (!formData.offer_price || parseFloat(formData.offer_price) <= 0)) {
            newErrors.offer_price = "El precio de oferta es obligatorio si la oferta está activa";
        }

        if (formData.datasheet_url && formData.datasheet_url.trim() !== "") {
            try { new URL(formData.datasheet_url); }
            catch (_) { newErrors.datasheet_url = "URL inválida (use http/https)"; }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenModal = (item = null) => {
        setErrors({});
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name, mpn: item.mpn, description: item.description || '',
                price: item.price, stock: item.stock, category: item.category,
                datasheet_url: item.datasheet_url || '', is_available: item.is_available, image: null,
                is_on_offer: item.is_on_offer || false,
                offer_price: item.offer_price || '',
            });
            const specs = item.technical_specs && typeof item.technical_specs === 'object'
                ? Object.entries(item.technical_specs).map(([key, value]) => ({ key, value }))
                : [{ key: '', value: '' }];
            setTechSpecs(specs.length > 0 ? specs : [{ key: '', value: '' }]);
        } else {
            setEditingItem(null);
            setFormData({
                name: '', mpn: '', description: '', price: '', stock: '0',
                category: '', datasheet_url: '', is_available: true, image: null,
                is_on_offer: false, offer_price: ''
            });
            setTechSpecs([{ key: '', value: '' }]);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();

        // Procesamos cada llave manualmente para asegurar el formato
        Object.keys(formData).forEach(key => {
            if (key === 'image') {
                if (formData[key] instanceof File) {
                    data.append(key, formData[key]);
                }
            } else if (typeof formData[key] === 'boolean') {
                // ENVIAR BOOLEANOS COMO STRING: Django REST los entenderá correctamente
                data.append(key, formData[key] ? 'true' : 'false');
            } else if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        const specsObj = {};
        techSpecs.forEach(spec => {
            if (spec.key.trim()) specsObj[spec.key.trim()] = spec.value;
        });
        data.append('technical_specs', JSON.stringify(specsObj));

        try {
            if (editingItem) await inventoryService.updateComponent(editingItem.id, data);
            else await inventoryService.createComponent(data);
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            setErrors({ server: "Error al guardar. Verifique los datos." });
        }
    };

    const confirmDelete = async () => {
        try {
            await inventoryService.deleteComponent(deleteId);
            setComponents(prev => prev.filter(item => item.id !== deleteId));
            setDeleteId(null);
        } catch (error) { console.error(error); }
    };

    const filteredComponents = components.filter(c =>
        (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (c.mpn?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto min-h-screen bg-black text-white">

            {/* --- HEADER --- */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
                        {activeTab === 'inventory' ? 'Suministros & Stock' : 'Configuración Tienda'}
                    </h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        Panel de Control Maestro
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab(activeTab === 'inventory' ? 'store' : 'inventory')}
                        className="flex items-center justify-center gap-2 bg-[#0a0a0a] border border-gray-800 text-gray-400 px-6 py-4 rounded-2xl hover:text-purple-500 transition-all text-[10px] font-black uppercase"
                    >
                        {activeTab === 'inventory' ? <><Settings size={18} /> Configurar Tienda</> : <><Package size={18} /> Volver al Inventario</>}
                    </button>

                    {activeTab === 'inventory' && (
                        <>
                            <button
                                onClick={() => inventoryService.downloadInventoryExcel()}
                                className="flex items-center justify-center gap-2 bg-[#0a0a0a] border border-gray-800 text-gray-400 px-6 py-4 rounded-2xl hover:text-green-500 transition-all text-[10px] font-black uppercase"
                            >
                                <FileSpreadsheet size={18} /> Exportar Reporte
                            </button>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all text-[10px] font-black uppercase shadow-xl"
                            >
                                <Plus size={18} /> Nuevo Registro
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            {activeTab === 'inventory' ? (
                <>
                    {/* Buscador */}
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={22} />
                        <input
                            type="text"
                            placeholder="BUSCAR POR NOMBRE O MPN..."
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-[2rem] pl-16 pr-8 py-6 text-white outline-none focus:border-purple-500 transition-all text-sm font-bold tracking-widest placeholder:text-gray-800"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Tabla */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="animate-spin text-purple-500" size={48} />
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando...</span>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-800/50 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                            <th className="px-8 py-7 text-center w-28">Preview</th>
                                            <th className="px-8 py-7">Componente</th>
                                            <th className="px-8 py-7 text-center">Stock</th>
                                            <th className="px-8 py-7">Precio</th>
                                            <th className="px-8 py-7 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-900/50">
                                        {filteredComponents.map((item) => (
                                            <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-black border border-gray-800 flex items-center justify-center overflow-hidden">
                                                        {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-800" />}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold text-base tracking-tight">{item.name}</span>
                                                        <span className="text-[10px] font-mono text-purple-500 uppercase font-bold">{item.mpn}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className={`text-[10px] font-black ${item.stock > 5 ? 'text-gray-400' : 'text-red-500'}`}>
                                                            {item.stock} UNIDADES
                                                        </span>
                                                        {item.is_available ? <CheckCircle2 size={14} className="text-green-500 mt-1" /> : <XCircle size={14} className="text-red-500 mt-1" />}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-mono text-white/90 text-sm">${item.price}</td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => handleOpenModal(item)} className="p-3.5 text-gray-500 hover:text-white bg-black rounded-xl border border-gray-800 hover:border-gray-500"><Edit size={18} /></button>
                                                        <button onClick={() => setDeleteId(item.id)} className="p-3.5 text-gray-500 hover:text-red-500 bg-black rounded-xl border border-gray-800 hover:border-red-900/40"><Trash2 size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-purple-500" size={48} />
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                Cargando configuración...
                            </span>
                        </div>
                    ) : (
                        <StoreManagement
                            storeData={storeData}
                            onUpdate={loadData}
                        />
                    )}
                </div>
            )}

            {/* --- MODAL ELIMINAR --- */}
            {deleteId && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-md rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] overflow-hidden">
                        <div className="p-8 pb-4 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">¿Confirmar Eliminación?</h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 leading-relaxed">
                                Esta acción eliminará permanentemente el componente <span className="text-purple-500">ID: {deleteId}</span>.
                            </p>
                        </div>
                        <div className="p-8 pt-4 flex flex-col gap-3">
                            <button onClick={confirmDelete} className="w-full bg-red-600 text-white font-black uppercase py-5 rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-3">
                                <Trash2 size={18} /> Eliminar Registro
                            </button>
                            <button onClick={() => setDeleteId(null)} className="w-full bg-transparent text-gray-500 font-black uppercase py-5 rounded-2xl hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-gray-800">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
                    <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">

                        {/* Header más compacto */}
                        <div className="flex justify-between items-center p-5 border-b border-white/5">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                                    {editingItem ? 'Sincronizar Item' : 'Registro de Activo'}
                                </h3>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Ingeniería de Inventario V3.0</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-900/50 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-red-950/30 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cuerpo del Formulario */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 scrollbar-thin scrollbar-thumb-gray-800">
                            <form className="space-y-6">
                                {errors.server && (
                                    <div className="bg-red-900/10 border border-red-900/30 p-3 rounded-lg flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                                        <AlertTriangle size={14} /> {errors.server}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Input Nombre - Full Width */}
                                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Nombre Comercial del Producto</label>
                                        <input
                                            className={`w-full bg-black border ${errors.name ? 'border-red-900' : 'border-gray-800'} rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 transition-all`}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        {errors.name && <span className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.name}</span>}
                                    </div>

                                    {/* MPN y Categoría */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">MPN (Cód. Fabricante)</label>
                                        <input
                                            className={`w-full bg-black border ${errors.mpn ? 'border-red-900' : 'border-gray-800'} rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-600 transition-all font-mono`}
                                            value={formData.mpn}
                                            onChange={(e) => setFormData({ ...formData, mpn: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Categoría de Sistema</label>
                                        <select
                                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none appearance-none focus:border-purple-600"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">-- SELECCIONAR --</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>

                                    {/* Precio y Stock */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Precio Unitario ($)</label>
                                        <input type="number" step="any" className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-600" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Unidades en Stock</label>
                                        <input type="number" className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-600" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                    </div>

                                    {/* Datasheet */}
                                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                                            <LinkIcon size={12} className="text-purple-500" /> Vínculo Datasheet (URL PDF)
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://example.com/datasheet.pdf"
                                            className={`w-full bg-black border ${errors.datasheet_url ? 'border-red-900' : 'border-gray-800'} rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-600`}
                                            value={formData.datasheet_url}
                                            onChange={(e) => setFormData({ ...formData, datasheet_url: e.target.value })}
                                        />
                                    </div>

                                    {/* Descripción */}
                                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Descripción de Ingeniería</label>
                                        <textarea rows="3" className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-600 transition-all resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>

                                {/* Sección Parámetros Técnicos */}
                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Settings2 size={16} /> Parámetros Técnicos
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setTechSpecs([...techSpecs, { key: '', value: '' }])}
                                            className="text-[9px] font-bold text-white uppercase bg-purple-700 px-4 py-2 rounded-md hover:bg-purple-600 transition-all"
                                        >
                                            + Añadir
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {techSpecs.map((spec, index) => (
                                            <div key={index} className="flex gap-2 items-center animate-in slide-in-from-top-1 duration-200">
                                                <input placeholder="Característica" className="flex-1 bg-black border border-gray-800 rounded-md px-4 py-2.5 text-[11px] text-purple-400 outline-none uppercase font-bold" value={spec.key} onChange={(e) => {
                                                    const n = [...techSpecs]; n[index].key = e.target.value; setTechSpecs(n);
                                                }} />
                                                <input placeholder="Valor" className="flex-1 bg-black border border-gray-800 rounded-md px-4 py-2.5 text-[11px] text-white outline-none" value={spec.value} onChange={(e) => {
                                                    const n = [...techSpecs]; n[index].value = e.target.value; setTechSpecs(n);
                                                }} />
                                                <button type="button" onClick={() => setTechSpecs(techSpecs.filter((_, i) => i !== index))} className="p-2 text-gray-600 hover:text-red-500"><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer del Form (Toggles) */}
                                <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                                    <div className="flex-1 min-w-[200px] space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Imagen</label>
                                        <input type="file" accept="image/*" className="w-full text-[10px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white/5 file:text-white file:text-[10px] file:font-bold file:uppercase file:cursor-pointer hover:file:bg-white/10" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-lg border border-gray-800">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase">Disponible</span>
                                            <button type="button" onClick={() => setFormData({ ...formData, is_available: !formData.is_available })} className={`w-10 h-5 rounded-full transition-all relative ${formData.is_available ? 'bg-purple-600' : 'bg-gray-800'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_available ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-lg border border-gray-800">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase">Oferta</span>
                                            <button type="button" onClick={() => setFormData({ ...formData, is_on_offer: !formData.is_on_offer })} className={`w-10 h-5 rounded-full transition-all relative ${formData.is_on_offer ? 'bg-orange-500' : 'bg-gray-800'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_on_offer ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {formData.is_on_offer && (
                                        <div className="w-full md:w-auto flex-1 animate-in zoom-in-95 duration-200">
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full bg-black border border-orange-900/50 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-orange-500"
                                                placeholder="Precio Oferta ($)"
                                                value={formData.offer_price}
                                                onChange={(e) => setFormData({ ...formData, offer_price: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Acción Principal */}
                        <div className="p-5 border-t border-white/5 bg-[#0a0a0a] rounded-b-xl">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-white text-black font-bold uppercase py-4 rounded-lg hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3 text-sm tracking-tighter"
                            >
                                <Save size={18} /> {editingItem ? 'Sincronizar Cambios' : 'Finalizar Registro'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-black/98 backdrop-blur-xl">
                    <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-4xl rounded-[2.5rem] shadow-3xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">

                        <div className="flex justify-between items-start p-6 md:p-10 pb-4">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
                                    {editingItem ? 'Sincronizar Item' : 'Registro de Activo'}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Ingeniería de Inventario V3.0</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-900 p-3 rounded-full text-gray-500 hover:text-white transition-transform hover:rotate-90"><X size={24} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-4 scrollbar-hide">
                            <form className="space-y-10">
                                {errors.server && <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest"><AlertTriangle size={16} /> {errors.server}</div>}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Nombre Comercial del Producto</label>
                                        <input className={`w-full bg-black border ${errors.name ? 'border-red-900' : 'border-gray-800'} rounded-2xl px-6 py-5 text-white outline-none focus:border-purple-600 transition-all`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        {errors.name && <span className="text-[9px] text-red-500 font-black uppercase ml-1">{errors.name}</span>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">MPN (Cód. Fabricante)</label>
                                        <input className={`w-full bg-black border ${errors.mpn ? 'border-red-900' : 'border-gray-800'} rounded-2xl px-6 py-5 text-white outline-none focus:border-purple-600 transition-all font-mono`} value={formData.mpn} onChange={(e) => setFormData({ ...formData, mpn: e.target.value })} />
                                        {errors.mpn && <span className="text-[9px] text-red-500 font-black uppercase ml-1">{errors.mpn}</span>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Categoría de Sistema</label>
                                        <select className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-5 text-white outline-none appearance-none focus:border-purple-600" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="">-- SELECCIONAR --</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Precio Unitario ($)</label>
                                        <input type="number" step="any" className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-purple-600" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Unidades en Stock</label>
                                        <input type="number" className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-purple-600" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                    </div>
                                    <div className="col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-2"><LinkIcon size={14} className="text-purple-500" /> Vínculo Datasheet (URL PDF)</label>
                                        <input type="url" placeholder="https://example.com/datasheet.pdf" className={`w-full bg-black border ${errors.datasheet_url ? 'border-red-900' : 'border-gray-800'} rounded-2xl px-6 py-5 text-white outline-none focus:border-purple-600`} value={formData.datasheet_url} onChange={(e) => setFormData({ ...formData, datasheet_url: e.target.value })} />
                                        {errors.datasheet_url && <span className="text-[9px] text-red-500 font-black uppercase ml-1">{errors.datasheet_url}</span>}
                                    </div>
                                    <div className="col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Descripción de Ingeniería</label>
                                        <textarea rows="4" className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-5 text-white outline-none focus:border-purple-600 transition-all resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-black text-purple-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                            <Settings2 size={18} /> Parámetros Técnicos
                                        </label>
                                        <button type="button" onClick={() => setTechSpecs([...techSpecs, { key: '', value: '' }])} className="text-[9px] font-black text-white uppercase bg-purple-600 px-5 py-2.5 rounded-xl hover:bg-purple-500 transition-all">
                                            + Añadir Campo
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {techSpecs.map((spec, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-4">
                                                <input placeholder="Característica" className="flex-1 bg-black border border-gray-800 rounded-xl px-5 py-4 text-xs text-purple-400 outline-none uppercase font-bold" value={spec.key} onChange={(e) => {
                                                    const n = [...techSpecs]; n[index].key = e.target.value; setTechSpecs(n);
                                                }} />
                                                <input placeholder="Valor" className="flex-1 bg-black border border-gray-800 rounded-xl px-5 py-4 text-xs text-white outline-none" value={spec.value} onChange={(e) => {
                                                    const n = [...techSpecs]; n[index].value = e.target.value; setTechSpecs(n);
                                                }} />
                                                <button type="button" onClick={() => setTechSpecs(techSpecs.filter((_, i) => i !== index))} className="p-4 text-gray-700 hover:text-red-500"><Trash2 size={20} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8 items-center pt-8 border-t border-white/5">
                                    <div className="flex-1 w-full space-y-3">
                                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Imagen del Componente</label>
                                        <input type="file" accept="image/*" className="w-full text-xs text-gray-500 file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:bg-white/5 file:text-white file:font-black file:uppercase file:cursor-pointer" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                                    </div>
                                    <div className="flex items-center gap-5 bg-black px-8 py-5 rounded-3xl border border-gray-800">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado Disponible</span>
                                        <button type="button" onClick={() => setFormData({ ...formData, is_available: !formData.is_available })} className={`w-14 h-7 rounded-full transition-all relative ${formData.is_available ? 'bg-purple-600 shadow-lg' : 'bg-gray-800'}`}>
                                            <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all ${formData.is_available ? 'right-1.5' : 'left-1.5'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-5 bg-black px-8 py-5 rounded-3xl border border-gray-800">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Activar Oferta</span>
                                            <span className="text-[9px] text-purple-400 font-bold italic">Promoción Especial</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_on_sale: !formData.is_on_sale })}
                                            className={`w-14 h-7 rounded-full transition-all relative ${formData.is_on_sale ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-gray-800'}`}
                                        >
                                            <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all ${formData.is_on_sale ? 'right-1.5' : 'left-1.5'}`} />
                                        </button>
                                    </div>

                                    {formData.is_on_sale && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                            <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">Precio de Oferta ($)</label>
                                            <input
                                                type="number"
                                                step="any"
                                                className="w-full bg-black border border-orange-900/50 rounded-2xl px-6 py-5 text-white outline-none focus:border-orange-500 transition-all shadow-[inner_0_2px_10px_rgba(0,0,0,1)]"
                                                placeholder="Ej: 19.99"
                                                value={formData.discount_price}
                                                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="p-6 md:p-10 border-t border-white/5 bg-[#0a0a0a] rounded-b-[2.5rem]">
                            <button onClick={handleSubmit} className="w-full bg-white text-black font-black uppercase py-6 rounded-[2rem] hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl">
                                <Save size={22} /> {editingItem ? 'Sincronizar con Base de Datos' : 'Finalizar Alta de Componente'}
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};