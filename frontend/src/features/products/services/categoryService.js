import api from "../../../api/axios";

export const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await api.get('/categories/');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al cargar categorías'
            };
        }
    }
};