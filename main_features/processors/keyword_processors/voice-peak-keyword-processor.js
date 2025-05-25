import fs from 'fs';

import Utils from '../../utils.js';

const POSSIBLE_SPEAKER_IDS = ["Asumi Shuo"];

class VoicePeakKeywordProcessor {
    static process(voiceModel) {
        voiceModel.speaker_id = VoicePeakKeywordProcessor.getSpeakerId(voiceModel.name);
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

        nameMap[name] = Utils.get_unique_id(POSSIBLE_SPEAKER_IDS, Object.values(nameMap));
        fs.writeFileSync(filePath, JSON.stringify(nameMap, null, 2));
        return nameMap[name];
    }
}

export default VoicePeakKeywordProcessor;
