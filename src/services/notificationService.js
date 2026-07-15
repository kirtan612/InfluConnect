import { apiFetch } from '../utils/api'

const notificationService = {
  // Get all notifications
  getNotifications: async (skip = 0, limit = 50) => {
    const response = await apiFetch(`/notifications?skip=${skip}&limit=${limit}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch notifications')
    }
    return response.json()
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await apiFetch('/notifications/unread-count')
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to fetch unread count')
    }
    return response.json()
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await apiFetch(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to mark notification as read')
    }
    return response.json()
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await apiFetch('/notifications/mark-all-read', {
      method: 'PUT'
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to mark all as read')
    }
    return response.json()
  }
}

export default notificationService
