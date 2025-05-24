import Config from '../config.js';
import { translateProcessors } from '../processors/index.js';
import { TranslateScriptCache } from '../caches/index.js';
import Utils from '../utils.js';

class TranslateWaitQueueUtil {
    static requestQueue = [];
    static isProcessing = false;
    static maxConcurrentRequests = 1;

    static async addToQueue(from, to, text, leftRetryCount = 3) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                from,
                to,
                text,
                leftRetryCount,
                resolve,
                reject
            });

            if (!this.isProcessing) {
                this.processRequestQueue();
            }
        });
    }

    static async processRequestQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            
            try {
                const cache = TranslateScriptCache.getCache(request.from, request.to, request.text);
                if(cache) {
                    request.resolve(cache);
                    continue;
                }

                const result = await translateProcessors[Config.TRANSLATION_MODE].process(
                    request.from, 
                    request.to, 
                    request.text
                );
                
                request.resolve(result);
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                Utils.logErrorToFile(error);
                
                if (request.leftRetryCount > 0) {
                    this.requestQueue.push({
                        ...request,
                        leftRetryCount: request.leftRetryCount - 1
                    });
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    request.reject(error);
                }
            }
        }

        this.isProcessing = false;
    }
}

export default TranslateWaitQueueUtil; 