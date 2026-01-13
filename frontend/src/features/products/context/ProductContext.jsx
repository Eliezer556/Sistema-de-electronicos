import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [productRes, categoryRes] = await Promise.all([
                productService.getAllProducts(),
                categoryService.getAllCategories()
            ]);

            if (productRes.success && categoryRes.success) {
                setProducts(productRes.data);
                setCategories(categoryRes.data);
            } else {
                setError(productRes.message || categoryRes.message);
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = 
                selectedCategory === 'all' || 
                product.category_name === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const value = {
        products: filteredProducts,
        allProducts: products,
        categories,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        fetchData
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts debe ser usado dentro de un ProductProvider');
    }
    return context;
};