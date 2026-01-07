import { del, get, post, put } from "../utils/request.js";

const getAllCoupons = () => {
    return get("/coupons");
}

const getCouponById = (id) => {
    return get(`/coupons/${id}`);
}

const updateCoupon = (id, data) => {
    return put(`/coupons/${id}`, data);
}

const createCoupon = (data) => {
    return post('/coupons', data);
}

const deleteCoupon = (id) => {
    return del(`/coupons/${id}`);
}

/**
 * Get available coupons for selected product variants
 * @param {string[]} productVariantIds - Array of product variant IDs
 */
const getAvailableCoupons = (productVariantIds) => {
    return post('/coupons/available', { productVariantIds });
}

/**
 * Validate and apply a coupon code
 * @param {string} code - Coupon code
 * @param {string[]} productVariantIds - Array of product variant IDs to check applicability
 */
const validateCoupon = (code, productVariantIds) => {
    return post('/coupons/validate', { code, productVariantIds });
}

const couponService = {
    getAllCoupons,
    getCouponById,
    deleteCoupon,
    updateCoupon,
    createCoupon,
    getAvailableCoupons,
    validateCoupon,
}

export default couponService;