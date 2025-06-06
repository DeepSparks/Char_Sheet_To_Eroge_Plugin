import md5 from 'md5';

import {CharacterMemoryInterface, StyleMemoryInterface, BackgroundMemoryInterface, TranslateInterface} from '../interfaces/index.js';
import keywordProcessors from '../processors/keyword_processors/index.js';
import Config from '../config.js';

class ImageModel {
    constructor(req_body) {
        this.resource_name = req_body.resource_name || '_default';
        this.name = req_body.name || '';
        this.style_id = req_body.style_id || '';
        this.background_id = req_body.background_id || '';
        this.saved_file_path = req_body.saved_file_path || '';

        this.common_prompt = req_body.common_prompt || '';
        this.common_negative_prompt = req_body.common_negative_prompt || '';
        this.character_prompt = req_body.character_prompt || '';


        if(Config.ADD_DEFAULT_NSFW_KEYWORD) {
            this.common_negative_prompt = this.common_negative_prompt.replace("nsfw", "").replace("explicit", "");
            for(let keyword of Config.DEFAULT_NSFW_KEYWORDS) {
                if(!this.common_prompt.includes(keyword)) {
                    this.common_prompt = keyword + ", " + this.common_prompt;
                }
            }
        }

        const backgroundInfo = BackgroundMemoryInterface.getBackground({background_id: this.background_id}, this.resource_name);
        if(backgroundInfo) {
            this.common_prompt = this.common_prompt + ", " + backgroundInfo.toPrompt();
        }

        if(Config.ADDITIONAL_COMMON_PROMPT)
            this.common_prompt =  this.common_prompt + ", " + Config.ADDITIONAL_COMMON_PROMPT;
        if(Config.ADDITIONAL_COMMON_NEGATIVE_PROMPT)
            this.common_negative_prompt = this.common_negative_prompt + ", " + Config.ADDITIONAL_COMMON_NEGATIVE_PROMPT;
        if(Config.ADDITIONAL_CHARACTER_PROMPT)
            this.character_prompt = this.character_prompt + ", " + Config.ADDITIONAL_CHARACTER_PROMPT;


        const characterInfo = CharacterMemoryInterface.getCharacter({name: this.name}, this.resource_name);
        const styleInfo = StyleMemoryInterface.getStyle({style_id: this.style_id}, this.resource_name);

        let style_info_prompt = styleInfo.toPrompt();
        if(!this.common_prompt.includes("nsfw")) {
            let none_nsfw_keywords = []
            for(let keyword of style_info_prompt.split(',')) {
                if(!keyword.includes("bra") && !keyword.includes("panties")) {
                    none_nsfw_keywords.push(keyword.trim());
                }
            }
            style_info_prompt = none_nsfw_keywords.join(', ');
        }
        this.concat_character_prompt = [characterInfo.toPrompt(), style_info_prompt, this.character_prompt].filter(attr => attr).join(', ');
        
        this.gender = characterInfo.gender;
        if(this.gender == 'girl')
            this.person_prompt = "1girl, solo";
        else if(this.gender == 'boy')
            this.person_prompt = "1boy, solo";

        ImageModel.removeDuplicatedAttributes(this);
        keywordProcessors[Config.IMAGE_GENERATION_MODE].process(this)

        for(let [key, value] of Object.entries(Config.TAG_VALUE_OVERRIDE_MAP)) {
            if(this[key]) this[key] = value;
        }
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

    static removeDuplicatedAttributes(reqBody) {
        for(let key of ['common_prompt', 'common_negative_prompt', 'character_prompt']) {
            let keywordSet = new Set();
            for(let part of reqBody[key].split(',')) {
                keywordSet.add(part.trim());
            }
            reqBody[key] = Array.from(keywordSet).join(', ');
        }
    }

    toJsonDict() {
        return {
            resource_name: this.resource_name,
            name: this.name,
            style_id: this.style_id,
            background_id: this.background_id,
            common_prompt: this.common_prompt,
            common_negative_prompt: this.common_negative_prompt,
            character_prompt: this.character_prompt,
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
        return `outputs/${this.resource_name}/images`;
    }

    toFilePath() {
        return this.saved_file_path || `${this.toDirPath()}/${this.toMD5()}.png`;
    }
}

export default ImageModel;