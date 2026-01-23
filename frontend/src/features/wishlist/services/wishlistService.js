import api from "../../../api/axios";

export const wishlistService = {
    getWishlist: async () => {
        try {
            const response = await api.get('/wishlist/');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al obtener las listas'
            };
        }
    },

    createWishlist: async (name) => {
        try {
            const response = await api.post('/wishlist/', { name });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al crear la lista'
            };
        }
    },

    updateWishlistComponents: async (wishlistId, componentsArray) => {
        try {
            const response = await api.patch(`/wishlist/${wishlistId}/`, {
                components: componentsArray
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al actualizar componentes'
            };
        }
    },

    updateItemQuantity: async (wishlistId, productId, quantity) => {
        try {
            const response = await api.post(`/wishlist/${wishlistId}/update_quantity/`, {
                product_id: productId,
                quantity: quantity
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al actualizar cantidad'
            };
        }
    },

    deleteWishlist: async (wishlistId) => {
        try {
            await api.delete(`/wishlist/${wishlistId}/`);
            return { success: true };
        } catch (error) {
            return { success: false, message: 'No se pudo eliminar la lista' };
        }
    },

    toggleItem: async (wishlistId, productId) => {
        try {
            const response = await api.post(`/wishlist/${wishlistId}/toggle_item/`, {
                product_id: productId 
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al actualizar la lista'
            };
        }
    },

    exportBudget: async (wishlistId) => {
        try {
            const response = await api.get(`/wishlist/${wishlistId}/export_budget/`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: 'No se pudo generar el presupuesto' };
        }
    }
};