import { post, del } from '../utils/request';

const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return post('/upload', formData);
};

const deleteFile = (fileUrl) => {
    return del('/upload', { fileUrl });
};

const uploadService = {
    uploadFile,
    deleteFile,
};

export default uploadService;
