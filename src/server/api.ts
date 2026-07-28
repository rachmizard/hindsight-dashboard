import axios from 'axios'

const api = axios.create({
  baseURL: process.env.HINDSIGHT_API_URL || 'http://localhost:8080',
  headers: {
    'X-API-Key': process.env.HINDSIGHT_API_KEY || '',
    'Content-Type': 'application/json',
  },
})

export default api
