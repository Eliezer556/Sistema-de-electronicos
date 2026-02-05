import React, { useState, useEffect } from 'react';
import {
    Save, Store, MapPin, Navigation, 
    Image as ImageIcon, Loader2, Check, AlertCircle
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';

export function StoreManagement({ storeData, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        newImage: null 
    });

    useEffect(() => {
        if (storeData) {
            setFormData({
                name: storeData.name || '',
                description: storeData.description || '',
                address: storeData.address || '',
                latitude: storeData.latitude || '',
                longitude: storeData.longitude || '',
                newImage: null
            });
            if (storeData.image) setPreviewImage(storeData.image);
        }
    }, [storeData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, newImage: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!storeData?.id) {
            setError("No se detectó el ID de la tienda.");
            return;
        }

        setLoading(true);
        setSuccess(false);
        setError(null);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('address', formData.address);
        
        // Manejo de valores numéricos para Django DecimalField
        if (formData.latitude) data.append('latitude', formData.latitude);
        if (formData.longitude) data.append('longitude', formData.longitude);

        if (formData.newImage instanceof File) {
            data.append('image', formData.newImage);
        }

        try {
            await inventoryService.updateStore(storeData.id, data);
            setSuccess(true);
            if (onUpdate) onUpdate();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            const detail = err.response?.data?.detail || "Error al actualizar la tienda.";
            setError(detail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
                <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                    <Store className="text-purple-500" size={32} />
                </div>
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Perfil de Tienda</h3>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Sincronizado con Base de Datos Django</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* IZQUIERDA: IMAGEN Y DESCRIPCIÓN */}
                <div className="space-y-6">
                    <div className="group relative">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 block">Fachada de la Tienda</label>
                        <div className="relative w-full h-64 rounded-[2rem] bg-[#0a0a0a] border-2 border-dashed border-gray-800 group-hover:border-purple-500/50 transition-all flex flex-col items-center justify-center overflow-hidden">
                            {previewImage ? (
                                <>
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-colors">
                                            Cambiar Imagen
                                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center gap-4">
                                    <ImageIcon size={40} className="text-gray-800" />
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center px-8">Subir Foto de Fachada</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Descripción de la Tienda</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 text-sm focus:border-purple-500 outline-none transition-all resize-none text-gray-300"
                            placeholder="Describe tu negocio..."
                        />
                    </div>
                </div>

                {/* DERECHA: DATOS Y COORDENADAS */}
                <div className="space-y-6 bg-[#0a0a0a] border border-gray-800 p-8 rounded-[2.5rem]">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Nombre Comercial</label>
                        <div className="relative group">
                            <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-purple-500 outline-none transition-all text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Dirección Física</label>
                        <div className="relative group">
                            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-purple-500 outline-none transition-all text-white"
                            />
                        </div>
                    </div>

                    {/* GEOLOCALIZACIÓN */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Latitud</label>
                            <div className="relative group">
                                <Navigation size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs focus:border-purple-500 outline-none transition-all text-white"
                                    placeholder="0.000000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">Longitud</label>
                            <div className="relative group">
                                <Navigation size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs focus:border-purple-500 outline-none transition-all text-white"
                                    placeholder="0.000000"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all ${
                            success
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-black hover:bg-purple-600 hover:text-white shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : success ? (
                            <><Check size={18} /> Cambios Guardados</>
                        ) : (
                            <><Save size={18} /> Actualizar Tienda</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}