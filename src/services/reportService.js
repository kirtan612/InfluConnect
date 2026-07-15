import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Report APIs
export const createReport = async (reportData) => {
  const response = await axios.post(
    `${API_URL}/reports`,
    reportData,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getMyReports = async () => {
  const response = await axios.get(
    `${API_URL}/reports/my-reports`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getAllReports = async (entityType = null, statusFilter = null) => {
  const params = {};
  if (entityType) params.entity_type = entityType;
  if (statusFilter) params.status_filter = statusFilter;
  
  const response = await axios.get(
    `${API_URL}/reports`,
    { 
      headers: getAuthHeader(),
      params 
    }
  );
  return response.data;
};

export const getReportById = async (reportId) => {
  const response = await axios.get(
    `${API_URL}/reports/${reportId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const reviewReport = async (reportId, reviewData) => {
  const response = await axios.post(
    `${API_URL}/reports/${reportId}/review`,
    reviewData,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export default {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  reviewReport
};
