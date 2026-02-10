import api from "../../../api/axios";

export const productService = {
    getAllProducts: async (params = {}) => {
        try {
            // Axios ignora automáticamente los parámetros si el objeto está vacío
            const response = await api.get('/components/', { params });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al cargar los componentes'
            };
        }
    },

    toggleStockNotification: async (productId) => {
        try {
            const response = await api.post(`/components/${productId}/toggle_notification/`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: 'Error al actualizar la notificación' };
        }
    },

    getLowStockAlerts: async () => {
        try {
            const response = await api.get('/components/low_stock_alerts/');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.detail || 'Error al cargar alertas'
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
    },

    getPriceComparison: async (productId) => {
        try {
            const response = await api.get(`/components/${productId}/price_comparison/`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error("Error en getPriceComparison:", error);
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al obtener la comparativa de precios'
            };
        }
    },
};