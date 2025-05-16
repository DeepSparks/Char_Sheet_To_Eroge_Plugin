import fs from 'fs';

import Utils from '../../utils.js';

const POSSIBLE_SPEAKER_IDS = [4, 5, 8, 10, 14, 23, 43, 46, 54, 58, 68];

class VoiceVoxKeywordProcessor {
    static process(voiceModel) {
        voiceModel.speaker_id = VoiceVoxKeywordProcessor.getSpeakerId(voiceModel.name);
    }

    static getSpeakerId(name) {
        const filePath = 'outputs/memories/voice_vox_speaker_id_map.json'
        
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

        nameMap[name] = Utils.get_unique_id(POSSIBLE_SPEAKER_IDS, Object.values(nameMap));
        fs.writeFileSync(filePath, JSON.stringify(nameMap, null, 2));
        return nameMap[name];
    }
}

export default VoiceVoxKeywordProcessor;
