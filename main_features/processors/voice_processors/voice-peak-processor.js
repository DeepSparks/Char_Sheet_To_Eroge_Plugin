import { exec } from 'child_process';

import { TranslateInterface } from '../../interfaces/index.js';
import Config from '../../config.js';
import { VoiceModel } from '../../models/index.js';
import Utils from '../../utils.js';

const TEXT_LIMIT = 139;
const SPLIT_CHARS = ["。","！","？","、"];

class VoicePeakProcessor {
    static async process(voiceModel) {
        const translatedText = await TranslateInterface.translateForVoiceScript(voiceModel.text);

        let targetText = VoiceModel.sanitizeText(translatedText);
        if(targetText.length > TEXT_LIMIT) {
            targetText = VoicePeakProcessor.cutSpeak(targetText, TEXT_LIMIT, SPLIT_CHARS);
            Utils.logToFile(`주어진 음성 문장이 너무 길어서 자르기 처리됨: ${translatedText} -> ${targetText}`);
        }
        
        await VoicePeakProcessor.makeVoice(targetText, voiceModel.speaker_id, voiceModel.emotions, voiceModel.toFilePath());
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

    static cutSpeak(speak, cutLength=TEXT_LIMIT, splitChars=SPLIT_CHARS) {
        // 수단 1: 불필요한 공백이나 특수 문자를 제거
        speak = speak.replace(/[\s♥～. ]/g, '');
        if(speak.length <= cutLength) {
            return speak;
        }
    
        // 수단 2: 문장 분리
        let splitCharsIndexes = [];
        for(let i = 0; i < speak.length; i++) {
            if(splitChars.includes(speak[i])) {
                splitCharsIndexes.push(i);
            }
        }
        splitCharsIndexes.sort((a, b) => b - a);
        for(let i = 0; i < splitCharsIndexes.length; i++) {
            const sentence = speak.slice(0, splitCharsIndexes[i]+1);
            if(sentence.length <= cutLength) {
                return sentence;
            }
        }
    
        // 수단 3: 강제로 자르기
        return speak.slice(0, cutLength);
    }
}

export default VoicePeakProcessor;