import { apiFetch } from '../utils/api'

class CompanyService {
  async getProfile() {
    const response = await apiFetch('/brand/profile')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch profile' }))
      throw new Error(error.detail || 'Failed to fetch profile')
    }
    
    return response.json()
  }

  async updateProfile(data) {
    const response = await apiFetch('/brand/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update profile' }))
      throw new Error(error.detail || 'Failed to update profile')
    }
    
    return response.json()
  }

  async getCampaigns() {
    const response = await apiFetch('/campaign')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch campaigns' }))
      throw new Error(error.detail || 'Failed to fetch campaigns')
    }
    
    return response.json()
  }

  async createCampaign(data) {
    const response = await apiFetch('/campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create campaign' }))
      throw new Error(error.detail || 'Failed to create campaign')
    }
    
    return response.json()
  }

  async updateCampaign(campaignId, data) {
    const response = await apiFetch(`/campaign/${campaignId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update campaign' }))
      throw new Error(error.detail || 'Failed to update campaign')
    }
    
    return response.json()
  }

  async deleteCampaign(campaignId) {
    const response = await apiFetch(`/campaign/${campaignId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete campaign' }))
      throw new Error(error.detail || 'Failed to delete campaign')
    }
    
    return response.json()
  }

  async getRequests() {
    const response = await apiFetch('/request')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch requests' }))
      throw new Error(error.detail || 'Failed to fetch requests')
    }
    
    return response.json()
  }

  async createRequest(campaignId, influencerId) {
    const response = await apiFetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ campaign_id: campaignId, influencer_id: influencerId })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create request' }))
      throw new Error(error.detail || 'Failed to create request')
    }
    
    return response.json()
  }

  async searchInfluencers(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.category) queryParams.append('category', params.category)
    if (params.verification_status) queryParams.append('verification_status', params.verification_status)
    if (params.min_trust_score) queryParams.append('min_trust_score', params.min_trust_score)
    
    const response = await apiFetch(`/request/influencer/search?${queryParams}`)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to search influencers' }))
      throw new Error(error.detail || 'Failed to search influencers')
    }
    
    return response.json()
  }
}

export default new CompanyService()
