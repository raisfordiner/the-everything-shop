import { del, get, post, put } from "../utils/request.js";

const getAllReturns = (params) => {
    return get("/returns", { params });
}

const getReturnById = (id) => {
    return get(`/returns/${id}`);
}

const createReturnRequest = (orderId, reason) => {
    return post("/returns/request", { orderId, reason });
}

const withdrawReturnRequest = (orderId) => {
    return del(`/returns/request/${orderId}`);
}

const updateReturn = (id, data) => {
    return put(`/returns/${id}`, data);
}

const deleteReturn = (id) => {
    return del(`/returns/${id}`);
}

const returnService = {
    getAllReturns,
    getReturnById,
    createReturnRequest,
    withdrawReturnRequest,
    updateReturn,
    deleteReturn,
}

export default returnService;