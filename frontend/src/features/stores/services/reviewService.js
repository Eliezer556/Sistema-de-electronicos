import api from "../../../api/axios";

export const reviewService = {
    /**
    @param {Object} reviewData 
     */
    createReview: async (reviewData) => {
        try {
            const response = await api.post('/interactions/reviews/', reviewData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getStoreReviews: async (storeId) => {
        const response = await api.get(`/interactions/reviews/?store=${storeId}`);
        return response.data;
    }
};