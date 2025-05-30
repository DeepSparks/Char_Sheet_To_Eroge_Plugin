import TagParserBase from './base.js';
import FrontConfig from '../front_config.js';
import { VoiceModel } from '../models/index.js';
import BackendInterface from '../backend-interface.js';

class VoiceTagParser extends TagParserBase {
    static async parseTagsFromContent(content) {
        const OTHER_TAG_NAME = "Other";
        const CHECK_ATTRIBUTES = VoiceModel.getCheckAttributes();
        

        const TAG_REGEX = new RegExp(`<${FrontConfig.TAG_NAMES.VOICE}\\s+([^>]+)\\/>`, 'g');
        const matches = [...content.matchAll(TAG_REGEX)];

        let names_to_check = []
        for (const match of matches) {
            const attributesStr = match[1];
            
            let attributes = this.targeted_parse_attributes(attributesStr, CHECK_ATTRIBUTES);
            if(attributes.name && attributes.name !== OTHER_TAG_NAME && !names_to_check.includes(attributes.name)) {
                names_to_check.push(attributes.name);
            }
        }
        const existsCharacters = await BackendInterface.isCharactersExists(names_to_check);


        const fullTagModelsMap = {};
        const otherTagModelsMap = {};
        for (const match of matches) {
            const fullTag = match[0];
            const attributesStr = match[1];
            
            let attributes = this.targeted_parse_attributes(attributesStr, CHECK_ATTRIBUTES);
            
            const model = new VoiceModel(attributes);
            if(model.name === OTHER_TAG_NAME || !existsCharacters.has(model.name)) {
                otherTagModelsMap[fullTag] = model;
            }
            else {
                fullTagModelsMap[fullTag] = model;
            }
        }


        return {
            fullTagModelsMap,
            otherTagModelsMap
        }
    }
}

export default VoiceTagParser;