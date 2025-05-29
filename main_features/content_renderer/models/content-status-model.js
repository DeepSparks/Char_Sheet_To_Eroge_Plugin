import BaseModel from './base.js';
import { CONFIG } from '../constants.js';

class ContentStatusModel extends BaseModel {
    constructor(content) {
        super(content);

        this.raw_content = content;

        this.is_start_of_content = content.includes(`<${CONFIG.TAG_NAMES.START}/>`);
        this.start_of_content_index = content.indexOf(`<${CONFIG.TAG_NAMES.START}/>`);
        this.is_end_of_content = content.includes(`<${CONFIG.TAG_NAMES.END}/>`);
        this.is_preview_loading_trigger = content.includes(`</${CONFIG.TAG_NAMES.SCENES}>`) || content.includes(`<${CONFIG.TAG_NAMES.EVENT_OPTIONS}`);
    
        this.is_status_tag_included = content.includes(`<${CONFIG.TAG_NAMES.STATUS}`);
        this.is_character_tag_included = content.includes(`<${CONFIG.TAG_NAMES.CHARACTER}`);

        this.is_style_tag_included = content.includes(`<${CONFIG.TAG_NAMES.STYLE}`);
        this.is_event_options_tag_included = content.includes(`<${CONFIG.TAG_NAMES.EVENT_OPTIONS}`);
        this.is_background_tag_included = content.includes(`<${CONFIG.TAG_NAMES.BACKGROUND}`);
        
        this.is_scene_tag_included = content.includes(`<${CONFIG.TAG_NAMES.SCENE}`);
        this.is_voice_tag_included = content.includes(`<${CONFIG.TAG_NAMES.VOICE}`);
    }

    is_processing() {
        return (!this.is_scene_tag_included) && (!this.is_voice_tag_included) && (this.is_status_tag_included || this.is_event_options_tag_included || this.is_character_tag_included || this.is_style_tag_included)
    }
}

export default ContentStatusModel;
