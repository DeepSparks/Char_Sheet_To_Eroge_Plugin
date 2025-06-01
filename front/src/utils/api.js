import RenderedHtmlHelper from '../helpers/rendered-html-helper'

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

  // 리소스 관리 API들
  static async getResourceNames() {
    return await this.request('/getResourceNames', {})
  }

  static async getAllRenderedHTMLs(resourceName) {
    const renderedHTMLs = await this.request('/getAllRenderedHTMLs', { resource_name: resourceName })
    
    let processedRenderedHTMLs = []
    for (const renderedHTML of renderedHTMLs.renderedHTMLs) {
      processedRenderedHTMLs = processedRenderedHTMLs.concat(await RenderedHtmlHelper.preprocessRenderedHTML(renderedHTML))
    }
    
    return {
      resource_name: renderedHTMLs.resource_name,
      renderedHTMLs: processedRenderedHTMLs
    }
  }

  static async getAllImages(resourceName) {
    const images = await this.request('/getAllImages', { resource_name: resourceName })
    images.imageModels.forEach(image => {
      image.saved_file_path = image.saved_file_path + '?timestamp=' + Date.now()
    })
    return images
  }

  static async getAllVoices(resourceName) {
    const voices = await this.request('/getAllVoices', { resource_name: resourceName })
    voices.voiceModels.forEach(voice => {
      voice.saved_file_path = voice.saved_file_path + '?timestamp=' + Date.now()
    })
    return voices
  }

  static async getAllCharacters(resourceName) {
    return await this.request('/getAllCharacters', { resource_name: resourceName })
  }

  static async getAllStyles(resourceName) {
    return await this.request('/getAllStyles', { resource_name: resourceName })
  }

  static async getAllBackgrounds(resourceName) {
    return await this.request('/getAllBackgrounds', { resource_name: resourceName })
  }

  static async removeResources(resourceNames) {
    return await this.request('/removeResources', { resourceNames })
  }

  static async reGenerateImages(resourceName, imageModels) {
    return await this.request('/reGenerateImages', {
      isWaitUntilImagesGenerated: true,
      imageModels: imageModels.map(image => ({
        resource_name: resourceName,
        saved_file_path: image.saved_file_path.split('?')[0]
      }))
    })
  }
} 