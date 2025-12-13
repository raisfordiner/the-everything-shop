import { get, patch, post } from '../utils/request';

const getAllOrders = () => {
    return get('/orders');
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

const orderService = {
    getAllOrders,
    getOrderById,
    createDirectOrder,
    updateOrderStatus,
};

export default orderService;
