import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetail } from './ProductDetail';
import { productService } from '../services/productService';
import React from 'react';

export const ProductDetailWrapper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = React.useState(null);

    React.useEffect(() => {
        const loadProduct = async () => {
            // productService debe tener un método para traer un solo producto por ID
            const response = await productService.getProductById(id); 
            if (response.success) {
                setProduct(response.data);
            }
        };
        loadProduct();
    }, [id]);

    if (!product) return <div className="text-white p-10">Cargando detalles...</div>;

    return (
        <ProductDetail 
            product={product} 
            onBack={() => navigate(-1)} 
        />
    );
};