import md5 from 'md5';

import {CharacterMemoryInterface, StyleMemoryInterface, BackgroundMemoryInterface, TranslateInterface} from '../interfaces/index.js';
import keywordProcessors from '../processors/keyword_processors/index.js';
import Config from '../config.js';

class ImageModel {
    constructor(req_body) {
        this.name = req_body.name || '';
        this.style_id = req_body.style_id || '';
        this.background_id = req_body.background_id || '';

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
            if(!this.common_prompt.includes("uncensored"))
                this.common_prompt = 'uncensored, ' + this.common_prompt;
        }

        const backgroundInfo = BackgroundMemoryInterface.getBackground({background_id: this.background_id});
        if(backgroundInfo) {
            this.common_prompt = this.common_prompt + ", " + backgroundInfo.toPrompt();
        }

        if(Config.ADDITIONAL_COMMON_PROMPT)
            this.common_prompt =  this.common_prompt + ", " + Config.ADDITIONAL_COMMON_PROMPT;
        if(Config.ADDITIONAL_COMMON_NEGATIVE_PROMPT)
            this.common_negative_prompt = this.common_negative_prompt + ", " + Config.ADDITIONAL_COMMON_NEGATIVE_PROMPT;
        if(Config.ADDITIONAL_CHARACTER_PROMPT)
            this.character_prompt = this.character_prompt + ", " + Config.ADDITIONAL_CHARACTER_PROMPT;


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

    static async translateReqBody(reqBody) {
        for (let key of ['common_prompt', 'common_negative_prompt', 'character_prompt']) {
            let translatedParts = [];
            for(let part of reqBody[key].split(',')) {
                if(/[^\x00-\x7F]/.test(part)) {
                    translatedParts.push((await TranslateInterface.translateText('auto', 'en', part.trim())).trim());
                } else {
                    translatedParts.push(part.trim());
                }
            }
            reqBody[key] = translatedParts.join(', ').toLowerCase();
        }
    }

    toJsonDict() {
        return {
            name: this.name,
            style_id: this.style_id,
            common_prompt: this.common_prompt,
            common_negative_prompt: this.common_negative_prompt,
            character_prompt: this.character_prompt
        };
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