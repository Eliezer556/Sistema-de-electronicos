import api from "../../../api/axios";

export const reviewService = {
    createReview: async (reviewData) => {
        try {

            const response = await api.post('reviews/', reviewData); 
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Error al crear reseña:", error.response?.data);
            throw error;
        }
    },

    getStoreReviews: async (storeId) => {
        try {
            const response = await api.get(`reviews/?store=${storeId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener reseñas:", error);
            return [];
        }
    },

    deleteReview: async (reviewId) => {
        try {
            await api.delete(`reviews/${reviewId}/`);
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar reseña:", error);
            throw error;
        }
    }
};