import { get, post, put, del } from '../utils/request';

const getCarts = (customerID) => {
    return get(`/carts?customerID=${customerID}`);
};

const getCart = (id) => {
    return get(`/carts/${id}`);
};

const createCart = (customerId) => {
    return post('/carts', { customerId });
};

const deleteCart = (id) => {
    return del(`/carts/${id}`);
};

const addCartItem = (cartId, productVariantId, quantity) => {
    return post(`/carts/${cartId}/items`, { productVariantId, quantity });
};

const getCartItem = (cartId, itemId) => {
    return get(`/carts/${cartId}/items/${itemId}`);
};

const updateCartItem = (cartId, itemId, quantity) => {
    return put(`/carts/${cartId}/items/${itemId}`, { quantity });
};

const deleteCartItem = (cartId, itemId) => {
    return del(`/carts/${cartId}/items/${itemId}`);
};

const checkout = (customerId, cartItemIds, addressId, paymentMethod, discountInfo = {}) => {
    return post(`/carts/${customerId}/checkout`, {
        cartItemIds,
        addressId,
        paymentMethod,
        couponCode: discountInfo.couponCode,
        couponDiscount: discountInfo.couponDiscount,
        membershipDiscount: discountInfo.membershipDiscount,
        membershipTier: discountInfo.membershipTier,
    });
};

const cartService = {
    getCarts,
    getCart,
    createCart,
    deleteCart,
    addCartItem,
    getCartItem,
    updateCartItem,
    deleteCartItem,
    checkout,
};

export default cartService;
