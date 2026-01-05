import { post } from '../utils/request';

const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return post('/upload', formData);
};

const uploadService = {
    uploadFile,
};

export default uploadService;
