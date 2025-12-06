import { get, post } from '../utils/request';

const login = (email, password) => {
    return post('/auth/login', { email, password });
};

const register = ({ username, email, password, password_confirmation }) => {
    return post('/auth/register', { username, email, password, password_confirmation });
};

const logout = () => {
    return post('/auth/logout');
};

const checkSession = () => {
    return get('/user/info');
};

const verify = (token) => {
    return get(`/auth/verify?token=${token}`);
};

const authService = {
    login,
    register,
    logout,
    checkSession,
    verify,
};

export default authService;