import {get} from "../utils/request.js";

const getAllCategories = (params) => {
    return get('/categories', params);
}

const getAllCategoriesSimple = async () => {
    return await get('/categories/all/simple');
}

const categoryService = {
    getAllCategories,
    getAllCategoriesSimple,
}

export default categoryService;