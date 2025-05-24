import Config from '../../config.js';

class DeepLTranslateProcessor {
    static async process(from, to, text) {
        const response = await fetch(`${Config.TRANSLATION_SERVER_URL}/v2/translate`, {
            method: 'POST',
            headers: {
              'Authorization': `DeepL-Auth-Key ${Config.TRANSLATION_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: Array.isArray(text) ? text : [text],
              target_lang: to.toUpperCase()
            })
        });
      
        const data = await response.json();
        return data.translations[0].text;
    }
}

export default DeepLTranslateProcessor;
