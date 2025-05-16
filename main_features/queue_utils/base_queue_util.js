import Utils from '../utils.js';
import Config from '../config.js';

class BaseQueueUtil {
    static async processRequestQueue() {
        if (this.requestQueue === undefined) {
            // 하위 클래스에서 정의되지 않은 경우 오류 발생
            throw new Error('requestQueue must be defined in subclass');
        }

        if (this.requestQueue.length === 0) {
            setTimeout(async () => {
                await this.processRequestQueue()
            }, 1000)
            return;
        }
    

        const request = this.requestQueue.shift();

        try {
            await this.processRequest(request);
        } catch (error) {
            Utils.logToFile(`${request.type} generation error: ${error.message || 'Unknown error'}, ${error.stack || ''}`, 'error');
            Utils.logToFile(`Retrying ${request.type} generation in ${Config.RETRY_INTERVAL_SECONDS} seconds...`, 'info');
            
            this.requestQueue.splice(0, 0, request);
            setTimeout(async () => {
                await this.processRequestQueue()
            }, Config.RETRY_INTERVAL_SECONDS * 1000);
            return;
        }

        
        setTimeout(async () => {
            await this.processRequestQueue()
        }, Config.NEXT_QUEUE_WAITING_SECONDS * 1000);
    }

    static async processRequest(request) {
        // 하위 클래스에서 구현해야 하는 메서드
        throw new Error('processRequest method must be implemented by subclass');
    }

    static addRequest(request) {
        if (this.requestQueue === undefined) {
            // 하위 클래스에서 정의되지 않은 경우 오류 발생
            throw new Error('requestQueue must be defined in subclass');
        }

        if(this.alreadyWorkIds.has(request.data.toMD5()))
            return;
        this.alreadyWorkIds.add(request.data.toMD5());
        
        this.requestQueue.push(request);
    }
}

export default BaseQueueUtil;
