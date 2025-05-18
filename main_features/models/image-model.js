import md5 from 'md5';

import CharacterMemoryInterface from '../interfaces/character-memory-interface.js';
import keywordProcessors from '../processors/keyword_processors/index.js';
import Config from '../config.js';

class ImageModel {
    constructor(req_body) {
        this.common_prompt = req_body.common_prompt || '';
        this.character_prompts = req_body.character_prompts || [];


        const characters = this.character_prompts.map(prompt => {
            return {
                name: prompt.name,
                style_id: prompt.style_id
            }
        });

        const name_prompt_map = {};
        if(characters.length > 0) {
            const charactersInfos = CharacterMemoryInterface.getCharacters(characters).filter(character => character !== null);
            for(let charactersInfo of charactersInfos) {
                name_prompt_map[charactersInfo.name] = {
                    gender: charactersInfo.gender,
                    prompt: charactersInfo.toPrompt()
                }
            }
        }
        this.character_prompts = this.character_prompts.filter(prompt => {
            return name_prompt_map[prompt.name] !== undefined;
        });
        
        
        this.character_prompts = this.character_prompts.map(prompt => {
            return {
                name: prompt.name,
                style_id: prompt.style_id,
                prompt: prompt.prompt,
                gender: name_prompt_map[prompt.name].gender,
                concat_prompt: name_prompt_map[prompt.name].prompt + ', ' + prompt.prompt
            }
        });


        this.girl_count = this.character_prompts.filter(character_prompt => character_prompt.gender.includes('girl')).length;
        this.boy_count = this.character_prompts.filter(character_prompt => character_prompt.gender.includes('boy')).length;

        this.person_keywords = []

        if(this.girl_count > 0) {
            this.person_keywords.push(this.girl_count == 1 ? '1girl' : `${this.girl_count}girls`);
        }
        if(this.boy_count > 0) {
            this.person_keywords.push(this.boy_count == 1 ? '1boy' : `${this.boy_count}boys`);
        }

        
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