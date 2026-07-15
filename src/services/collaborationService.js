import { apiFetch } from '../utils/api'

const collaborationService = {
  // Get all collaborations for current user
  getCollaborations: async () => {
    const response = await apiFetch('/collaboration')
    return response.json()
  },

  // Get specific collaboration details
  getCollaboration: async (id) => {
    const response = await apiFetch(`/collaboration/${id}`)
    return response.json()
  },

  // Brand: Set deliverables
  setDeliverables: async (id, data) => {
    const response = await apiFetch(`/collaboration/${id}/deliverables`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Influencer: Submit content
  submitContent: async (id, data) => {
    const response = await apiFetch(`/collaboration/${id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Brand: Approve content
  approveContent: async (id, data) => {
    const response = await apiFetch(`/collaboration/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Brand: Complete collaboration
  completeCollaboration: async (id, data) => {
    const response = await apiFetch(`/collaboration/${id}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

export default collaborationService
