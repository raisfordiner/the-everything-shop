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

const createDirectOrder = async (addressId, productVariantId, quantity, paymentMethod = 'COD') => {
    return await post('/orders/direct', { addressId, productVariantId, quantity, paymentMethod });
};

const updateOrderStatus = async (orderId, status) => {
    return await patch(`/orders/${orderId}`, { status });
};

const orderService = {
    getAllOrders,
    getOrderById,
    createDirectOrder,
    updateOrderStatus,
};

export default orderService;
