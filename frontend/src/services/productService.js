import { get, post, patch, del, put } from '../utils/request';

const getAllProducts = (search) => {
    const url = search ? `/products?search=${search}` : '/products';
    return get(url);
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

const getSellerProducts = () => {
    return get('/products/seller/me');
};

const getSellerProductsBySellerId = (sellerId) => {
    return get(`/products/seller/${sellerId}`);
};

const getProductReviews = (productId) => {
    return get(`/reviews?productId=${productId}`);
};

const productService = {
    getAllProducts,
    getProductById,
    getProductsByCategoryId,
    createProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts,
    getSellerProductsBySellerId,
    getProductReviews,
};

export default productService;