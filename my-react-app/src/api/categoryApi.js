import axiosInstance from './axiosInstance';

export const getCategories = () => axiosInstance.get('/categories');

export const getCategoriesByType = (type) =>
    axiosInstance.get(`/categories/type/${type}`);

export const createCategory = (data) =>
    axiosInstance.post('/categories', data);

export const updateCategory = (id, data) =>
    axiosInstance.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
    axiosInstance.delete(`/categories/${id}`);
