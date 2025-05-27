import { StyleTagParser } from '../parsers/index.js';
import BackendInterface from '../backend-interface.js';

export default async function handleStyleTag(content) {
    const styleTagModelMap = StyleTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(styleTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(styleTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    await BackendInterface.addStyles(Object.values(styleTagModelMap));

    return content;
}