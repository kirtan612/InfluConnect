const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  try {
    let response = await fetch(`${API_BASE_URL}${url}`, config)

    // Handle 401 - Token expired
    if (response.status === 401 && !options._retry) {
      if (isRefreshing) {
        // Wait for token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          config.headers['Authorization'] = `Bearer ${token}`
          return fetch(`${API_BASE_URL}${url}`, config)
        })
      }

      options._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        // No refresh token, logout
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/signin'
        return
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken })
        })

        if (!refreshResponse.ok) {
          throw new Error('Refresh failed')
        }

        const data = await refreshResponse.json()
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        
        processQueue(null, data.access_token)
        isRefreshing = false

        // Retry original request
        config.headers['Authorization'] = `Bearer ${data.access_token}`
        response = await fetch(`${API_BASE_URL}${url}`, config)
      } catch (error) {
        processQueue(error, null)
        isRefreshing = false
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/signin'
        throw error
      }
    }

    return response
  } catch (error) {
    throw error
  }
}

export { API_BASE_URL }
