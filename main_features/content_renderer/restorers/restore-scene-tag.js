import { CONFIG } from '../constants.js';

export default function restoreSceneTag(content) {
    const START_SCENE_TAG_REGEX = new RegExp(`<${CONFIG.TAG_NAMES.SCENE}\-([^\\s>]+)(?:\\s+([^>]*))?>`, 'g')
    const END_SCENE_TAG_REGEX = new RegExp(`<\\/${CONFIG.TAG_NAMES.SCENE}\-([^\\s>]+)>`, 'g')
    
    const start_scene_matches = [...content.matchAll(START_SCENE_TAG_REGEX)];
    const end_scene_matches = [...content.matchAll(END_SCENE_TAG_REGEX)];
    
    if(start_scene_matches.length > 0 && start_scene_matches.length !== end_scene_matches.length) {
        const tag_to_add = `</${CONFIG.TAG_NAMES.SCENE}-${start_scene_matches[start_scene_matches.length - 1][1]}>`;
        if(content.includes(`</${CONFIG.TAG_NAMES.SCENES}`)) {
            const scenes_tag_index = content.indexOf(`</${CONFIG.TAG_NAMES.SCENES}>`);
            content = content.slice(0, scenes_tag_index) + tag_to_add + content.slice(scenes_tag_index);
        } else {
            content += tag_to_add;
        }
    }

    return content;
}