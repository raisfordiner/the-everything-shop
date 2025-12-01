import {get, post} from '../utils/request';

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

const authService = {
    login,
    register,
    logout,
    checkSession,
};

export default authService;