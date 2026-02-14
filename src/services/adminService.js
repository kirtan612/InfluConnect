import { apiFetch } from '../utils/api'

class AdminService {
  async getStats() {
    const response = await apiFetch('/admin/stats')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch stats' }))
      throw new Error(error.detail || 'Failed to fetch stats')
    }
    
    return response.json()
  }

  async getInfluencers(params = {}) {
    const queryParams = new URLSearchParams()
    if (params.include_suspended !== undefined) queryParams.append('include_suspended', params.include_suspended)

    const response = await apiFetch(`/admin/influencers?${queryParams}`)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch influencers' }))
      throw new Error(error.detail || 'Failed to fetch influencers')
    }
    
    return response.json()
  }

  async verifyInfluencer(userId, status, reason) {
    const response = await apiFetch(`/admin/verify/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, reason })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to verify influencer' }))
      throw new Error(error.detail || 'Failed to verify influencer')
    }
    
    return response.json()
  }

  async suspendUser(userId, isSuspended, reason) {
    const response = await apiFetch(`/admin/suspend/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_suspended: isSuspended, reason })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to suspend user' }))
      throw new Error(error.detail || 'Failed to suspend user')
    }
    
    return response.json()
  }

  async getReports() {
    const response = await apiFetch('/admin/reports')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch reports' }))
      throw new Error(error.detail || 'Failed to fetch reports')
    }
    
    return response.json()
  }

  async reviewReport(reportId, status, adminNotes) {
    const response = await apiFetch(`/admin/reports/${reportId}/review?status=${status}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ admin_notes: adminNotes })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to review report' }))
      throw new Error(error.detail || 'Failed to review report')
    }
    
    return response.json()
  }

  async triggerAutomation(task) {
    const response = await apiFetch(`/admin/automation/${task}`, {
      method: 'POST'
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to trigger automation' }))
      throw new Error(error.detail || 'Failed to trigger automation')
    }
    
    return response.json()
  }

  async getBrands() {
    const response = await apiFetch('/admin/brands')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch brands' }))
      throw new Error(error.detail || 'Failed to fetch brands')
    }
    
    return response.json()
  }

  async getCampaigns() {
    const response = await apiFetch('/admin/campaigns')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch campaigns' }))
      throw new Error(error.detail || 'Failed to fetch campaigns')
    }
    
    return response.json()
  }

  async getVerifications() {
    const response = await apiFetch('/admin/verifications')
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch verifications' }))
      throw new Error(error.detail || 'Failed to fetch verifications')
    }
    
    return response.json()
  }

  async approveVerification(verificationId, reason = '') {
    const response = await apiFetch(`/admin/verifications/${verificationId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to approve verification' }))
      throw new Error(error.detail || 'Failed to approve verification')
    }
    
    return response.json()
  }

  async rejectVerification(verificationId, reason = '') {
    const response = await apiFetch(`/admin/verifications/${verificationId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to reject verification' }))
      throw new Error(error.detail || 'Failed to reject verification')
    }
    
    return response.json()
  }
}

export default new AdminService()
