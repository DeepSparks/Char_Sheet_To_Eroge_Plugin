import fs from 'fs';
import md5 from 'md5';

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

export default TranslateScriptCache;
