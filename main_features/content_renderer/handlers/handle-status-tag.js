import { StatusTagParser } from '../parsers/index.js';

export default function handleStatusTag(content) {
    const statusTagModelMap = StatusTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(statusTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(statusTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }
    const statusModel = statusTagModelMap[Object.keys(statusTagModelMap)[0]];
    if(!statusModel) {
        return { content, content_for_status: "" };
    }

    const statusJsonDict = statusModel.toJsonDict();
    let content_for_status = ""
    for(let attribute of Object.keys(statusJsonDict)) {
        const attribute_name = attribute.charAt(0).toUpperCase() + attribute.slice(1);
        content_for_status += `${attribute_name}: ${statusJsonDict[attribute]}\n`;
    }
    return { content, content_for_status };
}