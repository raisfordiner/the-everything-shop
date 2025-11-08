import { post } from '../utils/request';

const login = (email, password) => {
    return post('/auth/login', { email, password });
};

const register = ({ username, email, password, password_confirmation }) => {
    return post('/auth/register', { username, email, password, password_confirmation });
};

const logout = () => {
    return post('/auth/logout');
};

const authService = {
    login,
    register,
    logout,
};

export default authService;