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
      processedRenderedHTMLs = processedRenderedHTMLs.concat(await this._preprocessRenderedHTML(renderedHTML))
    }
    
    return {
      resource_name: renderedHTMLs.resource_name,
      renderedHTMLs: processedRenderedHTMLs
    }
  }

  static _preprocessRenderedHTML(renderedHTML) {
    const styleTagMatches = [...renderedHTML.renderedHTML.matchAll(new RegExp(`<style>[^<]+<\/style>`, 'g'))];
    const styleTags = styleTagMatches.map(match => match[0]);

    const sceneTagMatches = [...renderedHTML.renderedHTML.matchAll(new RegExp(`<div class="root-container"\\s*[^>]+>[\\s\\S]+?<div class="content-container">([\\s\\S]+?)<\/div><\/div><\/div>`, 'g'))];
    const sceneTags = sceneTagMatches.map(match => match[0]);
    
    let results = []
    let sceneIndex = 1
    for (const sceneTag of sceneTags) {
      const audioTagMatches = [...sceneTag.matchAll(new RegExp(`<span class="audio-container"\\s*[^>]+>[\\s\\S]+?<\/span>`, 'g'))];
      const audioTags = audioTagMatches.map(match => match[0]);
      
      let sceneHTML = sceneTag
      for (const audioTag of audioTags) {
        sceneHTML = sceneHTML.replace(audioTag, "")
      }

      sceneHTML = sceneHTML.replace(`class="image-container"`, `class="image-container-in-progress"`)
      const result = {
        renderedHTML: sceneHTML + styleTags.join("\n") + `
<style>
.image-container-in-progress{
  width: 1216px;
}
</style>
`,
        sequence_id: renderedHTML.sequence_id + "-" + String(sceneIndex),
      }

      results.push(result)
      sceneIndex++
    }


    return results
  }

  static async getAllImages(resourceName) {
    return await this.request('/getAllImages', { resource_name: resourceName })
  }

  static async getAllVoices(resourceName) {
    return await this.request('/getAllVoices', { resource_name: resourceName })
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
} 