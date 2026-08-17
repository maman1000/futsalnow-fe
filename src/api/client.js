import axios from 'axios'

// Axios instance dengan base URL dari env (fallback ke Laravel lokal)
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// Sisipkan Bearer token dari localStorage pada setiap request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
