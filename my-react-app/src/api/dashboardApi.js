import axiosInstance from './axiosInstance';

export const getDashboard = () => axiosInstance.get('/dashboard');
export const getSummary = () => axiosInstance.get('/dashboard/summary');
export const getMonthlyOverview = () => axiosInstance.get('/dashboard/monthly-overview');
export const getCategoryBreakdown = () => axiosInstance.get('/dashboard/category-breakdown');
