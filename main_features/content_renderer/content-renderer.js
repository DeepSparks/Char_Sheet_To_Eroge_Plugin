import FrontConfig from './front_config.js';
import { ContentStatusModel } from './models/index.js';
import { handleStartTag, handleStatusTag, handleEventOptionsTag, handleCharacterTag, handleStyleTag, handleBackgroundTag, handleVoiceTag, handleImageTag } from './handlers/index.js';
import { VoiceCache, ImageCache } from './content_caches/index.js';
import { restoreSceneTag } from './restorers/index.js';
import { ProgressUIRenderer } from './renderers/index.js';
import Utils from '../utils.js';
import md5 from 'md5';

let voiceCaches = {};
let imageCaches = {};
let is_preview_loadding_triggered_set = new Set();

class ContentRenderer {
    static async renderContent(content) {
        const content_status = new ContentStatusModel(content);
    
        try {
            if(!content_status.is_start_of_content) {
                return content_status.raw_content
            }

            if(content_status.start_of_content_index !== -1) {
                content = content.slice(content_status.start_of_content_index);
            }


            const start_tag_parse_info = handleStartTag(content);
            content = start_tag_parse_info.content
            const start_model = start_tag_parse_info.start_model
            const resource_name = start_model.fixed_words

            if(!voiceCaches[resource_name]) {
                voiceCaches[resource_name] = new VoiceCache();
            }
            const voiceCache = voiceCaches[resource_name];

            if(!imageCaches[resource_name]) {
                imageCaches[resource_name] = new ImageCache();
            }
            const imageCache = imageCaches[resource_name];


            let preview_check_key = md5(content_status.raw_content.slice(0, 1500));
            if(content_status.is_preview_loading_trigger) {
                if(!is_preview_loadding_triggered_set.has(preview_check_key)) {
                    is_preview_loadding_triggered_set.add(preview_check_key);
                }
            }
            let is_preview_loadding_triggered = is_preview_loadding_triggered_set.has(preview_check_key) && !content_status.is_end_of_content;
    
            let front_contents = []
            let back_contents = []
            let waiting_functions = []
    
    
            if(content_status.is_status_tag_included) {
                const status_parse_info = handleStatusTag(content);
                content = status_parse_info.content
                front_contents.push(status_parse_info.content_for_status)
            }
    
            if(content_status.is_event_options_tag_included) {
                const event_options_parse_info = handleEventOptionsTag(content);
                content = event_options_parse_info.content
                back_contents.push(event_options_parse_info.content_for_event_options)
            }
    
    
            let processed_characters = []
            if(content_status.is_character_tag_included) {
                const character_tag_parse_info = await handleCharacterTag(content, resource_name);
                content = character_tag_parse_info.content
                processed_characters = character_tag_parse_info.processed_characters
            }
    
            let processed_styles = []
            if(content_status.is_style_tag_included) {
                const style_tag_parse_info = await handleStyleTag(content, resource_name);
                content = style_tag_parse_info.content
                processed_styles = style_tag_parse_info.processed_styles
            }

            let processed_backgrounds = []
            if(content_status.is_background_tag_included) {
                const background_tag_parse_info = await handleBackgroundTag(content, resource_name);
                content = background_tag_parse_info.content
                processed_backgrounds = background_tag_parse_info.processed_backgrounds
            }
    
    
            if(content_status.is_voice_tag_included) {
                const voice_tag_parse_info = await handleVoiceTag(content, voiceCache, content_status.is_end_of_content, is_preview_loadding_triggered, resource_name);
                content = voice_tag_parse_info.result

                if(content_status.is_end_of_content && voice_tag_parse_info.wait_until_voices_generated) {
                    waiting_functions.push(async () => {
                        await voice_tag_parse_info.wait_until_voices_generated();
                    })
                }
            }
    
            if(content_status.is_scene_tag_included) {
                content = restoreSceneTag(content);
                const image_tag_parse_info = await handleImageTag(content, front_contents, back_contents, imageCache, content_status.is_end_of_content, resource_name);
                content = image_tag_parse_info.result
                if(content_status.is_end_of_content && image_tag_parse_info.wait_until_images_generated) {
                    waiting_functions.push(async () => {
                        await image_tag_parse_info.wait_until_images_generated();
                    })
                }
            }
    
    
            if(content_status.is_end_of_content) {
                for(let waiting_function of waiting_functions) {
                    await waiting_function();
                }
            }
    
            if(content_status.is_processing()) {
                return ProgressUIRenderer.renderContent(content_status, processed_characters, processed_styles, processed_backgrounds, resource_name) + FrontConfig.ALL_STYLES;
            }
            

            if(is_preview_loadding_triggered) {
                return content + `<div class="preview-loading-container">
<p class="progress-text">미리보기가 로드되었습니다. 최종 결과까지는 시간이 걸리며, 재랜더링으로 재생이 끊길 수 있습니다.</p>
</div>` + FrontConfig.ALL_STYLES
            }

            return content + FrontConfig.ALL_STYLES
    
        } catch (error) {
            Utils.logErrorToFile(error);
            Utils.logToFile("Error while rendering content: \n" + content_status.raw_content, "error");
            return content_status.raw_content;
        }
    }
}

export default ContentRenderer;
