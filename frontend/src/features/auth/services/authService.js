import api from "../../../api/axios";

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/users/login/', { email, password });

            if (response.data.access) {
                const { access, refresh, role, user } = response.data;
                const userData = user || { email, role };

                localStorage.setItem('token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user_role', role);
                localStorage.setItem('user_data', JSON.stringify(userData));

                return {
                    success: true,
                    data: response.data,
                    user: userData,
                    token: access,
                    refresh: refresh
                };
            }

            return { success: false, message: 'No se recibió el token de acceso.' };

        } catch (error) {
            return handleApiError(error, 'Error al intentar iniciar sesión');
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/users/', userData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return handleApiError(error, 'Error al crear la cuenta');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        return { success: true };
    }
};

const handleApiError = (error, defaultMessage) => {
    if (error.response) {
        return {
            success: false,
            errors: error.response.data,
            message: error.response.data.detail || defaultMessage,
            status: error.response.status
        };
    } else if (error.request) {
        return {
            success: false,
            message: 'No hay conexión con el servidor. Verifique su internet.'
        };
    } else {
        return {
            success: false,
            message: error.message || 'Error inesperado en el sistema'
        };
    }
};