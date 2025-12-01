import {get, del} from "../utils/request.js";

const getAllCategories = (params) => {
    return get('/categories', params);
}

const getAllCategoriesSimple = async () => {
    return await get('/categories/all/simple');
}

const getCategoryById = async (id) => {
    return await get(`/categories/${id}`)
}

const deleteCategory = async (id) => {
    return await del(`/categories/${id}`)
}

const createCategory = async (data) => {
    return await post(`/categories`, data)
}

const categoryService = {
    getAllCategories,
    getAllCategoriesSimple,
    getCategoryById,
    deleteCategory
}

export default categoryService;