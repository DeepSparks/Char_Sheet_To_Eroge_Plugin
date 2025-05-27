import fs from 'fs';

import { GlobalQueueUtil, VoiceQueueUtil } from '../queue_utils/index.js';
import { VoiceModel } from '../models/index.js';
import Config from '../config.js';
import Utils from '../utils.js';

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
        if(!Config.VOICE_GENERATION_SERVER_URL && !Config.VOICE_GENERATION_PROGRAM_PATH) {
            Utils.logToFile('Voice Generation Server url or program path is not set. Please set it in the config.js file.', 'error');
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
            await Utils.wait_file_creation_safely(filePath);
            urls.push(filePath);
        }
        return urls;
    }

    static async checkVoiceCompletions(voiceModels) {
        const completions = [];
        for (const voiceModel of voiceModels) {
            const filePath = (new VoiceModel(voiceModel)).toFilePath();
            completions.push({ filePath: filePath, isCompleted: await Utils.check_file_completion_safely(filePath) });
        }
        return completions;
    }
}

export default VoiceGenerateInterface;