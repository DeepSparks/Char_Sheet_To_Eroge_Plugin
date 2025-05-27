import { ImageTagParser } from '../parsers/index.js';
import { ImageRenderer } from '../renderers/index.js';
import { ImageProcessor } from '../processors/index.js';
import { CONFIG } from '../constants.js';
import BackendInterface from '../backend-interface.js';

export default async function handleImageTag(content, front_contents, back_contents, imageCache, is_end_of_content) {
    const parsedResult = await ImageTagParser.parseTagsFromContent(content, front_contents, back_contents);
    if(parsedResult.isSingleOtherTag) {
        const currentUrl = ImageRenderer.createImageUrl(CONFIG.RESOURCES.WAITING_IMAGE, 1);
        const renderedSlide = ImageRenderer.createSlideContext(currentUrl, parsedResult.innerText);
        return {
            result: renderedSlide,
            wait_until_images_generated: async () => {}
        };
    }

    
    const { fullTagModelsMap, processedFullTagInnerTexts } = parsedResult;
    if(Object.keys(fullTagModelsMap).length === 0) {
        return {
            result: content,
            wait_until_images_generated: async () => {}
        };
    }
    

    const { urls, randomSeeds } = await ImageProcessor.fetchOrGenerateImages(
        fullTagModelsMap, is_end_of_content, imageCache
    );


    let result = "";
    for(let tagIndex = 0; tagIndex < Object.keys(fullTagModelsMap).length; tagIndex++) {
        const currentFullTag = Object.keys(fullTagModelsMap)[tagIndex];
        const currentSlideContext = processedFullTagInnerTexts[currentFullTag].text;

        const currentUrl = ImageRenderer.createImageUrl(urls[tagIndex], randomSeeds[tagIndex]);
        const renderedSlide = ImageRenderer.createSlideContext(currentUrl, currentSlideContext, is_end_of_content);

        result += renderedSlide;
    }
    return {
        result,
        wait_until_images_generated: async () => {
            if(Object.keys(fullTagModelsMap).length > 0) {
                await BackendInterface.generateImages(Object.values(fullTagModelsMap), true);
            }
        }
    }
}