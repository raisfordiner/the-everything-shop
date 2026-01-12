import { post, put } from '../utils/request';

const updatePaymentStatus = async (orderId) => {
    return await post(`/payments/update-status/${orderId}`);
};

const putPaymentStatus = async(paymentId, status) => {
    return await put(`/payments/${paymentId}/status`, { status });
}

const paymentService = {
    updatePaymentStatus,
    putPaymentStatus
};

export default paymentService;
