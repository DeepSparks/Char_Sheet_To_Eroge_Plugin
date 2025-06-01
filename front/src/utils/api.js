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

    let results = []
    let sceneIndex = 1
    for (const sceneTagMatch of sceneTagMatches) {
      const sceneTag = sceneTagMatch[0]
      const sceneContent = sceneTagMatch[1]

      const audioTagMatches = [...sceneTag.matchAll(new RegExp(`<span class="audio-container"\\s*[^>]+>[\\s\\S]+?<\/span>`, 'g'))];
      const audioTags = audioTagMatches.map(match => match[0]);
      
      let sceneHTML = sceneTag
      let contentHTML = sceneContent
      for (const audioTag of audioTags) {
        sceneHTML = sceneHTML.replace(audioTag, "")
        contentHTML = contentHTML.replace(audioTag, "")
      }

      sceneHTML = sceneHTML.replace(`class="image-container"`, `class="image-container-in-progress"`)
      sceneHTML = sceneHTML.replace(new RegExp(`Time_period:\\s*(.*)\nLocation:\\s*(.*)`), ` <div class="wrapper"> ✦ $1 <br> ✦ $2</div><br>`)
      sceneHTML = sceneHTML.replace(new RegExp(`## Select Next Possible Event Options\\n1\\.\\s*(.*)\\n2\\.\\s*(.*)\\n3\\.\\s*(.*)`), `<div class="wrapper">[1] $1 <br>[2] $2 <br>[3] $3</div>`)
      
      const contentSentences = contentHTML.split("\n").filter(sentence => sentence.trim() !== "")
      for (const sentence of contentSentences) {
        let processedSentence = sentence
        if(processedSentence.includes(`"`)) {
          processedSentence = processedSentence.replace(new RegExp(`"([^"]*)"`, 'g'), `<span class="chat-mark-1">$1</span>`)
        }
        if(processedSentence.includes(`'`)) {
          processedSentence = processedSentence.replace(new RegExp(`'([^']*)'`, 'g'), `<span class="chat-mark-2">$1</span>`)
        }

        sceneHTML = sceneHTML.replace(sentence, `<span class="chat">${processedSentence}</span><br><br>`)
      }

      const result = {
        renderedHTML: sceneHTML + styleTags.join("\n") + `
<style>
.image-container-in-progress{
  width: 1216px;
}

.chat {
  color: white;
  font-weight: bolder;
  font-size: 30px;
  line-height: 1.2em;
  text-shadow: -2px 0px black, 0px 2px black, 2px 0px black, 0px -2px black;
}

.chat-mark-1 {
  color: skyblue;
}

.chat-mark-2 {
  color: orange;
}
</style>
<style> .wrapper { font-weight: bolder; font-size: 30px; text-shadow: -2px 0px black, 0px 2px black, 2px 0px black, 0px -2px black; line-height: 1.2em; max-width: 100vw; color: #e6ddca; padding: 1em 0 1em 0; border-top: 1px solid ; border-bottom: 1px solid ; border-color: rgba(255, 255, 255, 0.5);} </style>
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