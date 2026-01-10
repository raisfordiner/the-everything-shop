import { get } from '../utils/request';

const getMyMembership = async () => {
    return await get('/memberships/me');
};

const membershipService = {
    getMyMembership,
};

export default membershipService;
