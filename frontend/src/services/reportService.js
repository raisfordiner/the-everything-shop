import { get } from '../utils/request';

const buildQueryString = (params) => {
    const filtered = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
    if (filtered.length === 0) return '';
    return '?' + filtered.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
};

const getInventoryLogs = (params = {}) => {
    return get('/reports/inventory' + buildQueryString(params));
};

const getRevenueLogs = (params = {}) => {
    return get('/reports/revenue' + buildQueryString(params));
};

const getAuditLogs = (params = {}) => {
    return get('/reports/audit' + buildQueryString(params));
};

export default {
    getInventoryLogs,
    getRevenueLogs,
    getAuditLogs,
};
