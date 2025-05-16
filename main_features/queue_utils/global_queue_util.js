import fs from 'fs';

import Utils from '../utils.js';
import { imageProcessors, voiceProcessors } from '../processors/index.js';
import Config from '../config.js';
import BaseQueueUtil from './base_queue_util.js';

class GlobalQueueUtil extends BaseQueueUtil {
    static requestQueue = []
    static alreadyWorkIds = new Set();
    
    static async processRequest(request) {
        Utils.logToFile(`Processing request by global queue util, request: ${JSON.stringify(request)}`, 'info');
        switch(request.type) {
            case 'image':
                await this.process_image_request(request.data);
                break;
            case 'voice':
                await this.process_voice_request(request.data);
                break;
        }
    }

    static async process_image_request(imageModel) {
        if(!Utils.is_image_waiting(imageModel.toFilePath()))
            return;
    
        await imageProcessors[Config.IMAGE_GENERATION_MODE].process(imageModel);
    }

    static async process_voice_request(voiceModel) {
        if(fs.existsSync(voiceModel.toFilePath()))
            return;
    
        await voiceProcessors[Config.VOICE_GENERATION_MODE].process(voiceModel);
    }
}

export default GlobalQueueUtil;
