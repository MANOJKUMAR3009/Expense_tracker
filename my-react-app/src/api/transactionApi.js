import axiosInstance from './axiosInstance';

export const getTransactions = (page = 0, size = 5) =>
    axiosInstance.get(`/transactions?page=${page}&size=${size}`);

export const createTransaction = (data) =>
    axiosInstance.post('/transactions', data);

export const deleteTransaction = (id) =>
    axiosInstance.delete(`/transactions/${id}`);
