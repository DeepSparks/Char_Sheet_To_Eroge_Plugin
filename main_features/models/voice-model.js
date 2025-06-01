import md5 from 'md5';

import keywordProcessors from '../processors/keyword_processors/index.js';
import Config from '../config.js';

class VoiceModel {
    constructor(req_body) {
        this.resource_name = req_body.resource_name || '_default';
        this.name = req_body.name || '';
        this.text = VoiceModel.sanitizeText(req_body.text) || '';
        this.emotions = req_body.emotions || {};
        this.saved_file_path = req_body.saved_file_path || '';
        keywordProcessors[Config.VOICE_GENERATION_MODE].process(this);
    }
    
    toJsonDict() {
        return {
            resource_name: this.resource_name,
            name: this.name,
            text: this.text,
            emotions: this.emotions,
            saved_file_path: this.saved_file_path
        };
    }

    toPromptString() {
        return Object.values(this.toJsonDict()).filter(attr => attr).join(', ');
    }

    toMD5() {
        return md5(this.toPromptString());
    }

    toDirPath() {
        return `outputs/${this.resource_name}/voices`;
    }

    toFilePath() {
        return this.saved_file_path || `${this.toDirPath()}/${this.toMD5()}.wav`;
    }

    static sanitizeText(text) {
        return [...text.matchAll(new RegExp(`(?:[^\\s\\\\n"]| )+`, 'g'))].map((match)=>match[0].trim()).filter((match)=>match).join(" ");
    }
}

export default VoiceModel;