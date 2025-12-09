import { del, get, post, put } from "../utils/request.js";

const getAddresses = () => {
    return get("/addresses");
}

const getAddress = (id) => {
    return get(`/addresses/${id}`);
}

const createAddress = (data) => {
    return post("/addresses", data);
}

const updateAddress = (id, data) => {
    return put(`/addresses/${id}`, data);
}

const deleteAddress = (id) => {
    return del(`/addresses/${id}`);
}

const addressService = {
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
}

export default addressService;
