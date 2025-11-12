import { get } from '../utils/request';

const getAllProducts = () => {
    return get('/products');
};

const getProductById = (productId) => {
    return get(`/products/${productId}`);
};

const getProductsByCategoryId = (categoryId) => {
    return get(`/products/category/${categoryId}`);
};

const productService = {
    getAllProducts,
    getProductById,
    getProductsByCategoryId,
};

export default productService;