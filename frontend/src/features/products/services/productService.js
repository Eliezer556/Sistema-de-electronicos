import api from "../../../api/axios";

export const productService = {
    getAllProducts: async () => {
        try {
            const response = await api.get('/components/');
            return { 
                success: true, 
                data: response.data 
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al cargar los componentes electrónicos'
            };
        }
    },

    getProductById: async (id) => {
        try {
            const response = await api.get(`/components/${id}/`);
            return { 
                success: true, 
                data: response.data 
            };
        } catch (error) {
            return { 
                success: false, 
                message: 'No se pudo encontrar el componente especificado' 
            };
        }
    },

    getRecommendations: async () => {
        try {
            const response = await api.get('/components/recommendations/');
            return { 
                success: true, 
                data: response.data 
            };
        } catch (error) {
            return { success: false, message: 'Error al cargar recomendaciones' };
        }
    }
};