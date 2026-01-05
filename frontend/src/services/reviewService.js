import { get, post, del, put } from '../utils/request';

const getReviews = (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value);
    });
    const queryString = searchParams.toString();
    const url = queryString ? `/reviews?${queryString}` : '/reviews';
    return get(url);
};

const getReviewById = (id) => {
    return get(`/reviews/${id}`);
};

const createReview = (data) => {
    return post('/reviews', data);
};

const updateReview = (id, data) => {
    return put(`/reviews/${id}`, data);
};

const deleteReview = (id) => {
    return del(`/reviews/${id}`);
};

const reviewService = {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
};

export default reviewService;
