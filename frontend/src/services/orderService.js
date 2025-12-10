import { get } from '../utils/request';

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

const orderService = {
    getAllOrders,
    getOrderById,
};

export default orderService;