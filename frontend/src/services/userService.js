import {del, get, post, put} from "../utils/request.js";

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

const userService = {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    createUser,
}

export default userService;