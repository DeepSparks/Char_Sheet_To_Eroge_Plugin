import { exec } from 'child_process';

import { TranslateInterface } from '../../interfaces/index.js';
import Config from '../../config.js';

class VoicePeakProcessor {
    static async process(voiceModel) {
        const text = await TranslateInterface.translateForVoiceScript(voiceModel.text);
        await VoicePeakProcessor.makeVoice(text, voiceModel.speaker_id, voiceModel.emotions, voiceModel.toFilePath());
    }

    static async makeVoice(text, narrator, emotions, outputPath) {
        const emotionString = Object.entries(emotions)
            .map(([emotion, value]) => `${emotion}=${value}`)
            .join(',');
    
        const command = `"${Config.VOICE_GENERATION_PROGRAM_PATH}" --say "${text}" --narrator "${narrator}" --emotion ${emotionString} --out "${outputPath}"`;
    
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Voicepeak 실행 오류: ${error.message}`));
                    return;
                }
                if (stderr) {
                    reject(new Error(`Voicepeak 경고: ${stderr}`));
                }
                resolve(outputPath);
            });
        });
    }
}

export default VoicePeakProcessor;