import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Campaign Agreement APIs
export const acceptCampaignTerms = async (campaignId, role) => {
  const endpoint = role === 'brand' ? 'brand-accept' : 'influencer-accept';
  const response = await axios.post(
    `${API_URL}/campaigns/${campaignId}/${endpoint}`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getCampaignAgreementStatus = async (campaignId) => {
  const response = await axios.get(
    `${API_URL}/campaigns/${campaignId}/agreement-status`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Dispute APIs
export const fileDispute = async (campaignId, disputeData) => {
  const response = await axios.post(
    `${API_URL}/campaigns/${campaignId}/raise-dispute`,
    disputeData,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getDisputeDetails = async (campaignId) => {
  const response = await axios.get(
    `${API_URL}/campaigns/${campaignId}/dispute-status`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const resolveDispute = async (campaignId, resolution) => {
  const response = await axios.post(
    `${API_URL}/campaigns/${campaignId}/admin-decision`,
    resolution,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getAllDisputes = async (status = null) => {
  // Note: This endpoint needs to be implemented in the backend
  // For now, return empty array
  return [];
};

export default {
  acceptCampaignTerms,
  getCampaignAgreementStatus,
  fileDispute,
  getDisputeDetails,
  resolveDispute,
  getAllDisputes
};
