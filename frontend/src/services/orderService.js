import { get, patch, post } from '../utils/request';

const getAllOrders = (status) => {
    let url = '/orders';
    if (status) {
        url += `?status=${status}`;
    }
    return get(url);
};

const getOrderById = async (orderId) => {
    return await get(`/orders/${orderId}`);
};

const createDirectOrder = async (addressId, productVariantId, quantity) => {
    return await post('/orders/direct', { addressId, productVariantId, quantity });
};

const updateOrderStatus = async (orderId, status) => {
    return await patch(`/orders/${orderId}`, { status });
};

// const updatePaymentStatus = async (orderId, paymentStatus) => {
//     return await patch(`/orders/${orderId}`, { paymentStatus });
// }

const orderService = {
    getAllOrders,
    getOrderById,
    createDirectOrder,
    updateOrderStatus,
    // updatePaymentStatus,
};

export default orderService;
