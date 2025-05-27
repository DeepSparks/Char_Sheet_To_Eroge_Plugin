import { CONFIG } from '../constants.js';
import { EventOptionsTagParser } from '../parsers/index.js';
import { RandomUtil } from '../../utils/index.js';

export default function handleEventOptionsTag(content) {
    const eventOptionsTagModelMap = EventOptionsTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(eventOptionsTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(eventOptionsTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    const eventOptionsModel = eventOptionsTagModelMap[Object.keys(eventOptionsTagModelMap)[0]];
    if(!eventOptionsModel) {
        return { content, content_for_event_options: "" };
    }

    const eventOptionsJsonDict = eventOptionsModel.toJsonDict();
    let content_for_event_options = ""
    if(eventOptionsJsonDict.first && eventOptionsJsonDict.second && eventOptionsJsonDict.third) {
        if(CONFIG.IS_USE_RANDOM_EVENT_SELECTION) {
            const event_options = [eventOptionsJsonDict.first, eventOptionsJsonDict.second, eventOptionsJsonDict.third];
            const randomEvent = RandomUtil.get_random_integer(0, 2);
            content_for_event_options = `## Random Event Selection\nNEXT EVENT: ${event_options[randomEvent]}`;
        } else {
            content_for_event_options = `${CONFIG.EVENT_OPTIONS_HEADER}\n1. ${eventOptionsJsonDict.first}\n2. ${eventOptionsJsonDict.second}\n3. ${eventOptionsJsonDict.third}`;
        }
    }
    return { content, content_for_event_options };
}