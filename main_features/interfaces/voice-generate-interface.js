import fs from 'fs';

import { GlobalQueueUtil, VoiceQueueUtil } from '../queue_utils/index.js';
import { VoiceModel } from '../models/index.js';
import Config from '../config.js';

class VoiceGenerateInterface {
    static async generateVoices(voiceModels) {
        const urls = [];
        for (const voiceModel of voiceModels) {
            const url = await this.generateVoice(new VoiceModel(voiceModel));
            urls.push(url);
        }
        return urls;
    }
    
    static async generateVoice(voiceModel) {
        if(!Config.VOICE_GENERATION_SERVER_URL) {
            Utils.logToFile('Voice Generation Server url is not set. Please set it in the config.js file.', 'error');
            return null;
        }

        if(Config.IS_USE_GLOBAL_QUEUE) {
            GlobalQueueUtil.addRequest({
                type: 'voice',
                data: voiceModel
            });
        } else {
            VoiceQueueUtil.addRequest({
                type: 'voice',
                data: voiceModel
            });
        }

        return voiceModel.toFilePath();
    }

    static async waitUntilVoicesGenerated(voiceModels) {
        const urls = [];
        for (const voiceModel of voiceModels) {
            const filePath = (new VoiceModel(voiceModel)).toFilePath();
            while (!fs.existsSync(filePath)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            urls.push(filePath);
        }
        return urls;
    }
}

export default VoiceGenerateInterface;