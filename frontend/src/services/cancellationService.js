import { del, get, post, put } from "../utils/request.js";

const getAllCancellations = (params) => {
    return get("/cancellations", { params });
}

const getCancellationById = (id) => {
    return get(`/cancellations/${id}`);
}

const createCancellationRequest = (orderId, reason) => {
    return post("/cancellations/request", { orderId, reason });
}

const withdrawCancellationRequest = (orderId) => {
    return del(`/cancellations/request/${orderId}`);
}

const updateCancellation = (id, data) => {
    return put(`/cancellations/${id}`, data);
}

const deleteCancellation = (id) => {
    return del(`/cancellations/${id}`);
}

const cancellationService = {
    getAllCancellations,
    getCancellationById,
    createCancellationRequest,
    withdrawCancellationRequest,
    updateCancellation,
    deleteCancellation,
}

export default cancellationService;