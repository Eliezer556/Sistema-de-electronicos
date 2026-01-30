import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
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
    
    const [filters, setFilters] = useState({
        min_price: '',
        max_price: '',
        montaje: '',
        encapsulado: '',
        mpn: ''
    });

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
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.mpn?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = 
                selectedCategory === 'all' || 
                product.category_name === selectedCategory;


            const matchesMinPrice = !filters.min_price || product.price >= parseFloat(filters.min_price);
            const matchesMaxPrice = !filters.max_price || product.price <= parseFloat(filters.max_price);

            const specs = product.technical_specs || {};
            const matchesMontaje = !filters.montaje || 
                specs.montaje?.toLowerCase() === filters.montaje.toLowerCase();
            
            const matchesMPNFilter = !filters.mpn || 
                product.mpn?.toLowerCase().includes(filters.mpn.toLowerCase());

            return matchesSearch && 
                   matchesCategory && 
                   matchesMinPrice && 
                   matchesMaxPrice && 
                   matchesMontaje && 
                   matchesMPNFilter;
        });
    }, [products, searchTerm, selectedCategory, filters]); 

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
        filters,    
        setFilters, 
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
    if (!context) throw new Error('useProducts debe ser usado dentro de un ProductProvider');
    return context;
};