import {del, get, post, put} from "../utils/request.js";

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

const couponService = {
    getAllCoupons,
    getCouponById,
    deleteCoupon,
    updateCoupon,
    createCoupon,
}

export default couponService;