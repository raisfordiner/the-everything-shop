import { del, get, post, put } from '../utils/request';

const getAllPromotions = (params) => {
    return get('/promotions', params);
};

const getPromotionById = (id) => {
    return get(`/promotions/${id}`);
}

const deletePromotion = (id) => {
    return del(`/promotions/${id}`);
}

const updatePromotion = (id, data) => {
    return put(`/promotions/${id}`, data);
}

const addPromotion = (data) => {
    return post('/promotions', data);
}

const addProductsToPromotion = (id, productIds) => {
    return post(`/promotions/${id}/products`, { productIds });
};

const removeProductsFromPromotion = (id, productIds) => {
    return del(`/promotions/${id}/products`, { productIds });
};

const addCategoriesToPromotion = (id, categoryIds) => {
    return post(`/promotions/${id}/categories`, { categoryIds });
};

const removeCategoriesFromPromotion = (id, categoryIds) => {
    return del(`/promotions/${id}/categories/`, { categoryIds });
};

const getActivePromotions = (params) => {
    return get('/promotions/active', params);
};

const promotionService = {
    getAllPromotions,
    getPromotionById,
    deletePromotion,
    updatePromotion,
    addPromotion,
    addProductsToPromotion,
    removeProductsFromPromotion,
    addCategoriesToPromotion,
    removeCategoriesFromPromotion,
    getActivePromotions,
};

export default promotionService;