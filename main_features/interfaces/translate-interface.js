import fs from 'fs';
import md5 from 'md5';

import Config from '../config.js';
import { translateProcessors } from '../processors/index.js';

class TranslateInterface {
    static async translateTexts(from, to, texts) {
        return Promise.all(texts.map(async text => await this.translateText(from, to, text)));
    }

    static async translateText(from, to, text) {
        const cache = TranslateScriptCache.getCache(from, to, text);
        if(cache) {
            return cache;
        }

        const result = await translateProcessors[Config.TRANSLATION_MODE].process(from, to, text);
        TranslateScriptCache.setCache(from, to, text, result);
        return result;
    }

    static async translateForVoiceScript(text) {
        if(Config.IS_TRANSLATE_VOICE_SCRIPT) {
            return await TranslateInterface.translateText(
                Config.TRANSLATE_VOICE_SCRIPT_FROM, 
                Config.TRANSLATE_VOICE_SCRIPT_TO, 
                text
            );
        }
        return text;
    }
}

class TranslateScriptCache {
    static getCache(from, to, text) {
        const cache = JSON.parse(fs.readFileSync(this._getCacheFilePath(), 'utf8'));
        if(cache[this._getKeyCode(from, to, text)]) {
            return cache[this._getKeyCode(from, to, text)];
        }
        return null;
    }

    static setCache(from, to, text, result) {
        const cache = JSON.parse(fs.readFileSync(this._getCacheFilePath(), 'utf8'));
        cache[this._getKeyCode(from, to, text)] = result;
        fs.writeFileSync(this._getCacheFilePath(), JSON.stringify(cache, null, 2));
    }

    static _getCacheFilePath() {
        const cacheFilePath = "outputs/memories/translate_script_memory.json";
        if(!fs.existsSync(cacheFilePath)) {
            fs.writeFileSync(cacheFilePath, JSON.stringify({}, null, 2));
        }
        
        return cacheFilePath;
    }

    static _getKeyCode(from, to, text) {
        return md5(`${from}-${to}-${text}`);
    }
}

export default TranslateInterface;