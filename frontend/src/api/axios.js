import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' },
});

/**/
/*Peaje de seguridad: Revisa el localStorage buscando un token*/
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/*extintor*/
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        /*pastilla del dia despues*/
        const originalRequest = error.config;
        const isAuthPath = originalRequest.url.includes('/users/login/') || 
                          originalRequest.url.includes('/users/register/');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
            originalRequest._retry = true;  /*Bloqueo de bucles*/

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error("No refresh token available");

                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken
                }); /*Petición de renovación*/

                const { access } = response.data;
                localStorage.setItem('token', access);
                api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;