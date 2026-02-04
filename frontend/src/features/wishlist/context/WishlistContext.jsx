import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(false);

    const createNewWishlist = useCallback(async (name) => {
        const result = await wishlistService.createWishlist(name);
        if (result.success) {
            setWishlists(prev => [...prev, result.data]);
        }
        return result;
    }, []);

    const fetchWishlists = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const result = await wishlistService.getWishlist();
            if (result.success) {
                if (result.data.length === 0) {
                    await createNewWishlist("Mi Lista de Deseos");
                } else {
                    setWishlists(result.data);
                }
            }
        } finally {
            setLoading(false);
        }
    }, [createNewWishlist]);

    useEffect(() => {
        fetchWishlists();
    }, [fetchWishlists]);

    const toggleComponentInList = async (wishlistId, productId) => {
        const result = await wishlistService.toggleItem(wishlistId, productId);

        if (result.success) {
            setWishlists(prev => prev.map(list =>
                list.id === wishlistId ? result.data : list
            ));
        } else {
            console.error("Error al alternar componente:", result.message);
        }
    };

    const updateItemQuantity = async (wishlistId, productId, newQuantity) => {
        if (newQuantity < 1) return;

        const result = await wishlistService.updateQuantity(wishlistId, productId, newQuantity);

        if (result.success) {
            setWishlists(prev => prev.map(list =>
                list.id === wishlistId ? result.data : list
            ));
        } else {
            console.error("Error al actualizar cantidad:", result.message);
        }
    };

    const clearWishlist = async () => {
        if (wishlists.length === 0) return;
        
        const wishlistId = wishlists[0].id;
        const result = await wishlistService.clearWishlist(wishlistId);

        if (result.success) {
            setWishlists(prev => prev.map(list =>
                list.id === wishlistId ? result.data : list
            ));
        } else {
            console.error("Error al vaciar la lista:", result.message);
        }
    };

    const isInSpecificWishlist = (wishlistId, productId) => {
        const list = wishlists.find(l => l.id === wishlistId);
        return list ? list.items?.some(item => item.component.id === productId) : false;
    };

    return (
        <WishlistContext.Provider value={{
            wishlists,
            loading,
            fetchWishlists,
            createNewWishlist,
            toggleComponentInList,
            updateItemQuantity,
            clearWishlist,
            isInSpecificWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist debe usarse dentro de WishlistProvider');
    }
    return context;
};