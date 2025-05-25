import fs from 'fs';

import Utils from '../../utils.js';
import Config from '../../config.js';

class VoicePeakKeywordProcessor {
    static process(voiceModel) {
        voiceModel.speaker_id = VoicePeakKeywordProcessor.getSpeakerId(voiceModel.name);

        let createdEmotions = {};
        const keywordJoin = Config.VOICEPEAK_KEYWORD_JOIN;
        if(keywordJoin[voiceModel.speaker_id]) {
            for(const [emotion, value] of Object.entries(voiceModel.emotions)) {
                createdEmotions[keywordJoin[voiceModel.speaker_id][emotion]] = value;
            }
        }
        voiceModel.emotions = createdEmotions;
    }

    static getSpeakerId(name) {
        const filePath = 'outputs/memories/voice_peak_speaker_id_map.json'
        
        let nameMap = {};
        if (fs.existsSync(filePath)) {
            try {
                nameMap = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (error) {
                Utils.logToFile('Mapping file read error. New mapping file will be created. : ' + error, 'error');
            }
        }
        
        if (nameMap[name] !== undefined) {
            return nameMap[name];
        }

        nameMap[name] = Utils.get_unique_id(Config.VOICEPEAK_SPEAKER_IDS, Object.values(nameMap));
        fs.writeFileSync(filePath, JSON.stringify(nameMap, null, 2));
        return nameMap[name];
    }
}

export default VoicePeakKeywordProcessor;
