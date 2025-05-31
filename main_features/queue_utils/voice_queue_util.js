import fs from 'fs';

import Utils from '../utils.js';
import { voiceProcessors } from '../processors/index.js';
import Config from '../config.js';
import BaseQueueUtil from './base_queue_util.js';
import { VoiceMemoryInterface } from '../interfaces/index.js';

class VoiceQueueUtil extends BaseQueueUtil {
    static requestQueue = []
    static alreadyWorkIds = new Set();

    static async processRequest(request) {
        Utils.logToFile(`Processing request by voice queue util, request: ${JSON.stringify(request)}`, 'info');
        if (request.type === 'voice') {
            await this.process_voice_request(request.data);
        }
    }

    static async process_voice_request(voiceModel) {
        if(fs.existsSync(voiceModel.toFilePath()))
            return;
    
        await voiceProcessors[Config.VOICE_GENERATION_MODE].process(voiceModel);

        voiceModel.saved_file_path = voiceModel.toFilePath();
        VoiceMemoryInterface.addVoice(voiceModel, voiceModel.resource_name);
    }
}

export default VoiceQueueUtil;
