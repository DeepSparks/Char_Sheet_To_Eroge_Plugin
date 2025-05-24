import { TranslateWaitQueueUtil } from '../queue_utils/index.js';
import { TranslateScriptCache } from '../caches/index.js';
import Config from '../config.js';
import Utils from '../utils.js';

class TranslateInterface {
    static async translateTexts(from, to, texts) {
        const results = [];
        for (const text of texts) {
            const result = await this.translateText(from, to, text);
            results.push(result);
        }
        return results;
    }

    static async translateText(from, to, text, leftRetryCount = 3) {
        try {
            const cache = TranslateScriptCache.getCache(from, to, text);
            if(cache) {
                return cache;
            }

            const result = await TranslateWaitQueueUtil.addToQueue(from, to, text, leftRetryCount);
            
            TranslateScriptCache.setCache(from, to, text, result);
            return result;

        } catch (error) {
            Utils.logErrorToFile(error);
            throw error;
        }
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

export default TranslateInterface;