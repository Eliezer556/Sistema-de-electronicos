import api from "../api/axios";

export const analyticsService = {
    getStats: async () => {
        try {
            const response = await api.get('/analytics/');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.detail || 'Error al cargar estadísticas'
            };
        }
    }
};