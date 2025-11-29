import { get } from '../utils/request';

const getAllOrders = () => {
    return get('/orders');
};

const getOrderById = async (orderId) => {
    return await get(`/orders/${orderId}`);
};

const orderService = {
    getAllOrders,
    getOrderById,
};

export default orderService;