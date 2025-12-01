const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

const request = async (path, options = {}) => {
    const defaultOptions = {
        credentials: 'include',
        ...options,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(API_DOMAIN + path, defaultOptions);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errors has occurred');
    }

    try {
        const data = await response.json();
        return data;
    } catch (e) {
        return null;
    }
};

export const get = (path) => {
    return request(path, { method: 'GET' });
};

export const post = (path, data) => {
    return request(path, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const del = (path) => {
    return request(path, { method: 'DELETE' });
};  

export const patch = (path, data) => {
    return request(path, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};

export const put = (path, data) => {
    return request(path, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};