import { IMAGE_CONTAINER_STYLES, VOICE_CONTAINER_STYLES } from './constants.js';
import { ContentStatusModel } from './models/index.js';
import { handleStatusTag, handleEventOptionsTag, handleCharacterTag, handleStyleTag, handleBackgroundTag, handleVoiceTag, handleImageTag } from './handlers/index.js';
import { VoiceCache, ImageCache } from './content_caches/index.js';
import { restoreSceneTag } from './restorers/index.js';
import Utils from '../utils.js';

let voiceCache = new VoiceCache();
let imageCache = new ImageCache();

class ContentRenderer {
    static async renderContent(content) {
        const content_status = new ContentStatusModel(content);
    
        try {
            if(!content_status.is_start_of_content) {
                return content_status.raw_content
            }
    
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
    
    
            if(content_status.is_character_tag_included) {
                content = await handleCharacterTag(content);
            }
    
            if(content_status.is_style_tag_included) {
                content = await handleStyleTag(content);
            }

            if(content_status.is_background_tag_included) {
                content = await handleBackgroundTag(content);
            }
    
    
            if(content_status.is_voice_tag_included) {
                const voice_tag_parse_info = await handleVoiceTag(content, voiceCache, content_status.is_end_of_content);
                content = voice_tag_parse_info.result

                if(content_status.is_end_of_content && voice_tag_parse_info.wait_until_voices_generated) {
                    waiting_functions.push(async () => {
                        await voice_tag_parse_info.wait_until_voices_generated();
                    })
                }
            }
    
            if(content_status.is_scene_tag_included) {
                content = restoreSceneTag(content);
                const image_tag_parse_info = await handleImageTag(content, front_contents, back_contents, imageCache, content_status.is_end_of_content);
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
                return `Content is processing... Please wait a moment. (${content_status.raw_content.length} characters generated)`
            }
            
            return content + IMAGE_CONTAINER_STYLES + VOICE_CONTAINER_STYLES
    
        } catch (error) {
            Utils.logErrorToFile(error);
            Utils.logToFile("Error while rendering content: \n" + content_status.raw_content, "error");
            return content_status.raw_content;
        }
    }
}

export default ContentRenderer;
