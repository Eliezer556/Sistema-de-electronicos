import api from "../../../api/axios";

export const storeService = {
    getStores : async () => {
        const response = await api.get('/stores/');
        return response.data
    },

    getStoreById: async (id) => {
        const response = await api.get(`/stores/${id}/`);
        return response.data;
    }
}