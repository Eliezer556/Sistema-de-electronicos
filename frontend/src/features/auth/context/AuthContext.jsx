import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { productService } from '../../products/services/productService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasStockAlert, setHasStockAlert] = useState(false);

    const checkStockAlerts = useCallback(async () => {
        if (!user || (user.role !== 'cliente' && user.role !== 'seller')) {
            setHasStockAlert(false);
            return null;
        }

        try {
            const result = await productService.getLowStockAlerts();
            if (result.success && result.data) {
                const { low_stock, out_of_stock, total_alerts } = result.data;
                const tieneAlertas = (total_alerts > 0) ||
                    (Array.isArray(low_stock) && low_stock.length > 0) ||
                    (Array.isArray(out_of_stock) && out_of_stock.length > 0);

                setHasStockAlert(tieneAlertas);
                return result.data;
            } else {
                setHasStockAlert(false);
                return null;
            }
        } catch (error) {
            setHasStockAlert(false);
            return null;
        }
    }, [user]);

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

    useEffect(() => {
        checkStockAlerts();
    }, [user, checkStockAlerts]);

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.success && result.user) setUser(result.user);
        return result;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setHasStockAlert(false);
    };

    const value = {
        user,
        login,
        logout,
        loading,
        hasStockAlert,
        checkStockAlerts,
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
    if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    return context;
};