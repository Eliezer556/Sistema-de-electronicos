import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                const savedUser = localStorage.getItem('user_data');
                const token = localStorage.getItem('token');

                if (savedUser && token && savedUser !== "undefined" && savedUser !== "[object Object]") {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const result = await authService.login(email, password);

        if (result.success && result.user) {
            setUser(result.user);
        } else {
            setUser(null);
        }
        return result;
    };

    const register = async (userData) => {
        const result = await authService.register(userData);

        if (result.success) {
            const loginResult = await login(userData.email, userData.password);
            return {
                ...result,
                autoLogin: loginResult.success
            };
        }
        return result;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const deleteAccount = async () => {
        const result = await authService.deleteAccount();

        if (result.success) {
            logout(); 
        }
        
        return result; 
    };

    const changePassword = async (oldPassword, newPassword) => {
        const result = await authService.changePassword(oldPassword, newPassword);
        return result;
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        deleteAccount,
        changePassword,
        isAuthenticated: !!user,
        role: user?.role || null
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};