import md5 from 'md5';

import {CharacterMemoryInterface, StyleMemoryInterface} from '../interfaces/index.js';
import keywordProcessors from '../processors/keyword_processors/index.js';
import Config from '../config.js';

class ImageModel {
    constructor(req_body) {
        this.name = req_body.name || '';
        this.style_id = req_body.style_id || '';
        this.common_prompt = req_body.common_prompt || '';
        this.common_negative_prompt = req_body.common_negative_prompt || '';
        this.character_prompt = req_body.character_prompt || '';

        if(Config.ADD_DEFAULT_NSFW_KEYWORD) {
            this.common_negative_prompt = this.common_negative_prompt.replace("nsfw", "").replace("explicit", "");
            if(!this.common_prompt.includes("open clothes"))
                this.common_prompt = 'open clothes, ' + this.common_prompt;
            if(!this.common_prompt.includes("explicit"))
                this.common_prompt = 'explicit, ' + this.common_prompt;
            if(!this.common_prompt.includes("nsfw"))
                this.common_prompt = 'nsfw, ' + this.common_prompt;
        }

        const characterInfo = CharacterMemoryInterface.getCharacter({name: this.name});
        const styleInfo = StyleMemoryInterface.getStyle({style_id: this.style_id});
        this.concat_character_prompt = [characterInfo.toPrompt(), styleInfo.toPrompt(), this.character_prompt].filter(attr => attr).join(', ');
        
        this.gender = characterInfo.gender;
        if(this.gender == 'girl')
            this.person_prompt = "1girl, solo";
        else if(this.gender == 'boy')
            this.person_prompt = "1boy, solo";

        keywordProcessors[Config.IMAGE_KEYWORD_MODE].process(this)
    }
    
    toJsonDict() {
        return {...this};
    }

    toPromptString() {
        return Object.values(this.toJsonDict()).filter(attr => attr).join(', ');
    }

    toMD5() {
        return md5(this.toPromptString());
    }

    toFilePath() {
        return `outputs/images/${this.toMD5()}.png`;
    }
}

export default ImageModel;