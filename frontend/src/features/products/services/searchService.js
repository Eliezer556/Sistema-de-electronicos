import api from '../../../api/axios';

export const searchService = {
    getSuggestions: async () => {
        try {
            const response = await api.get('/wishlist/search-suggestions/');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: 'Error al cargar sugerencias' };
        }
    },

    saveSearch: async (query) => {
        try {
            const response = await api.post('/wishlist/save-search/', { query });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: 'Error al guardar historial' };
        }
    }
};