import { apiFetch } from '../utils/api'

class InfluencerService {
  async getProfile() {
    const response = await apiFetch('/influencer/profile')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch profile' }))
      throw new Error(error.detail || 'Failed to fetch profile')
    }
    
    return response.json()
  }

  async updateProfile(data) {
    const response = await apiFetch('/influencer/profile', {
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

  async submitVerification(metricsSnapshot) {
    const response = await apiFetch('/influencer/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ metrics_snapshot: metricsSnapshot })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to submit verification' }))
      throw new Error(error.detail || 'Failed to submit verification')
    }
    
    return response.json()
  }

  async getVerificationStatus() {
    const response = await apiFetch('/influencer/verification-status')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch verification status' }))
      throw new Error(error.detail || 'Failed to fetch verification status')
    }
    
    return response.json()
  }

  async getTrustExplanation() {
    const response = await apiFetch('/influencer/trust-explanation')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch trust explanation' }))
      throw new Error(error.detail || 'Failed to fetch trust explanation')
    }
    
    return response.json()
  }

  async getRequests() {
    const response = await apiFetch('/influencer/requests')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch requests' }))
      throw new Error(error.detail || 'Failed to fetch requests')
    }
    
    return response.json()
  }

  async updateRequestStatus(requestId, status) {
    const response = await apiFetch(`/request/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update request' }))
      throw new Error(error.detail || 'Failed to update request')
    }
    
    return response.json()
  }

  // ===================== ACHIEVEMENTS =====================

  async getAchievements() {
    const response = await apiFetch('/influencer/achievements')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch achievements' }))
      throw new Error(error.detail || 'Failed to fetch achievements')
    }
    
    return response.json()
  }

  async addAchievement(data) {
    const response = await apiFetch('/influencer/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to add achievement' }))
      throw new Error(error.detail || 'Failed to add achievement')
    }
    
    return response.json()
  }

  async deleteAchievement(achievementId) {
    const response = await apiFetch(`/influencer/achievements/${achievementId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to delete achievement' }))
      throw new Error(error.detail || 'Failed to delete achievement')
    }
    
    return response.json()
  }

  // ===================== IMAGE UPLOAD =====================

  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiFetch('/upload/image', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to upload image' }))
      throw new Error(error.detail || 'Failed to upload image')
    }
    
    return response.json()
  }

  // ===================== CAMPAIGNS =====================

  async exploreCampaigns(category = null) {
    const url = category ? `/campaign/explore?category=${encodeURIComponent(category)}` : '/campaign/explore'
    const response = await apiFetch(url)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch campaigns' }))
      throw new Error(error.detail || 'Failed to fetch campaigns')
    }
    
    return response.json()
  }

  async applyToCampaign(campaignId, influencerId) {
    const response = await apiFetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        campaign_id: campaignId, 
        influencer_id: influencerId 
      })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to apply to campaign' }))
      throw new Error(error.detail || 'Failed to apply to campaign')
    }
    
    return response.json()
  }
}

export default new InfluencerService()
