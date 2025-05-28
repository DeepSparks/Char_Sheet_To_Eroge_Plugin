import BaseModel from './base.js';
import { CONFIG } from '../constants.js';

class ImageModel extends BaseModel {
    constructor(attributes) {
        super(attributes);

        this.name = attributes.name || '';
        this.style_id = attributes.style_id || '';
        this.background_id = attributes.background_id || '';

        this.view = attributes.view || '';
        this.pose = attributes.pose || '';
        this.expression = attributes.expression || '';
        this.background = attributes.background || '';
        this.nsfw = attributes.nsfw || 'none';
        this.etc_char = attributes.etc_char || '';
        this.etc_other = attributes.etc_other || '';

        this.common_prompt = attributes.common_prompt || '';
        this.common_negative_prompt = attributes.common_negative_prompt || '';
        this.character_prompt = attributes.character_prompt || '';


        this.common_prompt = [attributes.background, attributes.etc_other].filter(attr => attr).join(', '); // attributes.view는 퀄리티 이슈로 제외

        let nsfw_prompt = attributes.nsfw || 'none';
        if(nsfw_prompt === 'none') {
            this.common_negative_prompt = 'nsfw';
            nsfw_prompt = '';
        }
        else if(CONFIG.NSFW_PROMPT_MAP[nsfw_prompt]) {
            this.common_prompt = "nsfw, explicit, open clothes, uncensored, " + this.common_prompt;
            nsfw_prompt = CONFIG.NSFW_PROMPT_MAP[nsfw_prompt];
        }
        this.character_prompt = [nsfw_prompt, attributes.pose, attributes.expression, attributes.etc_char].filter(attr => attr).join(', ') || '';
    }

    toJsonDict() {
        return { ...this };
    }

    static getCheckAttributes() {
        return ['name', 'style_id', 'background_id', 'view', 'pose', 'expression', 'background', 'nsfw', 'etc_char', 'etc_other'];
    }
}

export default ImageModel;
