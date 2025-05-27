import fs from 'fs';

import { TranslateInterface } from '../../interfaces/index.js';
import Utils from '../../utils.js';
import Config from '../../config.js';
import { VoiceModel } from '../../models/index.js';

class VoiceVoxProcessor {
    static async process(voiceModel) {
        const text = VoiceModel.sanitizeText(await TranslateInterface.translateForVoiceScript(voiceModel.text));
        await VoiceVoxProcessor.makeVoice(text, voiceModel.speaker_id, voiceModel.toFilePath());
    }

    static async makeVoice(text, speaker_id, filePath) {
        Utils.logToFile(`Generating voice for ${text} with speaker_id ${speaker_id} to ${filePath}`, 'info');

        const audio_query = await VoiceVoxProcessor.getAudioQuery(text, speaker_id);
        await VoiceVoxProcessor.synthesisAudioQuery(audio_query, speaker_id, filePath);
        
        Utils.logToFile(`Voice generated: ${filePath}`, 'info');
    }
    
    static async getAudioQuery(text, speaker_id) {
        const url = `${Config.VOICE_GENERATION_SERVER_URL}/audio_query?text=${text}&speaker=${speaker_id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    }
    
    static async synthesisAudioQuery(audio_query, speaker_id, filePath) {
        const url = `${Config.VOICE_GENERATION_SERVER_URL}/synthesis?speaker=${speaker_id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(audio_query)
        });
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
    }
}

export default VoiceVoxProcessor;