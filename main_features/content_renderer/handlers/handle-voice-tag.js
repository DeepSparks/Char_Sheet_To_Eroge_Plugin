import { VoiceTagParser } from '../parsers/index.js';
import { VoiceProcessor } from '../processors/index.js';
import { VoiceRenderer } from '../renderers/index.js';
import BackendInterface from '../backend-interface.js';

export default async function handleVoiceTag(content, voiceCache, is_end_of_content, is_preview_loadding_triggered, resource_name) {
    const { fullTagModelsMap, otherTagModelsMap } = await VoiceTagParser.parseTagsFromContent(content, resource_name);
    if(Object.keys(fullTagModelsMap).length === 0) {
        return {
            result: content,
            wait_until_voices_generated: async () => {}
        };
    }

    const { urls, randomSeeds } = await VoiceProcessor.fetchOrGenerateVoices(
        fullTagModelsMap, is_end_of_content, voiceCache, resource_name
    );


    let result = content;

    for(let otherIndex = 0; otherIndex < Object.keys(otherTagModelsMap).length; otherIndex++) {
        const currentOtherTagWithText = Object.keys(otherTagModelsMap)[otherIndex];
        const currentVoiceModel = Object.values(otherTagModelsMap)[otherIndex];
        result = result.replace(currentOtherTagWithText, `\"${currentVoiceModel.text}\"`);
    }
    
    for(let tagIndex = 0; tagIndex < Object.keys(fullTagModelsMap).length; tagIndex++) {
        const currentFullTagWithText = Object.keys(fullTagModelsMap)[tagIndex];
        const currentVoiceModel = Object.values(fullTagModelsMap)[tagIndex];
        const currentVoiceUrl = VoiceRenderer.createVoiceUrl(urls[tagIndex], randomSeeds[tagIndex], is_end_of_content);
        const renderedVoicePlayer = VoiceRenderer.createVoicePlayer(currentVoiceUrl, is_end_of_content, is_preview_loadding_triggered);
        result = result.replace(currentFullTagWithText, `\"${currentVoiceModel.text}\"` + renderedVoicePlayer);
    }

    return {
        result,
        wait_until_voices_generated: async () => {
            if(Object.keys(fullTagModelsMap).length > 0) {
                await BackendInterface.generateVoices(Object.values(fullTagModelsMap), true, resource_name);
            }
        }
    }
}