import {del, get, put} from "../utils/request.js";

const getAllCancellations = (params) => {
    return get("/cancellations", {params});
}

const getCancellationById = (id) => {
    return get(`/cancellations/${id}`);
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
    updateCancellation,
    deleteCancellation,
}

export default cancellationService;