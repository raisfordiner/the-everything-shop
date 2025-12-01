import { get, post, patch, del, put } from '../utils/request';

const getAllProducts = () => {
    return get('/products');
};

const getProductById = async (productId) => {
    return await get(`/products/${productId}`);
};

const getProductsByCategoryId = (categoryId) => {
    return get(`/products/category/${categoryId}`);
};

const createProduct = (productData) => {
    return post('/products', productData);
};

const updateProduct = (productId, productData) => {
    return put(`/products/${productId}`, productData);
};

const deleteProduct = (productId) => {
    return del(`/products/${productId}`);
};

const productService = {
    getAllProducts,
    getProductById,
    getProductsByCategoryId,
    createProduct,
    updateProduct,
    deleteProduct,
};

export default productService;