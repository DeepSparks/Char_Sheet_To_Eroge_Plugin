import { StartTagParser } from '../parsers/index.js';

export default function handleStartTag(content) {
    const startTagModelMap = StartTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(startTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(startTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }
    const startModel = startTagModelMap[Object.keys(startTagModelMap)[0]];
    if(!startModel) {
        return { content, start_model: null };
    }

    return { content, start_model: startModel.toJsonDict() };
}