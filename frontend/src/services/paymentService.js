import { post } from '../utils/request';

const updatePaymentStatus = async (orderId) => {
    return await post(`/payments/update-status/${orderId}`);
};

const paymentService = {
    updatePaymentStatus,
};

export default paymentService;
