import axios from 'axios'

export function getApiClient() {
  const baseURL = process.env.HINDSIGHT_API_URL || 'http://localhost:9077'
  const apiKey = process.env.HINDSIGHT_API_KEY

  if (!apiKey) {
    throw new Error('HINDSIGHT_API_KEY environment variable is required')
  }

  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  })
}
