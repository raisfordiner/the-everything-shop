import {del, get, put} from "../utils/request.js";

const getAllReturns = (params) => {
    return get("/returns", { params });
}

const getReturnById = (id) => {
    return get(`/returns/${id}`);
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
    updateReturn,
    deleteReturn,
}

export default returnService;