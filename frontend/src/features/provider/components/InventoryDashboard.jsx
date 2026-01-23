import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';
import {
    Package, Plus, FileSpreadsheet, Trash2,
    Edit, Search, Loader2, X, Image as ImageIcon, Save, Settings2, Link as LinkIcon, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';

export const InventoryDashboard = () => {
    const [components, setComponents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [editingItem, setEditingItem] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        mpn: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        datasheet_url: '',
        is_available: true,
        image: null
    });

    const [techSpecs, setTechSpecs] = useState([{ key: '', value: '' }]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [compData, catData] = await Promise.all([
                inventoryService.getInventory(),
                inventoryService.getCategories()
            ]);
            setComponents(compData || []);
            setCategories(catData || []);
        } catch (error) {
            setErrors({ server: "Error de conexión con el servidor." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
        if (!formData.mpn.trim()) newErrors.mpn = "El MPN es obligatorio";
        if (!formData.category) newErrors.category = "Seleccione una categoría";
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Precio inválido";
        if (formData.stock === '' || parseInt(formData.stock) < 0) newErrors.stock = "Stock inválido";

        if (formData.datasheet_url && formData.datasheet_url.trim() !== "") {
            try {
                new URL(formData.datasheet_url);
            } catch (_) {
                newErrors.datasheet_url = "La URL no es válida. Debe incluir http:// o https://";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpenModal = (item = null) => {
        setErrors({});
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                mpn: item.mpn,
                description: item.description || '',
                price: item.price,
                stock: item.stock,
                category: item.category,
                datasheet_url: item.datasheet_url || '',
                is_available: item.is_available,
                image: null
            });
            const specs = item.technical_specs && typeof item.technical_specs === 'object'
                ? Object.entries(item.technical_specs).map(([key, value]) => ({ key, value }))
                : [{ key: '', value: '' }];
            setTechSpecs(specs.length > 0 ? specs : [{ key: '', value: '' }]);
        } else {
            setEditingItem(null);
            setFormData({ name: '', mpn: '', description: '', price: '', stock: '0', category: '', datasheet_url: '', is_available: true, image: null });
            setTechSpecs([{ key: '', value: '' }]);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        data.append('name', formData.name);
        data.append('mpn', formData.mpn);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);

        if (formData.datasheet_url && formData.datasheet_url.trim() !== "") {
            data.append('datasheet_url', formData.datasheet_url);
        }

        data.append('is_available', formData.is_available);

        if (formData.image instanceof File) {
            data.append('image', formData.image);
        }

        const specsObj = {};
        techSpecs.forEach(spec => {
            if (spec.key.trim()) specsObj[spec.key.trim()] = spec.value;
        });
        data.append('technical_specs', JSON.stringify(specsObj));

        try {
            if (editingItem) {
                await inventoryService.updateComponent(editingItem.id, data);
            } else {
                await inventoryService.createComponent(data);
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            const serverMsg = error.response?.data?.datasheet_url
                ? "URL de Datasheet inválida."
                : "Error en el servidor. Verifique el MPN o la conexión.";
            setErrors({ server: serverMsg });
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id)
    };

    const confirmDelete = async () => {
        try {
            await inventoryService.deleteComponent(deleteId);
            setComponents(prev => prev.filter(item => item.id !== deleteId));
            setDeleteId(null)
        } catch (error) {
            console.error(error);
        }
    }

    const filteredComponents = components.filter(c =>
        (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (c.mpn?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">Suministros & Stock</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Sincronización de Inventario en Tiempo Real</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => inventoryService.downloadInventoryExcel()} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0a0a0a] border border-gray-800 text-gray-400 px-6 py-4 rounded-2xl hover:text-green-500 transition-all text-[10px] font-black uppercase">
                        <FileSpreadsheet size={18} /> <span className="hidden md:inline">Exportar Reporte</span><span className="md:hidden">Excel</span>
                    </button>
                    <button onClick={() => handleOpenModal()} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all text-[10px] font-black uppercase shadow-xl">
                        <Plus size={18} /> Nuevo Registro
                    </button>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={22} />
                <input
                    type="text"
                    placeholder="BUSCAR POR NOMBRE O MPN..."
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-[2rem] pl-16 pr-8 py-6 text-white outline-none focus:border-purple-500 transition-all text-sm font-bold tracking-widest placeholder:text-gray-800"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-purple-500" size={48} />
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Cargando Base de Datos...</span>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-800/50 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    <th className="px-8 py-7 text-center w-28">Preview</th>
                                    <th className="px-8 py-7">Componente / Identificador</th>
                                    <th className="px-8 py-7 text-center">Estado de Stock</th>
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
                                                <button onClick={() => handleDeleteClick(item.id)} className="p-3.5 text-gray-500 hover:text-red-500 bg-black rounded-xl border border-gray-800 hover:border-red-900/40"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {deleteId && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-md rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 pb-4 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                                ¿Confirmar Eliminación?
                            </h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 leading-relaxed">
                                Esta acción es irreversible y eliminará el componente <br />
                                <span className="text-purple-500">ID: {deleteId}</span> de la base de datos.
                            </p>
                        </div>
                        <div className="p-8 pt-4 flex flex-col gap-3">
                            <button
                                onClick={confirmDelete}
                                className="w-full bg-red-600 text-white font-black uppercase py-5 rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/20"
                            >
                                <Trash2 size={18} />
                                Eliminar Registro
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="w-full bg-transparent text-gray-500 font-black uppercase py-5 rounded-2xl hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-gray-800"
                            >
                                Cancelar Operación
                            </button>
                        </div>
                        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
                    </div>
                </div>
            )}


            {isModalOpen && (
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
            )}
        </div>
    );
};