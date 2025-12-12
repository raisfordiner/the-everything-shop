import { get } from '../utils/request';

const getAllPromotions = (params) => {
    return get('/promotions', params);
};

const promotionService = {
    getAllPromotions,
};

export default promotionService;