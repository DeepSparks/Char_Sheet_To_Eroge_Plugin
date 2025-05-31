import BaseModel from './base.js';
import FrontConfig from '../front_config.js';

class ContentStatusModel extends BaseModel {
    constructor(content) {
        super(content);

        this.raw_content = content;


        this.match_start_of_content = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.START}.*\/>`))
        this.match_end_of_content = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.END}.*\/>`))

        this.match_end_of_scenes = content.match(new RegExp(`</${FrontConfig.TAG_NAMES.SCENES}>`))

        this.match_event_options = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.EVENT_OPTIONS}.*\/>`))
        this.match_status = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.STATUS}.*\/>`))
        this.match_character = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.CHARACTER}.*\/>`))
        this.match_style = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.STYLE}.*\/>`))
        this.match_background = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.BACKGROUND}.*\/>`))
        this.match_scene = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.SCENE}\-.*>`))
        this.match_voice = content.match(new RegExp(`<${FrontConfig.TAG_NAMES.VOICE}.*>`))


        this.is_start_of_content = this.match_start_of_content ? true : false;
        this.start_of_content_index = this.match_start_of_content ? this.match_start_of_content.index : -1;

        this.is_end_of_content = this.match_end_of_content ? true : false;
        this.end_of_content_index = this.match_end_of_content ? this.match_end_of_content.index : -1;

        this.is_preview_loading_trigger = this.match_end_of_scenes || this.match_event_options;
    
        this.is_status_tag_included = this.match_status ? true : false;
        this.is_event_options_tag_included = this.match_event_options ? true : false;

        this.is_character_tag_included = this.match_character ? true : false;
        this.is_style_tag_included = this.match_style ? true : false;
        this.is_background_tag_included = this.match_background ? true : false;

        this.is_scene_tag_included = this.match_scene ? true : false;
        this.is_voice_tag_included = this.match_voice ? true : false;
    }

    is_processing() {
        return (!this.is_scene_tag_included) && (!this.is_voice_tag_included) && (this.is_start_of_content || this.is_status_tag_included || this.is_event_options_tag_included || this.is_character_tag_included || this.is_style_tag_included || this.is_background_tag_included)
    }
}

export default ContentStatusModel;
