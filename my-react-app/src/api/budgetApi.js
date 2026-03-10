import axiosInstance from './axiosInstance';

export const createOrUpdateBudget = (data) =>
    axiosInstance.post('/budgets', data);

export const getBudgetStatus = (category, month) =>
    axiosInstance.get(`/budgets/status?category=${encodeURIComponent(category)}&month=${month}`);

export const deleteBudget = (category, month) =>
    axiosInstance.delete(`/budgets?category=${encodeURIComponent(category)}&month=${month}`);
