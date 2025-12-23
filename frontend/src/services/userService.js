import { del, get, post, put } from "../utils/request.js";

const getAllUsers = () => {
    return get("/users");
}

const getUserById = (id) => {
    return get(`/users/${id}`);
}

const deleteUser = (id) => {
    return del(`/users/${id}`);
}

const updateUser = (id, data) => {
    return put(`/users/${id}`, data);
}

const createUser = (data) => {
    return post('/users', data);
};

const getUserInfo = () => {
    return get("/user/info");
}

const updateUserInfo = (data) => {
    return put("/user/info", data);
}

const getPfp = () => {
    return get("/user/pfp");
}

const uploadPfp = (formData) => {
    return post("/user/pfp", formData);
}

const userService = {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    createUser,
    updateUserInfo,
    getUserInfo,
    getPfp,
    uploadPfp
}

export default userService;