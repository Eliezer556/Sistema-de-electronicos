import api from "../../../api/axios";

export const inventoryService = {
    getStoreData: async () => {
        const response = await api.get('/stores/?manage=true');
        return response.data;
    },

    getStoreDetail: async (id) => {
        const response = await api.get(`/stores/${id}/`);
        return response.data;
    },

    updateStore: async (id, storeData) => {
        const cleanId = typeof id === 'object' ? id.id : id;

        if (!cleanId) {
            throw new Error("ID de tienda no proporcionado");
        }

        // Importante: storeData aquí ya debe ser un objeto FormData
        const response = await api.patch(`/stores/${cleanId}/`, storeData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getInventory: async () => {
        const response = await api.get('/components/?manage=true');
        return response.data;
    },

    createComponent: async (componentData) => {
        const response = await api.post('/components/', componentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateComponent: async (id, componentData) => {
        const response = await api.patch(`/components/${id}/`, componentData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteComponent: async (id) => {
        const response = await api.delete(`/components/${id}/`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/categories/');
        return response.data;
    },

    downloadInventoryExcel: async () => {
        try {
            const response = await api.get('/components/download_excel/', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Inventario_Zervidtronics_${new Date().getTime()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            throw error;
        }
    }
};