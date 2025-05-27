import { BackgroundTagParser } from '../parsers/index.js';
import BackendInterface from '../backend-interface.js';

export default async function handleBackgroundTag(content) {
    const backgroundTagModelMap = BackgroundTagParser.parseTagsFromContent(content);
    for(let tagIndex = 0; tagIndex < Object.keys(backgroundTagModelMap).length; tagIndex++) {
        const currentFullTag = Object.keys(backgroundTagModelMap)[tagIndex];
        content = content.replace(currentFullTag, "");
    }

    await BackendInterface.addBackgrounds(Object.values(backgroundTagModelMap));

    return {
        content: content,
        processed_backgrounds: Object.values(backgroundTagModelMap)
    }
}