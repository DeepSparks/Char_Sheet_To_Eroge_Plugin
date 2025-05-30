import md5 from 'md5';

import BaseModel from './base.js';
import FrontConfig from '../front_config.js';

class ImageModel extends BaseModel {
    constructor(attributes) {
        super(attributes);

        this.name = attributes.name || '';
        this.style_id = attributes.style_id || '';
        this.background_id = attributes.background_id || '';

        this.view = (FrontConfig.IS_NOT_USE_RANDOM_DYNAMIC_VIEW ? attributes.view : this.getDeterministicRandomView(attributes)) || '';
        this.pose = attributes.pose || '';
        this.expression = attributes.expression || '';
        this.background = attributes.background || '';
        this.nsfw = attributes.nsfw || 'none';
        this.etc_char = attributes.etc_char || '';
        this.etc_other = attributes.etc_other || '';

        this.common_prompt = attributes.common_prompt || '';
        this.common_negative_prompt = attributes.common_negative_prompt || '';
        this.character_prompt = attributes.character_prompt || '';

        this.common_prompt = [this.view, this.background, this.etc_other].filter(attr => attr).join(', ');

        const first_nsfw_keyword = this.nsfw.split(',')[0].trim();
        const left_nsfw_keywords = this.nsfw.split(',').slice(1).map(keyword => keyword.trim());
        if(first_nsfw_keyword === 'none') {
            this.nsfw = left_nsfw_keywords.join(', ');
            this.common_negative_prompt = 'nsfw';
        } else if(FrontConfig.MAP_KEYWORDS.NSFW[first_nsfw_keyword]) {
            if(FrontConfig.IS_NOT_USE_NSFW_PROMPT_MAP) {
                this.common_prompt = FrontConfig.DEFAULT_KEYWORDS.NSFW.join(', ') + ", " + this.common_prompt;
            }
            else {
                this.common_prompt = FrontConfig.DEFAULT_KEYWORDS.NSFW.join(', ') + ", " + this.common_prompt;
                this.nsfw = FrontConfig.MAP_KEYWORDS.NSFW[first_nsfw_keyword] + ", " + left_nsfw_keywords.join(', ');
            }
        }
        this.character_prompt = [this.nsfw, this.pose, this.expression, this.etc_char].filter(attr => attr).join(', ') || '';
    }

    getDeterministicRandomView(attributes) {
        const seed = JSON.stringify(attributes);
        const hash = md5(seed);
        
        const hashNumber = parseInt(hash.substring(0, 8), 16);
        const index = hashNumber % FrontConfig.RANDOM_KEYWORDS.VIEW.length;
        
        return FrontConfig.RANDOM_KEYWORDS.VIEW[index] + ", " + "dynamic angle";
    }

    toJsonDict() {
        return { ...this };
    }

    static getCheckAttributes() {
        return ['name', 'style_id', 'background_id', 'view', 'pose', 'expression', 'nsfw', 'etc_char', 'etc_other'];
    }
}

export default ImageModel;
