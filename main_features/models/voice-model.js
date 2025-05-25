import md5 from 'md5';

import keywordProcessors from '../processors/keyword_processors/index.js';
import Config from '../config.js';

class VoiceModel {
    constructor(req_body) {
        this.name = req_body.name || '';
        this.text = req_body.text || '';
        this.emotions = req_body.emotions || {};

        keywordProcessors[Config.VOICE_KEYWORD_MODE].process(this);
    }
    
    toJsonDict() {
        return { ...this };
    }

    toPromptString() {
        return Object.values(this.toJsonDict()).filter(attr => attr).join(', ');
    }

    toMD5() {
        return md5(this.toPromptString());
    }

    toFilePath() {
        return `outputs/voices/${this.toMD5()}.wav`;
    }
}

export default VoiceModel;