const API_BASE_URL = 'http://127.0.0.1:3000'

export class ApiService {
  static async request(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      return result
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  static async getConfigInfo() {
    return await this.request('/getConfigInfo', {})
  }

  static async setConfig(config) {
    return await this.request('/setConfig', { config })
  }
} 